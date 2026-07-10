import fs from "node:fs";
import path from "node:path";

// Carga .env.local (para tests de integración contra la DB real y para que los
// módulos que leen env al importar no rompan).
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i > 0) {
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

// Fallbacks para que los módulos de pago/IA no fallen al importarse en los unit tests.
process.env.MP_ACCESS_TOKEN ??= "TEST-token";
process.env.MP_WEBHOOK_SECRET ??= "test-webhook-secret";
process.env.OPENAI_API_KEY ??= "sk-test";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "anon-test";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "service-test";
