const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

// Keep credentials out of app.json and the JavaScript bundle. The Android build
// environment must supply this secret; it is embedded only in the native app.
module.exports = function androidMapsCredentials(config) {
  return withAndroidManifest(config, (mod) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults);
    const name = 'com.google.android.geo.API_KEY';
    const key = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();
    const metadata = (application['meta-data'] || []).filter(
      (entry) => entry.$?.['android:name'] !== name,
    );
    if (key) {
      metadata.push({ $: { 'android:name': name, 'android:value': key } });
    } else {
      console.warn('[Android Maps] No build-time key supplied; keep the embedded-map fallback enabled.');
    }
    application['meta-data'] = metadata;
    return mod;
  });
};