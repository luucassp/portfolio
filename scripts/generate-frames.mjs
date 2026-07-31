// Extrai a sequência de quadros do hero do dragão a partir de assets-src/dragao.mp4.
// Ponto de loop (frame 0 <-> último quadro mantido) e orçamento de peso já
// validados manualmente — ver docs/briefing-hero-dragao.md.
//
// Uso: npm run frames

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE = "assets-src/dragao.mp4";
const OUT_ROOT = "public/frames";
const SOURCE_FPS = 30; // ver docs/briefing-hero-dragao.md — medido do assets-src/dragao.mp4
const SOURCE_ASPECT = 9 / 16;

const BUDGETS_BYTES = {
  desktop: 2_000_000,
  mobile: 800_000,
};

// AVIF (libaom-av1 + image2, ver histórico no git) produzia arquivos que o
// ffprobe lia mas o decoder real do Chromium rejeitava
// (createImageBitmap -> InvalidStateError). WebP não tem essa armadilha e
// ainda cabe folgado no orçamento (ver docs/briefing-hero-dragao.md).
const VARIANTS = {
  desktop: { width: 640, skip: 2, quality: 42 },
  mobile: { width: 400, skip: 3, quality: 42 },
};

function formatBytes(bytes) {
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

function generateVariant(name, { width, skip, quality }) {
  const outDir = join(OUT_ROOT, name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const pattern = join(outDir, "frame-%04d.webp");
  const select = `not(mod(n\\,${skip}))`;

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", SOURCE,
      "-vf", `select='${select}',scale=${width}:-1`,
      "-fps_mode", "passthrough",
      "-c:v", "libwebp",
      "-q:v", String(quality),
      "-f", "image2",
      pattern,
    ],
    { stdio: "inherit" },
  );

  const files = readdirSync(outDir);
  const totalBytes = files.reduce((sum, f) => sum + statSync(join(outDir, f)).size, 0);
  const budget = BUDGETS_BYTES[name];
  const overBudget = totalBytes > budget;
  const height = Math.round(width * SOURCE_ASPECT);
  const fps = SOURCE_FPS / skip;

  return { name, count: files.length, totalBytes, budget, overBudget, width, height, fps };
}

if (!existsSync(SOURCE)) {
  console.error(`Fonte não encontrada: ${SOURCE} (ver docs/briefing-hero-dragao.md — não é versionado no git)`);
  process.exit(1);
}

const results = Object.entries(VARIANTS).map(([name, cfg]) => generateVariant(name, cfg));

const manifest = {
  loop: "simple", // ver docs/briefing-hero-dragao.md — sem ping-pong
  generatedAt: new Date().toISOString(),
  variants: Object.fromEntries(
    results.map((r) => [r.name, { count: r.count, width: r.width, height: r.height, fps: r.fps }]),
  ),
};
writeFileSync(join(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log("\n--- Resumo ---");
for (const r of results) {
  const status = r.overBudget ? "⚠ ACIMA DO ORÇAMENTO" : "✓ dentro do orçamento";
  console.log(
    `${r.name}: ${r.count} quadros, ${formatBytes(r.totalBytes)} / ${formatBytes(r.budget)} — ${status}`,
  );
}

if (results.some((r) => r.overBudget)) {
  process.exitCode = 1;
}
