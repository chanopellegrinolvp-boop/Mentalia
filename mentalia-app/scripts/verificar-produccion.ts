/**
 * Verificación de requisitos de producción para Mentalia.
 * Uso: npx tsx scripts/verificar-produccion.ts
 */

import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");

type Check = { nombre: string; ok: boolean; detalle?: string };
const checks: Check[] = [];

function check(nombre: string, condicion: boolean, detalle?: string) {
  checks.push({ nombre, ok: condicion, detalle });
}

function envVar(key: string): string | undefined {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return undefined;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  const line = lines.find(l => l.startsWith(`${key}=`));
  return line ? line.split("=").slice(1).join("=").trim() : undefined;
}

function fileContains(filePath: string, pattern: RegExp): boolean {
  const full = path.join(ROOT, filePath);
  if (!fs.existsSync(full)) return false;
  return pattern.test(fs.readFileSync(full, "utf-8"));
}

// 1. Variables de entorno críticas presentes y sin placeholder
const siteUrl = envVar("NEXT_PUBLIC_SITE_URL");
check(
  "NEXT_PUBLIC_SITE_URL configurada",
  !!siteUrl && !siteUrl.includes("REEMPLAZAR") && !siteUrl.includes("vercel.app"),
  siteUrl ?? "no encontrada"
);

const mpToken = envVar("MP_ACCESS_TOKEN");
check(
  "MP_ACCESS_TOKEN configurada (no placeholder)",
  !!mpToken && !mpToken.includes("REEMPLAZAR"),
  mpToken ? "presente" : "no encontrada"
);

const mpKey = envVar("NEXT_PUBLIC_MP_PUBLIC_KEY");
check(
  "NEXT_PUBLIC_MP_PUBLIC_KEY configurada (no placeholder)",
  !!mpKey && !mpKey.includes("REEMPLAZAR"),
  mpKey ? "presente" : "no encontrada"
);

const serviceRole = envVar("SUPABASE_SERVICE_ROLE_KEY");
check(
  "SUPABASE_SERVICE_ROLE_KEY configurada",
  !!serviceRole && serviceRole.length > 20,
  serviceRole ? "presente" : "no encontrada"
);

const openaiKey = envVar("OPENAI_API_KEY");
check(
  "OPENAI_API_KEY configurada",
  !!openaiKey && openaiKey.startsWith("sk-"),
  openaiKey ? "presente" : "no encontrada"
);

// 2. assetlinks.json con SHA256 real
const assetlinksPath = path.join(ROOT, "public/.well-known/assetlinks.json");
check(
  "assetlinks.json con SHA256 real (no placeholder)",
  fs.existsSync(assetlinksPath) &&
    !fs.readFileSync(assetlinksPath, "utf-8").includes("REEMPLAZAR"),
  assetlinksPath
);

// 3. Middleware con protección por roles
check(
  "Middleware tiene protección por roles",
  fileContains("middleware.ts", /isProfRoute.*profile.*role/) &&
    fileContains("middleware.ts", /isPacRoute.*profile.*role/),
);

// 4. No hay URLs hardcodeadas de vercel.app en el código fuente
const libResend = path.join(ROOT, "lib/resend.ts");
const resendContent = fs.existsSync(libResend) ? fs.readFileSync(libResend, "utf-8") : "";
check(
  "Sin URLs hardcodeadas de vercel.app en lib/resend.ts",
  !resendContent.includes("vercel.app"),
);

// 5. Service worker registrado en layout (vía PWARegister)
check(
  "Service worker registrado en el layout",
  fileContains("app/layout.tsx", /PWARegister|sw\.js|serviceWorker/),
);

// 6. Manifest.json con iconos y start_url
const manifestPath = path.join(ROOT, "public/manifest.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  check(
    "manifest.json con iconos, start_url y display standalone",
    Array.isArray(manifest.icons) &&
      manifest.icons.length >= 2 &&
      manifest.start_url === "/" &&
      manifest.display === "standalone",
  );
} else {
  check("manifest.json existe", false, "archivo no encontrado");
}

// 7. Páginas legales /privacidad y /terminos existen
check(
  "Página /privacidad existe",
  fs.existsSync(path.join(ROOT, "app/privacidad/page.tsx")),
);
check(
  "Página /terminos existe",
  fs.existsSync(path.join(ROOT, "app/terminos/page.tsx")),
);

// 8. No hay console.logs con datos sensibles en webhook
check(
  "Webhook sin logs de datos sensibles (userId/body)",
  fileContains("app/api/pagos/webhook/route.ts", /^(?!.*console\.log.*userId|.*console\.log.*external_reference|.*console\.log.*JSON\.stringify\(body\))/m),
);

// ── Resultado ──────────────────────────────────────────────────────────────

const ok = checks.filter(c => c.ok).length;
const total = checks.length;

console.log("\n── Verificación de producción Mentalia ─────────────────\n");
for (const c of checks) {
  const icon = c.ok ? "✓" : "✗";
  const extra = c.detalle ? ` (${c.detalle})` : "";
  console.log(`  ${icon} ${c.nombre}${extra}`);
}
console.log(`\n  ${ok}/${total} checks pasaron\n`);

if (ok < total) process.exit(1);
