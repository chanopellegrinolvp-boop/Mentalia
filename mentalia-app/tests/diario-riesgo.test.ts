import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeDb, dbProxy } from "./helpers/db";

const h = vi.hoisted(() => ({
  db: { current: null as any },
  openaiCreate: vi.fn(async () => ({
    choices: [{ message: { content: JSON.stringify({ nivel: "alto", indicadores: ["ideacion"], recomendaciones: ["contactar"] }) } }],
  })),
  email: vi.fn(async () => {}),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "pat1" } } }) } }),
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => dbProxy(h.db) }));
vi.mock("openai", () => ({
  default: class { constructor(_: any) {} chat = { completions: { create: h.openaiCreate } }; },
}));
vi.mock("@/lib/resend", () => ({ emailRiesgoAlto: h.email }));

import { POST as evaluarDiario } from "@/app/api/diario/evaluar-riesgo/route";

function req(note: string): any {
  return new Request("http://localhost/api/diario/evaluar-riesgo", { method: "POST", body: JSON.stringify({ note }) });
}

describe("diario/evaluar-riesgo — pre-filtro cost-smart", () => {
  beforeEach(() => { h.openaiCreate.mockClear(); h.email.mockClear(); });

  it("entrada normal → NO llama a gpt-4o (0 llamadas) ni crea flag", async () => {
    const db = makeDb({ appointments: { data: { professional_id: "pro1" } }, risk_flags: { data: { id: "f" } }, profiles: { data: {} } });
    h.db.current = db;
    const res = await evaluarDiario(req("Hoy fue un buen día, agradecido por la familia"));
    expect(res.status).toBe(200);
    expect((await res.json()).evaluado).toBe(false);
    expect(h.openaiCreate).not.toHaveBeenCalled();
    expect(db.ops.find(o => o.table === "risk_flags")).toBeUndefined();
  });

  it("entrada con señales → escala a gpt-4o y crea flag source='diario' + notifica", async () => {
    const db = makeDb({
      appointments: { data: { professional_id: "pro1" } },
      risk_flags: { data: { id: "flag1" } },
      profiles: { data: { email: "pro@x.com", full_name: "Pro" } },
    });
    h.db.current = db;
    const res = await evaluarDiario(req("ya no quiero vivir, no aguanto mas"));
    expect(res.status).toBe(200);
    expect((await res.json()).nivel).toBe("alto");
    expect(h.openaiCreate).toHaveBeenCalledOnce();
    const insert = db.ops.find(o => o.table === "risk_flags" && o.op === "insert");
    expect(insert?.value).toMatchObject({ source: "diario", patient_id: "pat1", professional_id: "pro1", nivel: "alto" });
    expect(h.email).toHaveBeenCalledOnce();
  });

  it("señales SIN profesional → crea flag con professional_id null (banner igual), sin email", async () => {
    const db = makeDb({ appointments: { data: null }, risk_flags: { data: { id: "flagX" } }, profiles: { data: {} } });
    h.db.current = db;
    const res = await evaluarDiario(req("quiero desaparecer, no aguanto mas"));
    const j = await res.json();
    expect(j.nivel).toBe("alto");
    expect(h.openaiCreate).toHaveBeenCalledOnce();
    const insert = db.ops.find(o => o.table === "risk_flags" && o.op === "insert");
    expect(insert?.value).toMatchObject({ source: "diario", patient_id: "pat1", nivel: "alto" });
    expect(insert?.value.professional_id).toBeNull();
    expect(h.email).not.toHaveBeenCalled(); // sin profesional → sin email
  });
});
