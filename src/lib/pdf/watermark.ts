// Server-only helper: stamp a school name across every page of a PDF.
// Used by /api/account/exam-paper/[id] to deter unauthorized sharing —
// each download is traceable to the account that fetched it.

import { PDFDocument, degrees, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { promises as fs } from "node:fs";
import path from "node:path";

// Cache the font bytes between invocations to avoid re-reading the TTF on
// every request. Next.js may serve many requests from the same warm lambda.
let cachedFontBytes: Uint8Array | null = null;

async function loadFontBytes(): Promise<Uint8Array> {
  if (cachedFontBytes) return cachedFontBytes;
  const fontPath = path.join(process.cwd(), "src/lib/pdf/fonts/NotoSans-Regular.ttf");
  const data = await fs.readFile(fontPath);
  cachedFontBytes = new Uint8Array(data);
  return cachedFontBytes;
}

export async function applyWatermark(
  originalPdf: Uint8Array,
  watermarkText: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(originalPdf);
  doc.registerFontkit(fontkit);

  const fontBytes = await loadFontBytes();
  const font = await doc.embedFont(fontBytes, { subset: true });

  // Faint gray, plenty of transparency. Strong enough to identify the source
  // but soft enough not to obscure the exam questions themselves.
  const color = rgb(0.55, 0.55, 0.55);
  const opacity = 0.18;
  const fontSize = 36;
  const rotation = degrees(45);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();

    // Three stamps per page along the diagonal — one near each corner area
    // and one in the middle. Removing one still leaves the others.
    const positions = [
      { x: width * 0.15, y: height * 0.75 },
      { x: width * 0.50, y: height * 0.50 },
      { x: width * 0.85, y: height * 0.25 },
    ];

    for (const pos of positions) {
      page.drawText(watermarkText, {
        x: pos.x,
        y: pos.y,
        size: fontSize,
        font,
        color,
        opacity,
        rotate: rotation,
      });
    }
  }

  return await doc.save();
}
