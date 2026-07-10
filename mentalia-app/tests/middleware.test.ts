import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { makeDb, dbProxy } from "./helpers/db";

const h = vi.hoisted(() => ({ db: { current: null as any } }));

vi.mock("@supabase/ssr", () => ({ createServerClient: () => dbProxy(h.db) }));

import { middleware } from "@/middleware";

const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

function proDb(trial_ends_at: string, paidCount = 0) {
  return makeDb({
    __user: { id: "pro1" },
    profiles: { data: { role: "professional" } },
    professionals: { data: { trial_ends_at } },
    payments: { count: paidCount },
  });
}

function reqTo(path: string) {
  return new NextRequest(`https://mentaliasalud.online${path}`);
}

describe("middleware — trial enforcement", () => {
  it("trial vencido + sin pagos → redirige a pagos?trial_expired", async () => {
    h.db.current = proDb(past, 0);
    const res = await middleware(reqTo("/dashboard/profesional"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard/profesional/pagos");
    expect(res.headers.get("location")).toContain("trial_expired=true");
  });

  it("trial vencido pero con pago reciente → NO bloquea", async () => {
    h.db.current = proDb(past, 1);
    const res = await middleware(reqTo("/dashboard/profesional"));
    const loc = res.headers.get("location") ?? "";
    expect(loc).not.toContain("trial_expired");
  });

  it("trial vencido pero en /perfil → NO bloquea (excepción)", async () => {
    h.db.current = proDb(past, 0);
    const res = await middleware(reqTo("/dashboard/profesional/perfil"));
    const loc = res.headers.get("location") ?? "";
    expect(loc).not.toContain("trial_expired");
  });

  it("trial vigente → NO bloquea", async () => {
    h.db.current = proDb(future, 0);
    const res = await middleware(reqTo("/dashboard/profesional"));
    const loc = res.headers.get("location") ?? "";
    expect(loc).not.toContain("trial_expired");
  });
});
