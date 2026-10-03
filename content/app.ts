// The Android app download. The APK is attached to a GitHub Release on the public repo:
// "releases/latest/download/<file>" always points at the newest release, so publishing a new
// version never needs a website change. Override with NEXT_PUBLIC_ANDROID_APK_URL if hosted elsewhere.
export const androidApp = {
  apkUrl:
    process.env.NEXT_PUBLIC_ANDROID_APK_URL ||
    "https://github.com/EAtheAnalyst/Vitanaija_shop/releases/latest/download/vitanaija.apk",
  releasesUrl: "https://github.com/EAtheAnalyst/Vitanaija_shop/releases",
  version: "1.0.0",
  minAndroid: "Android 7.0 or newer",
  approxSize: "about 60 MB",
};
