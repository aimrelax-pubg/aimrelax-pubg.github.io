package com.aimrelax.aimrelax_live

import android.app.Activity
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.Bundle
import androidx.annotation.RequiresApi
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import io.livekit.android.LiveKit
import io.livekit.android.audio.ScreenAudioCapturer
import io.livekit.android.room.track.LocalAudioTrack
import io.livekit.android.room.track.LocalVideoTrack
import io.livekit.android.room.track.Track
import io.livekit.android.room.track.screencapture.ScreenCaptureParams
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class MainActivity : FlutterActivity() {

    companion object {
        private const val CHANNEL = "aimrelax.live/livekit"
        private const val SCREEN_CAPTURE_REQUEST = 9001
    }

    private lateinit var channel: MethodChannel

    private var room: io.livekit.android.room.Room? = null
    private var audioCapturer: ScreenAudioCapturer? = null

    private var pendingStartResult: MethodChannel.Result? = null
    private var pendingToken: String? = null
    private var pendingUrl: String? = null

    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.Main.immediate
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        channel = MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            CHANNEL
        )

        channel.setMethodCallHandler { call, result ->

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
                            "Internal audio capture requires Android 10+",
                            null
                        )
                        return@setMethodCallHandler
                    }

                    if (pendingStartResult != null) {
                        result.error(
                            "BUSY",
                            "A LIVE start request is already in progress",
                            null
                        )
                        return@setMethodCallHandler
                    }

                    pendingToken = token
                    pendingUrl = url
                    pendingStartResult = result

                    requestScreenCapture()
                }

                "stopLive" -> {
                    stopLive()

                    result.success(true)
                }

                else -> {
                    result.notImplemented()
                }
            }
        }
    }

    private fun requestScreenCapture() {

        val manager =
            getSystemService(MEDIA_PROJECTION_SERVICE)
                    as MediaProjectionManager

        val intent = manager.createScreenCaptureIntent()

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
            pendingStartResult?.error(
                "SCREEN_CAPTURE_CANCELLED",
                "Screen capture permission was cancelled",
                null
            )

            clearPendingStart()

            return
        }

        val token = pendingToken
        val url = pendingUrl

        if (
            token.isNullOrBlank() ||
            url.isNullOrBlank()
        ) {
            pendingStartResult?.error(
                "INVALID_STATE",
                "Missing LiveKit credentials",
                null
            )

            clearPendingStart()

            return
        }

        startLiveKit(
            url,
            token,
            data
        )
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun startLiveKit(
        url: String,
        token: String,
        screenData: Intent
    ) {

        scope.launch(Dispatchers.IO) {

            try {

                if (room == null) {
                    room = LiveKit.create(applicationContext)
                }

                val liveRoom = room
                    ?: throw Exception("LiveKit Room creation failed")

                liveRoom.connect(
                    url = url,
                    token = token
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
                            "Internal audio capturer could not be created"
                        )

                audioCapturer?.gain = 1.0f

                audioTrack.setAudioBufferCallback(
                    audioCapturer!!
                )

                launch(Dispatchers.Main) {

                    pendingStartResult?.success(true)

                    clearPendingStart()
                }

            } catch (e: Exception) {

                launch(Dispatchers.Main) {

                    pendingStartResult?.error(
                        "LIVE_START_FAILED",
                        e.message ?: "Failed to start LiveKit",
                        null
                    )

                    clearPendingStart()
                }
            }
        }
    }

    private fun stopLive() {

        scope.launch(Dispatchers.IO) {

            try {

                room?.let { liveRoom ->

                    val audioTrack =
                        liveRoom.localParticipant
                            .getTrackPublication(
                                Track.Source.MICROPHONE
                            )
                            ?.track as? LocalAudioTrack

                    audioTrack?.setAudioBufferCallback(null)

                    liveRoom.localParticipant
                        .setMicrophoneEnabled(false)

                    liveRoom.localParticipant
                        .setScreenShareEnabled(false)

                    liveRoom.disconnect()
                }

            } catch (_: Exception) {
            }

            audioCapturer?.releaseAudioResources()
            audioCapturer = null

            room = null
        }
    }

    private fun clearPendingStart() {
        pendingStartResult = null
        pendingToken = null
        pendingUrl = null
    }

    override fun onDestroy() {

        stopLive()

        scope.cancel()

        super.onDestroy()
    }
}
