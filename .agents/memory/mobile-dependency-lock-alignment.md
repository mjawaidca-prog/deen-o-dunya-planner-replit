---
name: Mobile dependency lock alignment
description: Prevent Metro and release builds from resolving a stale mobile dependency graph.
---

The Expo mobile manifest and the workspace pnpm lockfile must be synchronized whenever Expo-native or font packages change.

**Why:** A stale lockfile can leave packages declared by the app unavailable in the installed workspace, which stops Metro before it can bundle the app and can also make a release build non-reproducible.

**How to apply:** After changing or discovering a mismatch in the mobile
package manifest, sync dependencies through the mobile workspace and run the
mobile type check plus Metro startup before requesting a store build. Keep the
root `packageManager` pinned to the pnpm release that writes the committed
lockfile format. EAS Build defaults Corepack off, so each EAS build profile
must also enable Corepack and pin that pnpm version; otherwise EAS may use its
older global pnpm, ignore the lockfile as incompatible, and fail its mandatory
frozen install.