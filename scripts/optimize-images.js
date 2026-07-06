const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images');

// Max width per folder, based on how the image is actually displayed on the site.
const MAX_WIDTH = {
  bros: 800,
  alums: 800,
  desktop: 1920,
  mobile: 1000,
  rush: 1600,
};

function maxWidthFor(filePath) {
  const folder = path.basename(path.dirname(filePath));
  return MAX_WIDTH[folder] || 1600;
}

async function optimize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const before = fs.statSync(filePath).size;
  const maxWidth = maxWidthFor(filePath);
  const image = sharp(filePath).rotate(); // auto-orient from EXIF, then strip metadata
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth });
  }

  // WebP beats both JPEG and PNG at equivalent quality for photos, and still
  // supports alpha for logos/graphics, so every raster asset converts to it.
  const buffer = await pipeline.webp({ quality: 80 }).toBuffer();
  const outPath = filePath.slice(0, -ext.length) + '.webp';

  fs.writeFileSync(outPath, buffer);
  if (outPath !== filePath) fs.unlinkSync(filePath);

  const after = buffer.length;
  return { filePath: outPath, before, after };
}

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

(async () => {
  const files = walk(ROOT);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const result = await optimize(file);
    if (!result) continue;
    totalBefore += result.before;
    totalAfter += result.after;
    const pct = (100 - (result.after / result.before) * 100).toFixed(0);
    console.log(
      `${path.relative(ROOT, result.filePath)}: ${(result.before / 1024 / 1024).toFixed(2)}MB -> ${(result.after / 1024 / 1024).toFixed(2)}MB (-${pct}%)`
    );
  }

  console.log('---');
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB (-${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%)`
  );
})();
