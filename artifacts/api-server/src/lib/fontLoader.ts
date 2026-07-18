/**
 * Font installer — ensures Amiri Quran and Noto Nastaliq Urdu are registered
 * with the system fontconfig so librsvg (used by sharp) can find them by name.
 *
 * Copies font files from assets/fonts/ → ~/.fonts/ once per process and
 * rebuilds the fontconfig cache. librsvg resolves fonts via fontconfig, NOT
 * via SVG @font-face data URIs (which it silently ignores).
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_FONTS = path.join(__dirname, "../assets/fonts");
const USER_FONTS = path.join(os.homedir(), ".fonts");

const FONTS = [
  "AmiriQuran.ttf",
  "NotoNastaliqUrdu-Regular.ttf",
];

let ensured = false;

/**
 * Call once at server startup (or lazily before first render).
 * Installs fonts into ~/.fonts and rebuilds fontconfig cache if needed.
 */
export async function ensureFontsInstalled(): Promise<void> {
  if (ensured) return;
  ensured = true;

  await fs.mkdir(USER_FONTS, { recursive: true });

  let anyNew = false;
  for (const font of FONTS) {
    const dest = path.join(USER_FONTS, font);
    const alreadyExists = await fs.access(dest).then(() => true).catch(() => false);
    if (!alreadyExists) {
      await fs.copyFile(path.join(ASSETS_FONTS, font), dest);
      anyNew = true;
    }
  }

  if (anyNew) {
    try {
      await execFileAsync("fc-cache", ["-f", USER_FONTS]);
    } catch {
      // fc-cache failure is non-fatal — fonts may still be found if cache
      // was built in a previous process (e.g. the shell that set up the env).
    }
  }
}
