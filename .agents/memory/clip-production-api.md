---
name: Clip Maker production API
description: Clip rendering needs an embedded production API origin in mobile releases and explicit ffmpeg resolution in Replit deployments.
---

The Clip Maker mobile client must use the published app/API origin in release builds; development-only Expo environment domains are not present in TestFlight. The API must resolve Replit runtime-provided ffmpeg and ffprobe binaries explicitly because production PATH may not include them.

**Why:** Expo Go used the development host successfully while TestFlight reached production, where the API returned HTTP 500 because `ffmpeg` could not be spawned.

**How to apply:** When deploying Clip Maker changes, publish the API first, then build a new mobile release with the production origin embedded, and verify both `/api/healthz` and `/api/clips/render`.