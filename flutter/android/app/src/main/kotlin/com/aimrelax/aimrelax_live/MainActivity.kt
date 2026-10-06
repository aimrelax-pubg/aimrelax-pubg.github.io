package com.aimrelax.aimrelax_live

import android.Manifest
import android.app.Activity
import android.content.Intent
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
import kotlinx.coroutines.launch
import kotlinx.coroutines.cancel

class MainActivity : FlutterActivity() {

    companion object {
        private const val CHANNEL = "aimrelax.live/livekit"
        private const val SCREEN_CAPTURE_REQUEST = 9001
        private const val RECORD_AUDIO_REQUEST = 9002
    }

    private lateinit var methodChannel: MethodChannel

    private var room: Room? = null
    private var audioCapturer: ScreenAudioCapturer? = null

    private var pendingResult: MethodChannel.Result? = null
    private var pendingToken: String? = null
    private var pendingUrl: String? = null

    private val scope =
        CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        methodChannel = MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL
        )

        methodChannel.setMethodCallHandler { call, result ->

            when (call.method) {

                "startLive" -> {

                    val token = call.argument<String>("token")
                    val url = call.argument<String>("url")

                    if (token.isNullOrBlank() || url.isNullOrBlank()) {
                        result.error(
                            "INVALID_ARGUMENT",
                            "LiveKit token or URL is missing",
                            null
                        )
                        return@setMethodCallHandler
                    }

                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
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

        if (requestCode != RECORD_AUDIO_REQUEST) {
            return
        }

        if (
            grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED
        ) {
            requestScreenCapture()
        } else {
            pendingResult?.error(
                "AUDIO_PERMISSION_DENIED",
                "RECORD_AUDIO permission is required for internal audio capture",
                null
            )
            clearPending()
        }
    }

    private fun requestScreenCapture() {

        val manager =
            getSystemService(MEDIA_PROJECTION_SERVICE)
                    as MediaProjectionManager

        val intent =
            manager.createScreenCaptureIntent()

        startActivityForResult(
            intent,
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

        if (requestCode != SCREEN_CAPTURE_REQUEST) {
            return
        }

        if (
            resultCode != Activity.RESULT_OK ||
            data == null
        ) {
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

        if (
            token.isNullOrBlank() ||
            url.isNullOrBlank()
        ) {
            pendingResult?.error(
                "INVALID_STATE",
                "LiveKit credentials are missing",
                null
            )
            clearPending()
            return
        }

        connectAndStart(
            url,
            token,
            data
        )
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

                liveRoom.connect(
                    url,
                    token
                )

                liveRoom.localParticipant
                    .setScreenShareEnabled(
                        true,
                        ScreenCaptureParams(screenData)
                    )

                val screenTrack =
                    liveRoom.localParticipant
                        .getTrackPublication(
                            Track.Source.SCREEN_SHARE
                        )
                        ?.track as? LocalVideoTrack
                        ?: throw Exception(
                            "Screen share track was not created"
                        )

                liveRoom.localParticipant
                    .setMicrophoneEnabled(true)

                val audioTrack =
                    liveRoom.localParticipant
                        .getTrackPublication(
                            Track.Source.MICROPHONE
                        )
                        ?.track as? LocalAudioTrack
                        ?: throw Exception(
                            "Audio track was not created"
                        )

                audioCapturer =
                    ScreenAudioCapturer
                        .createFromScreenShareTrack(
                            screenTrack
                        )
                        ?: throw Exception(
                            "ScreenAudioCapturer could not be created"
                        )

                audioCapturer?.gain = 1.0f

                audioTrack.setAudioBufferCallback(
                    audioCapturer!!
                )

                launch(Dispatchers.Main) {
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

    private fun stopLive() {

        scope.launch(Dispatchers.IO) {

            try {

                val liveRoom = room

                val audioTrack =
                    liveRoom
                        ?.localParticipant
                        ?.getTrackPublication(
                            Track.Source.MICROPHONE
                        )
                        ?.track as? LocalAudioTrack

                audioTrack?.setAudioBufferCallback(null)

                liveRoom
                    ?.localParticipant
                    ?.setMicrophoneEnabled(false)

                liveRoom
                    ?.localParticipant
                    ?.setScreenShareEnabled(false)

                audioCapturer
                    ?.releaseAudioResources()

                audioCapturer = null

                liveRoom?.disconnect()

            } catch (_: Exception) {
            }

            room = null
        }
    }

    private fun clearPending() {
        pendingResult = null
        pendingToken = null
        pendingUrl = null
    }

    override fun onDestroy() {
        stopLive()
        scope.cancel()
        super.onDestroy()
    }
}
