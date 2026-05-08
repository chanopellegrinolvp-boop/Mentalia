import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailPagoConfirmado } from "@/lib/resend";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { type, data } = body;

  if (type !== "payment") return NextResponse.json({ ok: true });

  const paymentId = data?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });

  if (!mpRes.ok) return NextResponse.json({ ok: true });

  const payment = await mpRes.json();
  const { status, external_reference, transaction_amount } = payment;

  if (!external_reference) return NextResponse.json({ ok: true });

  const [professionalId, patientId] = external_reference.split("-");

  await supabaseAdmin.from("payments").upsert({
    id: String(paymentId),
    professional_id: professionalId,
    patient_id: patientId ?? null,
    amount: transaction_amount,
    status: status === "approved" ? "paid" : status === "pending" ? "pending" : "failed",
    mp_payment_id: String(paymentId),
    created_at: new Date().toISOString(),
  }, { onConflict: "id" });

  if (status === "approved" && patientId) {
    const [{ data: patient }, { data: professional }] = await Promise.all([
      supabaseAdmin.from("profiles").select("email, full_name").eq("id", patientId).single(),
      supabaseAdmin.from("profiles").select("full_name").eq("id", professionalId).single(),
    ]);
    if (patient?.email) {
      await emailPagoConfirmado({
        to: patient.email,
        nombre: patient.full_name ?? "Paciente",
        profesionalName: professional?.full_name ?? "tu profesional",
        monto: Number(transaction_amount),
        paymentId: String(paymentId),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const id = searchParams.get("id");

  if (topic === "payment" && id) {
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    if (mpRes.ok) {
      const payment = await mpRes.json();
      const [professionalId, patientId] = (payment.external_reference ?? "").split("-");
      await supabaseAdmin.from("payments").upsert({
        id: String(id),
        professional_id: professionalId,
        patient_id: patientId ?? null,
        amount: payment.transaction_amount,
        status: payment.status === "approved" ? "paid" : "pending",
        mp_payment_id: String(id),
        created_at: new Date().toISOString(),
      }, { onConflict: "id" });
    }
  }

  return NextResponse.json({ ok: true });
}
