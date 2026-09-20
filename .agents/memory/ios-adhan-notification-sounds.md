---
name: iOS Adhan notification sounds
description: Native notification-sound packaging and verification requirements for the prayer-time Adhan.
---
Configure custom notification sounds with the Expo notifications plugin's
top-level `sounds` array. Do not put sounds under nested `ios` or `android`
objects.

**Why:** The nested shape can look plausible and survive JavaScript checks, but
the plugin ignores it, so the WAV file is absent from the native iOS bundle and
scheduled notifications cannot play it.

**How to apply:** Any sound-plugin change requires a new native build. Keep the
iOS notification sound under 30 seconds, request sound permission explicitly,
and verify both the delayed test alert and a real prayer-time alert on a
physical release device with iOS notification Sounds enabled.