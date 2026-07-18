import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import sharp from "sharp";

export interface ClipSegmentInput {
  reference: string;
  arabic: string;
  translation: string;
  /** Arabic recitation audio URL */
  audioUrl?: string | null;
  /** Spoken translation audio URL — played after the Arabic recitation */
  audioTranslationUrl?: string | null;
}

export interface ClipRenderInput {
  appName: string;
  sourceLabel: string;
  title: string;
  subtitle?: string;
  reciterLabel?: string | null;
  segments: ClipSegmentInput[];
}

export interface ClipRenderResult {
  id: string;
  filePath: string;
  downloadPath: string;
}

const WIDTH = 1080;
const HEIGHT = 1920;
const ROOT_DIR = path.join(os.tmpdir(), "deen-o-dunya-clips");
const MAX_RENDER_SEGMENTS = 12;

const FFMPEG_PATH = "ffmpeg";
const FFPROBE_PATH = "ffprobe";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function wrapText(text: string, maxChars: number, maxLines = 8) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const words = clean.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current.length === 0) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;

  const sliced = lines.slice(0, maxLines);
  sliced[maxLines - 1] = `${sliced[maxLines - 1].replace(/\.\.\.$/, "")}...`;
  return sliced;
}

function renderLines(options: {
  lines: string[];
  x: number;
  startY: number;
  lineHeight: number;
  fill: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: number | string;
  direction?: "ltr" | "rtl";
}) {
  const {
    lines,
    x,
    startY,
    lineHeight,
    fill,
    fontSize,
    fontFamily,
    fontWeight = 400,
    direction = "ltr",
  } = options;

  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" text-anchor="middle" direction="${direction}" unicode-bidi="plaintext" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}">${escapeXml(line)}</text>`,
    )
    .join("");
}

function renderClipSvg(params: {
  appName: string;
  sourceLabel: string;
  title: string;
  subtitle?: string;
  reference: string;
  reciterLabel?: string | null;
  progressLabel: string;
  arabic: string;
  translation: string;
}) {
  const arabicLines = wrapText(params.arabic, 22, 8);
  const translationLines = wrapText(params.translation, 50, 10);
  const arabicFontSize = arabicLines.length > 5 ? 48 : arabicLines.length > 3 ? 54 : 60;
  const arabicLineHeight = arabicFontSize + 18;
  const translationFontSize = translationLines.length > 6 ? 30 : 34;
  const translationLineHeight = translationFontSize + 14;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="52%" stop-color="#173324"/>
      <stop offset="100%" stop-color="#F5E8C8"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FEFCF6"/>
      <stop offset="100%" stop-color="#F4ECD6"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#09131F" flood-opacity="0.26"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect x="60" y="76" width="960" height="1768" rx="46" fill="url(#card)" opacity="0.97" filter="url(#shadow)" />
  <rect x="88" y="104" width="904" height="1712" rx="36" fill="none" stroke="#C9A84C" stroke-opacity="0.42" stroke-width="3" />

  <text x="540" y="166" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800" fill="#0C5A3B">${escapeXml(params.appName)}</text>
  <text x="540" y="208" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#C9A84C">${escapeXml(params.sourceLabel.toUpperCase())}</text>

  <rect x="796" y="126" width="170" height="50" rx="25" fill="#0C5A3B" />
  <text x="881" y="158" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="700" fill="#FFFFFF">${escapeXml(params.progressLabel)}</text>

  <text x="540" y="328" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="800" fill="#21302A">${escapeXml(params.title)}</text>
  ${
    params.subtitle
      ? `<text x="540" y="380" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="600" fill="#6B7869">${escapeXml(params.subtitle)}</text>`
      : ""
  }
  <line x1="150" y1="430" x2="930" y2="430" stroke="#C9A84C" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round" />

  <text x="540" y="500" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#0C5A3B">${escapeXml(params.reference)}</text>
  ${
    params.reciterLabel
      ? `<text x="540" y="546" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#6B7869">${escapeXml(params.reciterLabel)}</text>`
      : ""
  }

  <rect x="142" y="606" width="796" height="620" rx="30" fill="#FFFFFF" fill-opacity="0.55" stroke="#C9A84C" stroke-opacity="0.18" />
  ${renderLines({
    lines: arabicLines,
    x: 540,
    startY: 694,
    lineHeight: arabicLineHeight,
    fill: "#21302A",
    fontSize: arabicFontSize,
    fontFamily: "Noto Naskh Arabic, Arial, sans-serif",
    fontWeight: 700,
    direction: "rtl",
  })}

  <line x1="190" y1="1254" x2="890" y2="1254" stroke="#C9A84C" stroke-opacity="0.40" stroke-width="2" stroke-linecap="round" />
  ${renderLines({
    lines: translationLines,
    x: 540,
    startY: 1340,
    lineHeight: translationLineHeight,
    fill: "#44543C",
    fontSize: translationFontSize,
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: 500,
  })}

  <text x="540" y="1682" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" fill="#0C5A3B">Generated by &#x2018;Deen o Dunya Planner&#x2019;</text>
  <text x="540" y="1712" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="500" fill="#6B7869">Free on App Store &amp; Google Play Store</text>
