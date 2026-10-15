
package com.aimrelax.aimrelax_live

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.BroadcastReceiver
import android.content.IntentFilter
import android.net.Uri
import android.provider.Settings
import android.content.pm.PackageManager
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.Bundle
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import io.livekit.android.LiveKit
import io.livekit.android.audio.ScreenAudioCapturer
import io.livekit.android.room.Room
import io.livekit.android.room.track.LocalAudioTrack
import io.livekit.android.room.track.LocalVideoTrack
import io.livekit.android.room.track.Track
import io.livekit.android.room.track.screencapture.ScreenCaptureParams
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import livekit.org.webrtc.audio.JavaAudioDeviceModule

class MainActivity : FlutterActivity() {

    companion object {
        private const val CHANNEL = "aimrelax.live/livekit"
        private const val SCREEN_CAPTURE_REQUEST = 9001
        private const val RECORD_AUDIO_REQUEST = 9002
    }

    private lateinit var methodChannel: MethodChannel

    private var room: Room? = null
    private var audioCapturer: ScreenAudioCapturer? = null

    @Volatile
    private var micEnabled = true

    @Volatile
    private var livePaused = false

    private var pendingResult: MethodChannel.Result? = null
    private var pendingToken: String? = null
    private var pendingUrl: String? = null
    private var overlayReceiverRegistered = false

