const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

// Keep iOS portrait-only while allowing Android tablets, foldables and
// multi-window layouts to use the space available to the activity.
module.exports = function androidAdaptiveActivity(config) {
  return withAndroidManifest(config, (mod) => {
    const activity = AndroidConfig.Manifest.getMainActivityOrThrow(mod.modResults);
    delete activity.$['android:screenOrientation'];
    activity.$['android:resizeableActivity'] = 'true';
    return mod;
  });
};