</svg>`;
}

async function renderSvgToPng(svg: string, outputPath: string) {
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function runCommand(command: string, args: string[], cwd?: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command failed (${command} ${args.join(" ")}): ${stderr.trim()}`,
          ),
        );
      }
    });
  });
}

async function downloadFile(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }

  const file = createWriteStream(outputPath);
  await pipeline(Readable.fromWeb(response.body), file);
}

async function probeDuration(filePath: string) {
  return new Promise<number>((resolve, reject) => {
    const args = [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ];

    const child = spawn(FFPROBE_PATH, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `ffprobe exited with ${code}`));
        return;
      }

      const duration = Number.parseFloat(stdout.trim());
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("Unable to read media duration"));
        return;
      }

      resolve(duration);
    });
  });
}

function escapeConcatPath(filePath: string) {
  return filePath.replaceAll("'", "'\\''");
}

function estimateDuration(segment: ClipSegmentInput) {
  const lengthScore = (segment.arabic.length + segment.translation.length) / 150;
  return clamp(5 + lengthScore, 6, 16);
}

function buildConcatFile(entries: Array<{ filePath: string; duration?: number }>) {
  const lines: string[] = [];
  for (const entry of entries) {
    lines.push(`file '${escapeConcatPath(entry.filePath)}'`);
    if (typeof entry.duration === "number") {
      lines.push(`duration ${entry.duration.toFixed(3)}`);
    }
  }

  if (entries.length > 0) {
    lines.push(`file '${escapeConcatPath(entries[entries.length - 1].filePath)}'`);
  }

  return lines.join("\n");
}

async function cleanupOlderClips(rootDir: string) {
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const fullPath = path.join(rootDir, entry.name);
          const stats = await fs.stat(fullPath).catch(() => null);
          if (!stats) return;
          if (stats.mtimeMs < cutoff) {
            await fs.rm(fullPath, { recursive: true, force: true });
          }
        }),
    );
  } catch {
    // Best effort only.
  }
}

async function createAudioConcat(audioFiles: string[], outputPath: string, workDir: string) {
  if (audioFiles.length === 0) return null;

  if (audioFiles.length === 1) {
    await fs.copyFile(audioFiles[0], outputPath);
    return outputPath;
  }

  const listPath = path.join(workDir, "audio.txt");
  await fs.writeFile(
    listPath,
    audioFiles.map((filePath) => `file '${escapeConcatPath(filePath)}'`).join("\n"),
    "utf8",
  );

  await runCommand(FFMPEG_PATH, [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-c",
    "copy",
    outputPath,
  ]);

  return outputPath;
}

