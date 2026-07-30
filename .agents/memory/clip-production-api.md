---
name: Clip Maker production API
description: Clip rendering needs an embedded production API origin in mobile releases and explicit ffmpeg resolution in Replit deployments.
---

The Clip Maker mobile client must use the published app/API origin in release builds; development-only Expo environment domains are not present in TestFlight. The API must declare FFmpeg as a deployment system dependency because the published container may not include Replit's development runtime PATH or Nix store.

**Why:** Expo Go used the development host successfully while TestFlight reached production, where the API returned HTTP 500 because `ffmpeg` could not be spawned. A runtime-path lookup alone did not fix the published container because that binary was not packaged there.

**How to apply:** When deploying Clip Maker changes, publish the API first, then build a new mobile release with the production origin embedded, and verify both `/api/healthz` and `/api/clips/render`.