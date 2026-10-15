package com.aimrelax.aimrelax_live

import android.app.Service
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import kotlin.math.abs

class LiveOverlayService : Service() {
    companion object {
        const val ACTION_MIC = "com.aimrelax.live.OVERLAY_MIC"
        const val ACTION_STOP = "com.aimrelax.live.OVERLAY_STOP"
        const val ACTION_UPDATE = "com.aimrelax.live.OVERLAY_UPDATE"
        const val ACTION_PAUSE = "com.aimrelax.live.OVERLAY_PAUSE"
        const val ACTION_END_LIVE = "com.aimrelax.live.OVERLAY_END_LIVE"
    }

    private var wm: WindowManager? = null
    private var root: LinearLayout? = null
    private var status: TextView? = null
    private var mic: Button? = null
    private var pauseButton: Button? = null
    private var stopButton: Button? = null
    private var comments: TextView? = null
    private var expandButton: TextView? = null
    private var overlayParams: WindowManager.LayoutParams? = null
    private var viewerCount = 0
    private var micState = true
    private var pausedState = false
    private var expanded = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopForeground(true)
            stopSelf()
            return START_NOT_STICKY
        }

        ensureForeground()
        if (root == null) showOverlay()

        if (intent?.action == ACTION_UPDATE) {
            viewerCount = intent.getIntExtra("viewers", viewerCount)
            micState = intent.getBooleanExtra("mic", micState)
            pausedState = intent.getBooleanExtra("paused", pausedState)
            status?.text = (if (pausedState) "⏸ PAUSED" else "🔴 LIVE") + "  •  👁 $viewerCount"
            mic?.text = if (micState) "🎙 MIC ON" else "🔇 MIC OFF"
            pauseButton?.text = if (pausedState) "▶ RESUME LIVE" else "⏸ PAUSE LIVE"
            val lines = intent.getStringArrayListExtra("comments")
            if (lines != null) comments?.text = lines.takeLast(3).joinToString("\n")
        }
        return START_STICKY
    }

    private fun ensureForeground() {
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(
                NotificationChannel(
                    "aimrelax_live_overlay",
                    "AIMRELAX LIVE controls",
                    NotificationManager.IMPORTANCE_LOW
                )
            )
        }
        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, "aimrelax_live_overlay")
        } else {
            Notification.Builder(this)
        }
        val notification = builder
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle("AIMRELAX LIVE is running")
            .setContentText("Floating LIVE controls are active.")
            .setOngoing(true)
            .build()
        startForeground(71, notification)
    }

    private fun showOverlay() {
        wm = getSystemService(WINDOW_SERVICE) as WindowManager

        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(8), dp(5), dp(8), dp(5))
            setBackgroundColor(Color.argb(238, 20, 20, 24))
        }

        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }

        status = TextView(this).apply {
            setTextColor(Color.WHITE)
            textSize = 12f
            text = (if (pausedState) "⏸ PAUSED" else "🔴 LIVE") + "  •  👁 $viewerCount"
            setPadding(dp(5), dp(7), dp(7), dp(7))
            contentDescription = "Drag to move LIVE window"
        }

        expandButton = TextView(this).apply {
            text = "＋"
            textSize = 18f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(3), dp(8), dp(3))
            setOnClickListener { setExpanded(!expanded) }
        }

        header.addView(status, LinearLayout.LayoutParams(0, dp(36), 1f))
        header.addView(expandButton, LinearLayout.LayoutParams(dp(38), dp(36)))
        box.addView(header)

        mic = Button(this).apply {
            text = "🎙 MIC ON"
            textSize = 12f
            minHeight = dp(40)
            setPadding(dp(4), 0, dp(4), 0)
            setOnClickListener { sendBroadcast(Intent(ACTION_MIC).setPackage(packageName)) }
        }
        box.addView(mic)

        pauseButton = Button(this).apply {
            text = "⏸ PAUSE LIVE"
            textSize = 12f
            minHeight = dp(40)
            setPadding(dp(4), 0, dp(4), 0)
            setOnClickListener { sendBroadcast(Intent(ACTION_PAUSE).setPackage(packageName)) }
        }
        box.addView(pauseButton)

        stopButton = Button(this).apply {
            text = "⏹ END LIVE"
            textSize = 12f
            minHeight = dp(40)
            setPadding(dp(4), 0, dp(4), 0)
            setTextColor(Color.RED)
            setOnClickListener { sendBroadcast(Intent(ACTION_END_LIVE).setPackage(packageName)) }
        }
        box.addView(stopButton)

        comments = TextView(this).apply {
            setTextColor(Color.LTGRAY)
            textSize = 11f
            maxLines = 3
            setPadding(dp(5), dp(5), dp(5), dp(3))
        }
        box.addView(comments)

        root = box
        setExpanded(false)

        val type = if (Build.VERSION.SDK_INT >= 26) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }
        val p = WindowManager.LayoutParams(
            dp(220),
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )
        p.gravity = Gravity.TOP or Gravity.START
        p.x = dp(12)
        p.y = dp(100)
        overlayParams = p

        // Drag the floating LIVE pill by holding/moving the status area.
        status?.setOnTouchListener(object : View.OnTouchListener {
            private var downRawX = 0f
            private var downRawY = 0f
            private var startX = 0
            private var startY = 0
            private var moved = false

            override fun onTouch(view: View, event: MotionEvent): Boolean {
                val params = overlayParams ?: return false
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        downRawX = event.rawX
                        downRawY = event.rawY
                        startX = params.x
                        startY = params.y
                        moved = false
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        val dx = (event.rawX - downRawX).toInt()
                        val dy = (event.rawY - downRawY).toInt()
                        if (abs(dx) > dp(4) || abs(dy) > dp(4)) moved = true
                        if (moved) {
                            params.x = (startX + dx).coerceAtLeast(0)
                            params.y = (startY + dy).coerceAtLeast(0)
                            try { wm?.updateViewLayout(root, params) } catch (_: Exception) {}
                        }
                        return true
                    }
                    MotionEvent.ACTION_UP -> {
                        if (!moved) setExpanded(!expanded)
                        return true
                    }
                }
                return false
            }
        })

        try {
            wm?.addView(box, p)
        } catch (_: Exception) {
            root = null
            overlayParams = null
        }
    }

    private fun setExpanded(value: Boolean) {
        expanded = value
        mic?.visibility = if (expanded) View.VISIBLE else View.GONE
        pauseButton?.visibility = if (expanded) View.VISIBLE else View.GONE
        stopButton?.visibility = if (expanded) View.VISIBLE else View.GONE
        comments?.visibility = if (expanded) View.VISIBLE else View.GONE
        expandButton?.text = if (expanded) "−" else "＋"
        root?.let {
            it.requestLayout()
            try { wm?.updateViewLayout(it, overlayParams) } catch (_: Exception) {}
        }
    }

    private fun dp(value: Int): Int =
        (value * resources.displayMetrics.density).toInt()

    override fun onDestroy() {
        try { root?.let { wm?.removeView(it) } } catch (_: Exception) {}
        root = null
        overlayParams = null
        super.onDestroy()
    }
}
