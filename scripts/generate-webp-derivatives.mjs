import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const productsDir = path.join(root, 'public', 'products');
const editorialDir = path.join(root, 'public', 'home', 'product-details');
const heroDir = path.join(root, 'public', 'hero');

async function jpgFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jpgFiles(absolute)));
    else if (/\.jpg$/i.test(entry.name) && !/-(card|main|thumb)\.jpg$/i.test(entry.name)) {
      files.push(absolute);
    }
  }
  return files;
}

async function writeWebp(source, dest, width, quality) {
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
}

async function derivativesFor(source) {
  const parsed = path.parse(source);
  const base = path.join(parsed.dir, parsed.name);
  await Promise.all([
    writeWebp(source, `${base}-card.webp`, 640, 78),
    writeWebp(source, `${base}-main.webp`, 1200, 80),
    writeWebp(source, `${base}-thumb.webp`, 200, 74),
  ]);
}

const productJpgs = await jpgFiles(productsDir);
for (const file of productJpgs) {
  await derivativesFor(file);
}

let editorial = [];
try {
  editorial = (await readdir(editorialDir))
    .filter((name) => /\.jpg$/i.test(name) && !name.includes('-card'))
    .map((name) => path.join(editorialDir, name));
  for (const file of editorial) {
    const parsed = path.parse(file);
    await writeWebp(file, path.join(parsed.dir, `${parsed.name}-card.webp`), 900, 80);
    await writeWebp(file, path.join(parsed.dir, `${parsed.name}.webp`), 1400, 80);
  }
} catch {
  /* optional folder */
}

try {
  const heroes = (await readdir(heroDir)).filter((name) => /\.(jpg|png)$/i.test(name));
  for (const name of heroes) {
    const file = path.join(heroDir, name);
    const parsed = path.parse(file);
    await writeWebp(file, path.join(parsed.dir, `${parsed.name}.webp`), 1920, 78);
  }
} catch {
  /* optional folder */
}

console.log(
  `Wrote webp derivatives for ${productJpgs.length} product JPGs and ${editorial.length} editorial JPGs. Originals were not overwritten.`
);
