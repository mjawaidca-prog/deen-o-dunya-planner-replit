# Android Maps release verification

The `androidMapsCredentials` config plugin reads `GOOGLE_MAPS_ANDROID_API_KEY`
from the **native build environment** and inserts
`com.google.android.geo.API_KEY` into the generated Android manifest. Do not
commit the key to `app.json`, log it, or expose it through `EXPO_PUBLIC_*`.
Ensure the native build service has the secret: a workspace secret alone does
not establish that a remote builder receives it.

Android binaries with version code 11 or later may mount the embedded map.
Older Android binaries retain the existing missing-key fallback, even if they
receive an OTA JavaScript update. iOS behavior is unchanged.

Before restoring the embedded Android map:

1. Confirm billing and Maps SDK for Android are enabled in the key's Google
   Cloud project.
2. Confirm Android application restrictions include `com.deenodunya.planner`
   and the Play **app-signing** certificate SHA-1 (not the upload certificate).
   Restrict API access to Maps SDK for Android.
3. Inspect the newly generated native manifest without printing its key.
   Confirm exactly one nonempty `com.google.android.geo.API_KEY` entry exists.
4. Do not lower the Android map minimum native build without a replacement
   native-build capability check. Do not use an OTA-delivered JavaScript flag
   to claim that an older installed binary has the new metadata. Also do not
   rely on `android.config` being present in Expo's public runtime
   configuration.
5. Test a new Play-signed release through an internal testing track on Android:
   grant location, open Nearby Masjids, confirm map tiles and markers, reopen
   the screen, and check logs for native crashes and authorization failures.
   Check nearby results and external directions, and the no-key fallback.

Do not report native success based on Expo Go, a web screenshot, manifest
generation, or a locally signed APK with a different certificate.