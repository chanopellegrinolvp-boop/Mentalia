import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeDb, dbProxy } from "./helpers/db";

const h = vi.hoisted(() => ({ db: { current: null as any }, completion: { current: null as any }, email: vi.fn(async () => {}) }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "pro1" } } }) } }),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient: () => dbProxy(h.db) }));

vi.mock("openai", () => ({
  default: class {
    constructor(_: any) {}
    chat = { completions: { create: async () => h.completion.current } };
  },
}));

vi.mock("@/lib/resend", () => ({ emailRiesgoAlto: h.email }));

import { POST as riesgo } from "@/app/api/ia/riesgo/route";

function req(body: any): any {
  return new Request("http://localhost/api/ia/riesgo", { method: "POST", body: JSON.stringify(body) });
}

function setNivel(nivel: string) {
  h.completion.current = {
    choices: [{ message: { content: JSON.stringify({ nivel, indicadores: ["desesperanza"], recomendaciones: ["derivar"] }) } }],
  };
}

describe("ia/riesgo — protocolo de crisis", () => {
  beforeEach(() => { h.email.mockClear(); });

  it("nivel alto → inserta risk_flag y notifica al profesional", async () => {
    setNivel("alto");
    const db = makeDb({
      appointments: { count: 1 },              // relación profesional↔paciente existe
      risk_flags: { data: { id: "flag1" } },
      profiles: { data: { email: "pro@x.com", full_name: "Pro Test" } },
    });
    h.db.current = db;

    const res = await riesgo(req({ notas: [{ content: "no quiero seguir" }], patientId: "pat1", source: "sesion" }));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.nivel).toBe("alto");

    const insert = db.ops.find(o => o.table === "risk_flags" && o.op === "insert");
    expect(insert).toBeTruthy();
    expect(insert?.value).toMatchObject({ nivel: "alto", patient_id: "pat1", professional_id: "pro1", source: "sesion" });
    expect(h.email).toHaveBeenCalledOnce();
  });

  it("nivel bajo → registra pero NO manda email", async () => {
    setNivel("bajo");
    const db = makeDb({
      appointments: { count: 1 },
      risk_flags: { data: { id: "flag2" } },
      profiles: { data: { email: "pro@x.com", full_name: "Pro" } },
    });
    h.db.current = db;

    await riesgo(req({ notas: [{ content: "estable" }], patientId: "pat1", source: "sesion" }));
    expect(db.ops.find(o => o.table === "risk_flags" && o.op === "insert")).toBeTruthy();
    expect(h.email).not.toHaveBeenCalled();
  });

  it("sin relación profesional↔paciente (0 appointments) → no persiste flag", async () => {
    setNivel("alto");
    const db = makeDb({ appointments: { count: 0 }, risk_flags: { data: { id: "x" } }, profiles: { data: {} } });
    h.db.current = db;
    await riesgo(req({ notas: [{ content: "x" }], patientId: "ajeno", source: "sesion" }));
    expect(db.ops.find(o => o.table === "risk_flags")).toBeUndefined();
    expect(h.email).not.toHaveBeenCalled();
  });
});
