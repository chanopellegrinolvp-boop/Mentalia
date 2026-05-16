import sharp from "sharp";
import { writeFileSync } from "fs";

const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="90" fill="#40916C"/>

  <!-- Lóbulo izquierdo: elipse vertical, mitad izquierda -->
  <ellipse cx="220" cy="220" rx="62" ry="88" fill="#D8F3DC" opacity="0.88"/>

  <!-- Lóbulo derecho: elipse vertical, mitad derecha -->
  <ellipse cx="292" cy="220" rx="62" ry="88" fill="#74C69D" opacity="0.88"/>

  <!-- Máscara central para separar lobulos -->
  <rect x="250" y="132" width="12" height="176" fill="#40916C"/>

  <!-- Línea divisoria blanca -->
  <line x1="256" y1="132" x2="256" y2="308" stroke="#FDFCFA" stroke-width="2.5" opacity="0.6"/>

  <!-- Tallo -->
  <rect x="250" y="308" width="12" height="56" rx="6" fill="#D8F3DC" opacity="0.7"/>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

await sharp(svgBuffer).resize(512, 512).png().toFile("public/icon-512.png");
console.log("✓ icon-512.png");

await sharp(svgBuffer).resize(192, 192).png().toFile("public/icon-192.png");
console.log("✓ icon-192.png");

// favicon 32x32
await sharp(svgBuffer).resize(32, 32).png().toFile("public/favicon-32.png");
console.log("✓ favicon-32.png");
