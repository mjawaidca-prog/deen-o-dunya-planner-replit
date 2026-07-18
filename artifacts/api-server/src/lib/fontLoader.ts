/**
 * Font loader — reads TTF font files from disk once and caches them as
 * base64 strings for embedding inside SVG <style> @font-face rules.
 * librsvg (used by sharp) supports data-URI fonts in @font-face.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.join(__dirname, "../assets/fonts");

let cachedBlock: string | null = null;

/**
 * Returns an SVG <style> block with @font-face declarations for:
 *  - "Amiri Quran"       — Uthmani Arabic Quran script
 *  - "Noto Nastaliq Urdu" — Nastaliq Urdu translation script
 *
 * The result is cached after the first call (lazy, once per process).
 */
export async function getFontStyleBlock(): Promise<string> {
  if (cachedBlock !== null) return cachedBlock;

  const [amiriB64, nastaliqB64] = await Promise.all([
    fs
      .readFile(path.join(FONTS_DIR, "AmiriQuran.ttf"))
      .then((b) => b.toString("base64")),
    fs
      .readFile(path.join(FONTS_DIR, "NotoNastaliqUrdu-Regular.ttf"))
      .then((b) => b.toString("base64")),
  ]);

  cachedBlock = `
  <style>
    @font-face {
      font-family: 'Amiri Quran';
      src: url('data:font/truetype;base64,${amiriB64}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Noto Nastaliq Urdu';
      src: url('data:font/truetype;base64,${nastaliqB64}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  </style>`;

  return cachedBlock;
}
