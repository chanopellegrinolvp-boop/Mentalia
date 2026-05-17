import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "../public/og-image.png");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#2D6A4F"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grad)" opacity="0.3"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#40916C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1B4332;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="900" cy="150" r="200" fill="#40916C" opacity="0.4"/>
  <circle cx="200" cy="500" r="150" fill="#1B4332" opacity="0.5"/>
  <text x="600" y="270" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="108" fill="white" text-anchor="middle" letter-spacing="-2">Mentalia</text>
  <text x="600" y="355" font-family="Arial, sans-serif" font-size="34" fill="#D8F3DC" text-anchor="middle" letter-spacing="1">Plataforma de Salud Mental Digital</text>
  <text x="600" y="420" font-family="Arial, sans-serif" font-size="22" fill="rgba(216,243,220,0.7)" text-anchor="middle">mentaliasalud.online</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log("og-image.png generada en public/og-image.png");
