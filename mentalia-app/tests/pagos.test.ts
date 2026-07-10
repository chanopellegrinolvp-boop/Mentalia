import { describe, it, expect, beforeEach, vi } from "vitest";
import { makeDb } from "./helpers/db";

// Estado compartido, hoisted para poder mockear módulos.
const h = vi.hoisted(() => ({
  db: { current: null as any },
  mp: { body: null as any },
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => h.db.current,
}));

vi.mock("mercadopago", () => ({
  MercadoPagoConfig: class { constructor(_: any) {} },
  Preference: class {
    create(arg: any) {
      h.mp.body = arg.body;
      return Promise.resolve({ init_point: "https://mp/checkout" });
    }
  },
  Payment: class { get() { return Promise.resolve({}); } },
}));

import { POST as crearPreferencia } from "@/app/api/pagos/crear-preferencia/route";
import { POST as cancelarPlan } from "@/app/api/pagos/cancelar-plan/route";

function req(body: any = {}) {
  return new Request("http://localhost/api", { method: "POST", body: JSON.stringify(body) });
}

describe("pagos/crear-preferencia", () => {
  beforeEach(() => { h.mp.body = null; });

  it("profesional + plan/monto válidos → init_point y preferencia correcta", async () => {
    h.db.current = makeDb({
      __user: { id: "pro1", email: "pro@x.com" },
      profiles: { data: { role: "professional" } },
      referrals: { count: 0 },
    });
    const res = await crearPreferencia(req({ plan: "Pro", monto: 45000 }));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.init_point).toBe("https://mp/checkout");
    expect(h.mp.body.items[0].unit_price).toBe(45000);
    expect(h.mp.body.items[0].currency_id).toBe("ARS");
    expect(h.mp.body.external_reference).toBe("pro1");
    expect(h.mp.body.notification_url).toMatch(/\/api\/pagos\/webhook$/);
  });

  it("con referido activo → aplica 20% de descuento", async () => {
    h.db.current = makeDb({
      __user: { id: "pro1", email: "pro@x.com" },
      profiles: { data: { role: "professional" } },
      referrals: { count: 1 },
    });
    await crearPreferencia(req({ plan: "Pro", monto: 45000 }));
    expect(h.mp.body.items[0].unit_price).toBe(36000); // 45000 * 0.8
  });

  it("monto que no coincide con el plan → 400", async () => {
    h.db.current = makeDb({
      __user: { id: "pro1", email: "pro@x.com" },
      profiles: { data: { role: "professional" } },
    });
    const res = await crearPreferencia(req({ plan: "Pro", monto: 999 }));
    expect(res.status).toBe(400);
  });

  it("no profesional → 403", async () => {
    h.db.current = makeDb({ __user: { id: "p1" }, profiles: { data: { role: "patient" } } });
    const res = await crearPreferencia(req({ plan: "Pro", monto: 45000 }));
    expect(res.status).toBe(403);
  });

  it("sin usuario → 401", async () => {
    h.db.current = makeDb({ __user: null });
    const res = await crearPreferencia(req({ plan: "Pro", monto: 45000 }));
    expect(res.status).toBe(401);
  });
});

describe("pagos/cancelar-plan", () => {
  it("profesional → cancela plan y setea subscription_status", async () => {
    const db = makeDb({ __user: { id: "pro1" }, profiles: { data: { role: "professional" }, error: null } });
    h.db.current = db;
    const res = await cancelarPlan();
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.mensaje).toMatch(/cancelado/i);
    const updProfiles = db.ops.find(o => o.table === "profiles" && o.op === "update");
    expect(updProfiles?.value).toMatchObject({ plan: null, subscription_status: "cancelled" });
    const updPros = db.ops.find(o => o.table === "professionals" && o.op === "update");
    expect(updPros?.value).toMatchObject({ plan: null });
  });

  it("no profesional → 403", async () => {
    h.db.current = makeDb({ __user: { id: "p1" }, profiles: { data: { role: "patient" } } });
    const res = await cancelarPlan();
    expect(res.status).toBe(403);
  });
});
