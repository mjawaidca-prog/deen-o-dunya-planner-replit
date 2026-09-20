---
name: Android Maps release safety
description: Missing Google Maps manifest credentials crash native view creation, not a catchable JavaScript request.
---
Do not rely on JavaScript error boundaries or an import catch to protect Android Maps initialization. Keep the list/external-directions fallback until the native release has valid Google Maps configuration.

**Why:** The Play Console stack trace confirmed `IllegalStateException: API key not found` during native MapView creation. This is not a mosque-search API failure.

**How to apply:** Restoring embedded maps requires verifying the generated AndroidManifest metadata and a real Android release with Maps SDK enabled and key restrictions matching the package and Play app-signing certificate. Config or JavaScript changes alone cannot add metadata to an already installed native binary.

Any future map-enablement check must describe the installed native binary, not
just the currently served JavaScript configuration.

**Why:** An OTA update can reach older binaries that still lack Maps metadata;
a JavaScript-only readiness flag could reintroduce the fatal native crash.
Supplying a workspace secret also does not prove a remote native builder has it.

**How to apply:** Verify native capability before mounting Android Maps and
verify credentials in the actual release build environment. Keep credentials
out of source control and public JavaScript configuration.