export async function renderClip(input: ClipRenderInput): Promise<ClipRenderResult> {
  if (!input.segments.length) {
    throw new Error("No clip segments were provided");
  }
  if (!FFMPEG_PATH) {
    throw new Error("ffmpeg is not available");
  }
  if (!FFPROBE_PATH) {
    throw new Error("ffprobe is not available");
  }

  await fs.mkdir(ROOT_DIR, { recursive: true });
  await cleanupOlderClips(ROOT_DIR);

  const clipId = crypto.randomUUID();
  const clipDir = path.join(ROOT_DIR, clipId);
  const frameDir = path.join(clipDir, "frames");
  const audioDir = path.join(clipDir, "audio");
  await fs.mkdir(frameDir, { recursive: true });
  await fs.mkdir(audioDir, { recursive: true });

  const segments = input.segments.slice(0, MAX_RENDER_SEGMENTS);
  const videoListPath = path.join(clipDir, "video.txt");
  const mergedAudioPath = path.join(clipDir, "audio.mp3");
  const outputPath = path.join(clipDir, `${clipId}.mp4`);
  const audioFiles: string[] = [];
  const frameEntries: Array<{ filePath: string; duration?: number }> = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const framePath = path.join(frameDir, `frame-${String(index + 1).padStart(2, "0")}.png`);
    const svg = renderClipSvg({
      appName: input.appName,
      sourceLabel: input.sourceLabel,
      title: input.title,
      subtitle: input.subtitle,
      reference: segment.reference,
      reciterLabel: input.reciterLabel,
      progressLabel: `${index + 1}/${segments.length}`,
      arabic: segment.arabic,
      translation: segment.translation,
    });

    await renderSvgToPng(svg, framePath);

    let duration = estimateDuration(segment);
    if (segment.audioUrl) {
      const arabicPath = path.join(audioDir, `arabic-${String(index + 1).padStart(2, "0")}.mp3`);
      await downloadFile(segment.audioUrl, arabicPath);

      let segmentAudioPath = arabicPath;

      if (segment.audioTranslationUrl) {
        const translationPath = path.join(audioDir, `translation-${String(index + 1).padStart(2, "0")}.mp3`);
        const combinedPath = path.join(audioDir, `combined-${String(index + 1).padStart(2, "0")}.mp3`);
        try {
          await downloadFile(segment.audioTranslationUrl, translationPath);
          // Concat Arabic recitation + spoken translation sequentially
          const listPath = path.join(audioDir, `list-${String(index + 1).padStart(2, "0")}.txt`);
          await fs.writeFile(
            listPath,
            `file '${escapeConcatPath(arabicPath)}'\nfile '${escapeConcatPath(translationPath)}'`,
            "utf8",
          );
          await runCommand(FFMPEG_PATH, [
            "-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", combinedPath,
          ]);
          segmentAudioPath = combinedPath;
        } catch {
          // If translation audio fails, fall back to Arabic-only
        }
      }

      audioFiles.push(segmentAudioPath);
      duration = clamp(await probeDuration(segmentAudioPath), 4, 40);
    }

    frameEntries.push({ filePath: framePath, duration });
  }

  await fs.writeFile(videoListPath, buildConcatFile(frameEntries), "utf8");

  const mergedAudio = await createAudioConcat(audioFiles, mergedAudioPath, clipDir);

  if (mergedAudio) {
    await runCommand(FFMPEG_PATH, [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      videoListPath,
      "-i",
      mergedAudio,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-shortest",
      "-movflags",
      "+faststart",
      outputPath,
    ]);
  } else {
    await runCommand(FFMPEG_PATH, [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      videoListPath,
      "-vsync",
      "vfr",
      "-pix_fmt",
      "yuv420p",
      "-c:v",
      "libx264",
      "-movflags",
      "+faststart",
      outputPath,
    ]);
  }

  return {
    id: clipId,
    filePath: outputPath,
    downloadPath: `/api/clips/${clipId}.mp4`,
  };
}

export async function getClipPath(clipId: string) {
  const clipPath = path.join(ROOT_DIR, clipId, `${clipId}.mp4`);
  try {
    const stats = await fs.stat(clipPath);
    return stats.isFile() ? clipPath : null;
  } catch {
    return null;
  }
}
