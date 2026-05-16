import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { emailPagoConfirmado } from "@/lib/resend";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  if (!process.env.MP_ACCESS_TOKEN) {
    console.error("[Webhook MP] MP_ACCESS_TOKEN no configurado");
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      console.warn("[Webhook MP] Body inválido recibido");
      return NextResponse.json({ ok: true });
    }

    if (body.type === "payment" && body.data?.id) {
      const paymentClient = new Payment(mp);
      const paymentData = await paymentClient.get({ id: body.data.id });

      if (!paymentData?.id) {
        console.warn("[Webhook MP] Payment ID no encontrado en MP:", body.data.id);
        return NextResponse.json({ ok: true });
      }

      if (paymentData.status === "approved") {
        const professionalId = paymentData.external_reference;
        const monto = paymentData.transaction_amount;
        const itemId = paymentData.additional_info?.items?.[0]?.id ?? "";
        const plan = itemId.replace("plan-", "") as "starter" | "pro" | "clinica";

        if (professionalId) {
          const { error } = await supabaseAdmin.from("payments").insert({
            professional_id: professionalId,
            amount: monto,
            status: "paid",
            mercadopago_id: String(paymentData.id),
            plan,
            paid_at: new Date().toISOString(),
          });

          if (error) {
            console.error("Error guardando pago:", error.message);
          } else {
            if (plan) {
              await supabaseAdmin
                .from("professionals")
                .update({ plan })
                .eq("id", professionalId);
            }

            try {
              const { data: prof } = await supabaseAdmin
                .from("profiles")
                .select("email, full_name")
                .eq("id", professionalId)
                .single();

              if (prof?.email) {
                console.log(`[EMAIL] pago_confirmado enviado a ${prof.email} - ${new Date().toISOString()}`);
                await emailPagoConfirmado({
                  to: prof.email,
                  nombre: prof.full_name ?? "Profesional",
                  profesionalName: prof.full_name ?? "Profesional",
                  monto: monto ?? 0,
                  paymentId: String(paymentData.id),
                });
              }
            } catch {
              // No bloquear el webhook si el email falla
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook MP:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
