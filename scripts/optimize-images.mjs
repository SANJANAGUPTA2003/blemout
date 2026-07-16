import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const productsDir = path.join(root, 'public', 'products');
const aboutDir = path.join(root, 'public', 'about');

async function filesIn(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(absolute, extension)));
    else if (entry.name.toLowerCase().endsWith(extension)) files.push(absolute);
  }
  return files;
}

async function optimizeProduct(source) {
  const input = await readFile(source);
  const parsed = path.parse(source);
  const base = path.join(parsed.dir, parsed.name);

  await Promise.all([
    sharp(input).rotate().jpeg({ quality: 82, mozjpeg: true }).toBuffer().then((data) => writeFile(source, data)),
    sharp(input).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${base}-card.webp`),
    sharp(input).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${base}-main.webp`),
    sharp(input).rotate().resize({ width: 160, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`${base}-thumb.webp`),
  ]);
}

async function optimizeEditorial(source) {
  const input = await readFile(source);
  const parsed = path.parse(source);
  await sharp(input)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(parsed.dir, `${parsed.name}.webp`));
}

const productImages = await filesIn(productsDir, '.jpg');
await Promise.all(productImages.map(optimizeProduct));

let editorialImages = [];
try {
  editorialImages = await filesIn(aboutDir, '.png');
  await Promise.all(editorialImages.map(optimizeEditorial));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

console.log(`Optimized ${productImages.length} product images and ${editorialImages.length} editorial images.`);