    private val overlayMicReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: android.content.Context?, intent: Intent?) {
            when (intent?.action) {
                LiveOverlayService.ACTION_MIC -> {
                    scope.launch(Dispatchers.IO) {
                        try {
                            val liveRoom = room ?: return@launch
                            val next = !micEnabled
                            val audioModule = liveRoom.lkObjects.audioDeviceModule as? JavaAudioDeviceModule
                                ?: return@launch
                            audioModule.setAudioRecordEnabled(next)
                            micEnabled = next
                            launch(Dispatchers.Main) {
                                methodChannel.invokeMethod("overlayMicChanged", next)
                            }
                            updateOverlay(viewers = -1, mic = next)
                        } catch (_: Exception) { }
                    }
                }
                LiveOverlayService.ACTION_PAUSE -> {
                    scope.launch(Dispatchers.IO) {
                        try {
                            val liveRoom = room ?: return@launch
                            val nextPaused = !livePaused
                            val screenTrack = liveRoom.localParticipant
                                .getTrackPublication(Track.Source.SCREEN_SHARE)?.track as? LocalVideoTrack
                            val audioTrack = liveRoom.localParticipant
                                .getTrackPublication(Track.Source.MICROPHONE)?.track as? LocalAudioTrack

                            if (nextPaused) {
                                screenTrack?.pauseUpstream()
                                audioTrack?.pauseUpstream()
                            } else {
                                screenTrack?.resumeUpstream()
                                audioTrack?.resumeUpstream()
                            }
                            livePaused = nextPaused
                            launch(Dispatchers.Main) {
                                methodChannel.invokeMethod("overlayPauseChanged", nextPaused)
                            }
                            updateOverlay(viewers = -1, mic = micEnabled, paused = nextPaused)
                        } catch (_: Exception) { }
                    }
                }
                LiveOverlayService.ACTION_END_LIVE -> {
                    runOnUiThread {
                        methodChannel.invokeMethod("overlayStopRequested", null)
                    }
                }
            }
        }
    }

    private val scope =
        CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun configureFlutterEngine(
        flutterEngine: FlutterEngine
    ) {
        super.configureFlutterEngine(flutterEngine)

        methodChannel = MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL
        )

        if (!overlayReceiverRegistered) {
            val overlayFilter = IntentFilter().apply {
                addAction(LiveOverlayService.ACTION_MIC)
                addAction(LiveOverlayService.ACTION_PAUSE)
                addAction(LiveOverlayService.ACTION_END_LIVE)
            }
            ContextCompat.registerReceiver(this, overlayMicReceiver, overlayFilter, ContextCompat.RECEIVER_NOT_EXPORTED)
            overlayReceiverRegistered = true
        }

        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {

                "showOverlay" -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                        !Settings.canDrawOverlays(this)
                    ) {
                        val settingsIntent = Intent(
                            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:$packageName")
                        )
                        startActivity(settingsIntent)
                        result.success(false)
                    } else {
                        val intent = Intent(this, LiveOverlayService::class.java).apply {
                            action = LiveOverlayService.ACTION_UPDATE
                            putExtra("viewers", call.argument<Int>("viewers") ?: 0)
                            putExtra("mic", micEnabled)
                            putExtra("paused", livePaused)
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) startForegroundService(intent)
                        else startService(intent)
                        result.success(true)
                    }
                }

                "updateOverlay" -> {
                    updateOverlay(
                        viewers = call.argument<Int>("viewers") ?: -1,
                        mic = call.argument<Boolean>("mic") ?: micEnabled,
                        comments = call.argument<ArrayList<String>>("comments"),
                        paused = call.argument<Boolean>("paused") ?: livePaused
                    )
                    result.success(true)
                }

                "hideOverlay" -> {
                    stopService(Intent(this, LiveOverlayService::class.java).setAction(LiveOverlayService.ACTION_STOP))
                    result.success(true)
                }

                "startLive" -> {
                    val token =
                        call.argument<String>("token")
                    val url =
                        call.argument<String>("url")

                    if (token.isNullOrBlank() ||
                        url.isNullOrBlank()
                    ) {
                        result.error(
                            "INVALID_ARGUMENT",
                            "LiveKit token or URL is missing",
                            null
                        )
                        return@setMethodCallHandler
                    }

                    if (Build.VERSION.SDK_INT <
                        Build.VERSION_CODES.Q
                    ) {
                        result.error(
                            "UNSUPPORTED",
                            "Android 10 or newer is required",
                            null
                        )
                        return@setMethodCallHandler
                    }

                    pendingResult = result
                    pendingToken = token
                    pendingUrl = url

                    requestAudioPermission()
                }

                "setMicEnabled" -> {
                    val enabled =
                        call.argument<Boolean>("enabled")

                    if (enabled == null) {
                        result.error(
                            "INVALID_ARGUMENT",
                            "Missing enabled value",
                            null
                        )
                    } else {
                        scope.launch(Dispatchers.IO) {
                            try {
                                val liveRoom = room
                                    ?: throw Exception(
                                        "LIVE is not running"
                                    )

                                val audioModule =
                                    liveRoom.lkObjects
                                        .audioDeviceModule
                                        as? JavaAudioDeviceModule
                                    ?: throw Exception(
                                        "Audio device module unavailable"
                                    )

                                audioModule
                                    .setAudioRecordEnabled(enabled)

                                micEnabled = enabled

                                launch(Dispatchers.Main) {
                                    result.success(true)
                                }
                            } catch (e: Exception) {
                                launch(Dispatchers.Main) {
                                    result.error(
                                        "MIC_TOGGLE_FAILED",
                                        e.message
                                            ?: "Could not change microphone",
                                        null
                                    )
                                }
                            }
                        }
                    }
                }

                "stopLive" -> {
                    stopLive()
                    result.success(true)
                }

                else -> result.notImplemented()
            }
        }
    }

    private fun requestAudioPermission() {
        if (
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            requestScreenCapture()
            return
        }

        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.RECORD_AUDIO),
            RECORD_AUDIO_REQUEST
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(
            requestCode,
            permissions,
            grantResults
        )

        if (requestCode != RECORD_AUDIO_REQUEST) return

        if (
            grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED
        ) {
            requestScreenCapture()
        } else {
            pendingResult?.error(
                "AUDIO_PERMISSION_DENIED",
                "RECORD_AUDIO permission is required",
                null
            )
            clearPending()
        }
    }

    private fun requestScreenCapture() {
        val manager = getSystemService(
            MEDIA_PROJECTION_SERVICE
        ) as MediaProjectionManager

        startActivityForResult(
            manager.createScreenCaptureIntent(),
            SCREEN_CAPTURE_REQUEST
        )
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(
            requestCode,
            resultCode,
            data
        )

        if (requestCode != SCREEN_CAPTURE_REQUEST) return

        if (resultCode != Activity.RESULT_OK || data == null) {
            pendingResult?.error(
                "SCREEN_CAPTURE_CANCELLED",
                "Screen capture permission was cancelled",
                null
            )
            clearPending()
            return
        }

        val token = pendingToken
        val url = pendingUrl

        if (token.isNullOrBlank() || url.isNullOrBlank()) {
            pendingResult?.error(
                "INVALID_STATE",
                "LiveKit credentials are missing",
                null
            )
            clearPending()
            return
        }

        connectAndStart(url, token, data)
    }

    private fun connectAndStart(
        url: String,
        token: String,
        screenData: Intent
    ) {
        scope.launch(Dispatchers.IO) {
            try {
                if (room == null) {
                    room = LiveKit.create(application)
                }

                val liveRoom = room
                    ?: throw Exception(
                        "LiveKit room creation failed"
                    )

                liveRoom.connect(url, token)

                liveRoom.localParticipant
                    .setScreenShareEnabled(
                        true,
                        ScreenCaptureParams(screenData)
                    )

                val screenTrack =
                    liveRoom.localParticipant
                        .getTrackPublication(
                            Track.Source.SCREEN_SHARE
                        )?.track as? LocalVideoTrack
                    ?: throw Exception(
                        "Screen share track was not created"
                    )

                liveRoom.localParticipant
                    .setMicrophoneEnabled(true)

                val audioTrack =
                    liveRoom.localParticipant
                        .getTrackPublication(
                            Track.Source.MICROPHONE
                        )?.track as? LocalAudioTrack
                    ?: throw Exception(
                        "Audio track was not created"
                    )

                audioCapturer =
                    ScreenAudioCapturer
                        .createFromScreenShareTrack(screenTrack)
                    ?: throw Exception(
                        "ScreenAudioCapturer could not be created"
                    )

                audioCapturer?.gain = 1.0f

                audioTrack.setAudioBufferCallback(
                    audioCapturer!!
                )

                launch(Dispatchers.Main) {
                    micEnabled = true
                    livePaused = false
                    pendingResult?.success(true)
                    clearPending()
                }
            } catch (e: Exception) {
                launch(Dispatchers.Main) {
                    pendingResult?.error(
                        "LIVE_START_FAILED",
                        e.message ?: "Failed to start LIVE",
                        null
                    )
                    clearPending()
                }
            }
        }
    }

    private fun updateOverlay(viewers: Int, mic: Boolean, comments: ArrayList<String>? = null, paused: Boolean = livePaused) {
        val intent = Intent(this, LiveOverlayService::class.java).apply {
            action = LiveOverlayService.ACTION_UPDATE
            if (viewers >= 0) putExtra("viewers", viewers)
            putExtra("mic", mic)
            putExtra("paused", paused)
            if (comments != null) putStringArrayListExtra("comments", comments)
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) startService(intent) else startService(intent)
        } catch (_: Exception) { }
    }

    private fun stopLive() {
        stopService(Intent(this, LiveOverlayService::class.java).setAction(LiveOverlayService.ACTION_STOP))
        scope.launch(Dispatchers.IO) {
            try {
                val liveRoom = room

                val audioTrack =
                    liveRoom?.localParticipant
                        ?.getTrackPublication(
                            Track.Source.MICROPHONE
                        )?.track as? LocalAudioTrack

                audioTrack?.setAudioBufferCallback(null)

                liveRoom?.localParticipant
                    ?.setMicrophoneEnabled(false)

                liveRoom?.localParticipant
                    ?.setScreenShareEnabled(false)

                audioCapturer?.releaseAudioResources()
                audioCapturer = null

                liveRoom?.disconnect()
            } catch (_: Exception) {
                // Cleanup best effort.
            }

            room = null
            micEnabled = true
            livePaused = false
        }
    }

    private fun clearPending() {
        pendingResult = null
        pendingToken = null
        pendingUrl = null
    }

    override fun onDestroy() {
        if (overlayReceiverRegistered) {
            try { unregisterReceiver(overlayMicReceiver) } catch (_: Exception) { }
            overlayReceiverRegistered = false
        }
        stopLive()
        scope.cancel()
        super.onDestroy()
    }
}
