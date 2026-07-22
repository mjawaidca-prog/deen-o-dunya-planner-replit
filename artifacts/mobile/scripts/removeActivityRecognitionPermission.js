const { withAndroidManifest } = require('@expo/config-plugins');

function removeActivityRecognitionPermission(config) {
  return withAndroidManifest(config, (config) => {
    const permissions = config.modResults.manifest['uses-permission'] || [];
    config.modResults.manifest['uses-permission'] = permissions.filter(
      (permission) => {
        const name = permission.$?.['android:name'] || permission.$?.name || permission['android:name'];
        return name !== 'android.permission.ACTIVITY_RECOGNITION';
      }
    );
    return config;
  });
}

module.exports = removeActivityRecognitionPermission;
