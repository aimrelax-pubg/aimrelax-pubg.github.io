plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("dev.flutter.flutter-gradle-plugin")
    id("com.google.gms.google-services") version "4.4.2"
}

android {
    namespace = "com.aimrelax.aimrelax_live"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.aimrelax.aimrelax_live"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "2.0"
    }
}

dependencies {
    implementation("io.livekit:livekit-android:2.29.0")
}

flutter {
    source = "../.."
}
