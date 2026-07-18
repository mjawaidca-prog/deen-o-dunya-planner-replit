import { Router, type IRouter } from "express";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { renderClip, getClipPath, type ClipRenderInput } from "../lib/clipRenderer";

const router: IRouter = Router();

router.post("/clips/render", async (req, res, next) => {
  try {
    const body = req.body as Partial<ClipRenderInput> & {
      segments?: ClipRenderInput["segments"];
    };

    const appName = body.appName?.trim() || "Deen o Dunya Planner";
    const sourceLabel = body.sourceLabel?.trim();
    const title = body.title?.trim();
    const segments = body.segments ?? [];

    if (!sourceLabel || !title || segments.length === 0) {
      res.status(400).json({
        error: "sourceLabel, title, and segments are required",
      });
      return;
    }

    const normalizedSegments = segments
      .map((segment) => ({
        reference: segment.reference?.trim() || "",
        arabic: segment.arabic?.trim() || "",
        translation: segment.translation?.trim() || "",
        audioUrl: segment.audioUrl?.trim() || undefined,
        translationLang: (segment as { translationLang?: string }).translationLang?.trim() || undefined,
      }))
      .filter((segment) => segment.reference && segment.arabic);

    if (normalizedSegments.length === 0) {
      res.status(400).json({
        error: "At least one complete segment is required",
      });
      return;
    }

    const result = await renderClip({
      appName,
      sourceLabel,
      title,
      subtitle: body.subtitle?.trim() || undefined,
      reciterLabel: body.reciterLabel?.trim() || undefined,
      segments: normalizedSegments,
    });

    res.json({
      id: result.id,
      downloadUrl: result.downloadPath,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/clips/:clipId.mp4", async (req, res, next) => {
  try {
    const clipId = req.params.clipId;
    const clipPath = await getClipPath(clipId);

    if (!clipPath) {
      res.status(404).json({ error: "Clip not found" });
      return;
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Cache-Control", "public, max-age=300");
    await pipeline(fs.createReadStream(clipPath), res);
  } catch (error) {
    next(error);
  }
});

export default router;
