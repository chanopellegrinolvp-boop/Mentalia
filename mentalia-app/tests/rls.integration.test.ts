import { describe, it, expect, beforeAll, afterAll } from "vitest";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Solo corre si hay credenciales reales (no los fallbacks del setup).
const hasRealDb = !!SR && SR !== "service-test" && URL !== "https://test.supabase.co";

const adminH = { apikey: SR, Authorization: `Bearer ${SR}`, "Content-Type": "application/json" };

async function createUser(email: string, password: string) {
  const r = await fetch(`${URL}/auth/v1/admin/users`, {
    method: "POST", headers: adminH, body: JSON.stringify({ email, password, email_confirm: true }),
  });
  return r.json();
}
async function deleteUser(id: string) {
  await fetch(`${URL}/auth/v1/admin/users/${id}`, { method: "DELETE", headers: adminH });
}
async function login(email: string, password: string) {
  const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
  });
  return r.json();
}
async function rest(method: string, pathq: string, apikey: string, bearer: string, body?: any) {
  const r = await fetch(`${URL}/rest/v1/${pathq}`, {
    method, headers: { apikey, Authorization: `Bearer ${bearer}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  let json: any = null; try { json = txt ? JSON.parse(txt) : null; } catch {}
  return { status: r.status, json };
}
const arr = (q: any) => (Array.isArray(q.json) ? q.json : []);

describe.skipIf(!hasRealDb)("RLS session_notes (integración, DB real)", () => {
  const t = Date.now();
  const users: string[] = [];
  let noteId: string | null = null;
  let proA: any, proB: any, pat: any;
  const PW = `Test-${t}!`;

  beforeAll(async () => {
    const [uA, uB, uP] = await Promise.all([
      createUser(`rls-proA-${t}@example.com`, PW),
      createUser(`rls-proB-${t}@example.com`, PW),
      createUser(`rls-pat-${t}@example.com`, PW),
    ]);
    users.push(uA.id, uB.id, uP.id);
    await Promise.all([
      rest("POST", "profiles?on_conflict=id", SR, SR, { id: uA.id, email: `rls-proA-${t}@example.com`, full_name: "Pro A", role: "professional" }),
      rest("POST", "profiles?on_conflict=id", SR, SR, { id: uB.id, email: `rls-proB-${t}@example.com`, full_name: "Pro B", role: "professional" }),
      rest("POST", "profiles?on_conflict=id", SR, SR, { id: uP.id, email: `rls-pat-${t}@example.com`, full_name: "Pac", role: "patient" }),
    ]);
    [proA, proB, pat] = await Promise.all([
      login(`rls-proA-${t}@example.com`, PW),
      login(`rls-proB-${t}@example.com`, PW),
      login(`rls-pat-${t}@example.com`, PW),
    ]);
    const ins = await rest("POST", "session_notes?select=id", SR, SR, {
      professional_id: uA.id, patient_id: uP.id, content: "nota clínica de prueba", session_date: new Date().toISOString().slice(0, 10),
    });
    noteId = arr(ins)[0]?.id ?? null;
  }, 40000);

  afterAll(async () => {
    if (noteId) await rest("DELETE", `session_notes?id=eq.${noteId}`, SR, SR);
    await Promise.all(users.map(deleteUser));
  }, 40000);

  it("la nota de prueba se creó", () => {
    expect(noteId).toBeTruthy();
  });

  it("el profesional dueño (A) ve su nota", async () => {
    const q = await rest("GET", `session_notes?select=id&id=eq.${noteId}`, ANON, proA.access_token);
    expect(arr(q).some((r: any) => r.id === noteId)).toBe(true);
  });

  it("otro profesional (B) NO ve la nota de A (cruce bloqueado)", async () => {
    const q = await rest("GET", `session_notes?select=id&id=eq.${noteId}`, ANON, proB.access_token);
    expect(arr(q).some((r: any) => r.id === noteId)).toBe(false);
  });

  it("el paciente NO ve notas de sesión (son del profesional)", async () => {
    const q = await rest("GET", `session_notes?select=id&id=eq.${noteId}`, ANON, pat.access_token);
    expect(arr(q).length).toBe(0);
  });
});
