import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../src/assets');
const heroDir = path.join(__dirname, '../public/hero');
const avatarDir = path.join(__dirname, '../public/avatars');

const heroes = [
  'brycecan.png',
  'yosemite2.png',
  'craterlake4.png',
  'chacopark4.png',
];

const avatars = [
  { file: 'david.jpg', out: 'david.webp' },
  { file: 'sam.png', out: 'sam.webp' },
  { file: 'jake.png', out: 'jake.webp' },
];

async function toWebp(input, output, width) {
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(output);
  const { statSync } = await import('node:fs');
  const size = statSync(output).size;
  console.log(`${path.basename(output)} (${width}px) — ${(size / 1024).toFixed(1)} KB`);
}

await mkdir(heroDir, { recursive: true });
await mkdir(avatarDir, { recursive: true });

for (const file of heroes) {
  const base = file.replace(/\.png$/i, '');
  const input = path.join(assetsDir, file);
  await toWebp(input, path.join(heroDir, `${base}.webp`), 1200);
  await toWebp(input, path.join(heroDir, `${base}-800.webp`), 800);
}

for (const { file, out } of avatars) {
  await sharp(path.join(assetsDir, file))
    .resize({ width: 192, height: 192, fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(path.join(avatarDir, out));
  const { statSync } = await import('node:fs');
  console.log(`${out} — ${(statSync(path.join(avatarDir, out)).size / 1024).toFixed(1)} KB`);
}

await sharp(path.join(assetsDir, 'roamLogo.jpg'))
  .resize({ width: 224, withoutEnlargement: true })
  .webp({ quality: 75 })
  .toFile(path.join(avatarDir, 'roam.webp'));
const { statSync } = await import('node:fs');
console.log(`roam.webp — ${(statSync(path.join(avatarDir, 'roam.webp')).size / 1024).toFixed(1)} KB`);

console.log('Optimized images written to public/hero/ and public/avatars/');
