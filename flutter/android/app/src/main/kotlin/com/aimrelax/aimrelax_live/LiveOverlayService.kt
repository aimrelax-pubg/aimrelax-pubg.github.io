package com.aimrelax.aimrelax_live

import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class LiveOverlayService : Service() {
    companion object {
        const val ACTION_MIC = "com.aimrelax.live.OVERLAY_MIC"
        const val ACTION_STOP = "com.aimrelax.live.OVERLAY_STOP"
        const val ACTION_UPDATE = "com.aimrelax.live.OVERLAY_UPDATE"
    }
    private var wm: WindowManager? = null
    private var root: LinearLayout? = null
    private var status: TextView? = null
    private var mic: Button? = null

    override fun onBind(intent: Intent?): IBinder? = null
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) { stopSelf(); return START_NOT_STICKY }
        if (root == null) showOverlay()
        if (intent?.action == ACTION_UPDATE) {
            val count = intent.getIntExtra("viewers", 0)
            val enabled = intent.getBooleanExtra("mic", true)
            status?.text = "🔴 LIVE  •  👁 $count"
            mic?.text = if (enabled) "🎙 MIC ON" else "🔇 MIC OFF"
        }
        return START_STICKY
    }
    private fun showOverlay() {
        wm = getSystemService(WINDOW_SERVICE) as WindowManager
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(12, 8, 12, 8)
            setBackgroundColor(Color.argb(230, 18, 18, 18))
        }
        val line = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
        status = TextView(this).apply { setTextColor(Color.WHITE); textSize = 14f; text = "🔴 LIVE" }
        mic = Button(this).apply {
            text = "🎙 MIC ON"
            setOnClickListener { sendBroadcast(Intent(ACTION_MIC).setPackage(packageName)) }
        }
        line.addView(status, LinearLayout.LayoutParams(0, 48, 1f))
        line.addView(mic, LinearLayout.LayoutParams(120, 48))
        box.addView(line)
        root = box
        val type = if (Build.VERSION.SDK_INT >= 26) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE
        val p = WindowManager.LayoutParams(320, WindowManager.LayoutParams.WRAP_CONTENT, type, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL, PixelFormat.TRANSLUCENT)
        p.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        p.y = 70
        try { wm?.addView(box, p) } catch (_: Exception) { root = null }
    }
    override fun onDestroy() {
        try { root?.let { wm?.removeView(it) } } catch (_: Exception) {}
        root = null
        super.onDestroy()
    }
}