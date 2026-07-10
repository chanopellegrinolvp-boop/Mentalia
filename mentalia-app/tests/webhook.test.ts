import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "node:crypto";
import { makeDb, dbProxy } from "./helpers/db";

const h = vi.hoisted(() => ({ db: { current: null as any }, pago: { current: null as any }, email: vi.fn(async () => {}) }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => dbProxy(h.db),
}));

vi.mock("mercadopago", () => ({
  MercadoPagoConfig: class { constructor(_: any) {} },
  Payment: class { get() { return Promise.resolve(h.pago.current); } },
}));

vi.mock("@/lib/resend", () => ({ emailPagoConfirmado: h.email }));

import { POST as webhook } from "@/app/api/pagos/webhook/route";

function firmar(paymentId: string, requestId: string) {
  const ts = String(Date.now());
  const manifest = `id:${paymentId};request-id:${requestId};ts:${ts}`;
  const v1 = crypto.createHmac("sha256", process.env.MP_WEBHOOK_SECRET!).update(manifest).digest("hex");
  return `ts=${ts},v1=${v1}`;
}

function req(body: any, sig: string, requestId: string) {
  return new Request("http://localhost/api/pagos/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-signature": sig, "x-request-id": requestId },
    body: JSON.stringify(body),
  });
}

describe("pagos/webhook", () => {
  beforeEach(() => { h.email.mockClear(); });

  it("pago approved con firma válida → inserta payment 'paid' y notifica", async () => {
    h.pago.current = {
      id: 123456,
      status: "approved",
      external_reference: "pro1",
      transaction_amount: 45000,
      description: "Plan Pro",
      date_approved: "2026-07-10T12:00:00.000Z",
    };
    const db = makeDb({
      payments: { data: null, error: null },
      profiles: { data: { email: "pro@x.com", full_name: "Pro Test" } },
      professionals: { data: null },
    });
    h.db.current = db;

    const requestId = "req-1";
    const sig = firmar("123456", requestId);
    const res = await webhook(req({ type: "payment", data: { id: 123456 } }, sig, requestId));
    expect(res.status).toBe(200);

    const insert = db.ops.find(o => o.table === "payments" && o.op === "insert");
    expect(insert).toBeTruthy();
    expect(insert?.value).toMatchObject({ professional_id: "pro1", amount: 45000, status: "paid", plan: "pro" });
    expect(h.email).toHaveBeenCalledOnce();
  });

  it("firma HMAC inválida → no procesa el pago (no inserta)", async () => {
    const db = makeDb({ payments: { data: null } });
    h.db.current = db;
    h.pago.current = { id: 1, status: "approved", external_reference: "pro1", transaction_amount: 100 };
    const res = await webhook(req({ type: "payment", data: { id: 123456 } }, "ts=1,v1=deadbeef", "req-x"));
    expect(res.status).toBe(200); // el webhook siempre responde 200
    expect(db.ops.find(o => o.op === "insert")).toBeUndefined();
    expect(h.email).not.toHaveBeenCalled();
  });
});
