import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ userId: "admin1", updates: [] as any[] }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: h.userId } } }) } }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (t: string) => ({ update: (v: any) => ({ eq: async () => { h.updates.push({ table: t, value: v }); return { error: null }; } }) }),
  }),
}));

import { POST as verificar } from "@/app/api/admin/verificar/route";

function req(body: any): any {
  return new Request("http://localhost/api/admin/verificar", { method: "POST", body: JSON.stringify(body) });
}

describe("admin/verificar", () => {
  beforeEach(() => { process.env.ADMIN_USER_IDS = "admin1"; h.userId = "admin1"; h.updates = []; });

  it("no-admin → 403 (no toca nada)", async () => {
    h.userId = "cualquiera";
    const res = await verificar(req({ professionalId: "pro1", action: "aprobar" }));
    expect(res.status).toBe(403);
    expect(h.updates).toHaveLength(0);
  });

  it("admin aprobar → verification_status = 'verificado'", async () => {
    const res = await verificar(req({ professionalId: "pro1", action: "aprobar" }));
    expect(res.status).toBe(200);
    const upd = h.updates.find(u => u.table === "professionals");
    expect(upd?.value).toMatchObject({ verification_status: "verificado" });
  });

  it("admin rechazar → verification_status = 'rechazado'", async () => {
    const res = await verificar(req({ professionalId: "pro1", action: "rechazar" }));
    expect(res.status).toBe(200);
    expect(h.updates[0].value).toMatchObject({ verification_status: "rechazado" });
  });

  it("acción inválida → 400", async () => {
    const res = await verificar(req({ professionalId: "pro1", action: "borrar" }));
    expect(res.status).toBe(400);
  });
});
