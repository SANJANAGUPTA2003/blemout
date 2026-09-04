import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');

const SKIP_NAME =
  /-(card|main|thumb|sm|md|lg|wide)\.(webp|jpe?g|png)$/i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
      continue;
    }
    if (SKIP_NAME.test(entry.name)) continue;
    if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(absolute);
  }
  return files;
}

async function mapLimit(items, limit, mapper) {
  let index = 0;
  const results = new Array(items.length);
  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function webpPath(source, role) {
  const parsed = path.parse(source);
  return path.join(parsed.dir, `${parsed.name}-${role}.webp`);
}

async function optimizeOne(source) {
  const input = await readFile(source);
  const info = await sharp(input, { failOn: 'none' }).metadata();
  const parsed = path.parse(source);
  const isJpeg = /\.jpe?g$/i.test(parsed.ext);
  const isPng = /\.png$/i.test(parsed.ext);
  const originalBytes = (await stat(source)).size;

  const jobs = [
    sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: 160, withoutEnlargement: true })
      .webp({ quality: 74, effort: 4 })
      .toFile(webpPath(source, 'thumb')),
    sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(webpPath(source, 'card')),
    sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(webpPath(source, 'main')),
  ];

  if ((info.width || 0) >= 1400) {
    jobs.push(
      sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(webpPath(source, 'wide'))
    );
  }

  await Promise.all(jobs);

  const maxFallback = isPng ? 1600 : 1600;
  const shouldRewrite =
    originalBytes > 180_000 || (info.width || 0) > maxFallback;

  if (shouldRewrite) {
    if (isJpeg) {
      const data = await sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 76, mozjpeg: true })
        .toBuffer();
      if (data.length < originalBytes) await writeFile(source, data);
    } else if (isPng) {
      const data = await sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
      if (data.length < originalBytes * 0.9) await writeFile(source, data);
    }
  }

  const after = (await stat(source)).size;
  return { source, before: originalBytes, after };
}

const files = await walk(publicDir);
console.log(`Optimizing ${files.length} source images…`);
const results = await mapLimit(files, 3, optimizeOne);
const before = results.reduce((sum, item) => sum + item.before, 0);
const after = results.reduce((sum, item) => sum + item.after, 0);
console.log(
  `Source jpg/png: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`
);
console.log('Wrote WebP derivatives (-thumb, -card, -main, -wide).');
