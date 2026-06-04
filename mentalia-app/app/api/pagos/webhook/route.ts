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

      let paymentData;
      try {
        paymentData = await paymentClient.get({ id: body.data.id });
      } catch {
        console.warn("[Webhook MP] No se pudo obtener el pago:", body.data.id);
        return NextResponse.json({ ok: true });
      }

      if (!paymentData?.id) {
        console.warn("[Webhook MP] Payment ID no encontrado en MP:", body.data.id);
        return NextResponse.json({ ok: true });
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("[Webhook MP] paymentData:", JSON.stringify(paymentData, null, 2));
      }

      if (paymentData.status === "approved") {
        const professionalId = paymentData.external_reference;
        const monto = paymentData.transaction_amount;

        // Extraer plan en orden de prioridad
        let plan: string = "unknown";

        // 1. Desde description ("Suscripción mensual al plan Pro de Mentalia")
        const descMatch = paymentData.description?.match(/plan\s+(\w+)/i);
        if (descMatch) {
          plan = descMatch[1].toLowerCase();
        }
        // 2. Desde additional_info.items[0].title
        else if (paymentData.additional_info?.items?.[0]?.title) {
          const titleMatch = paymentData.additional_info.items[0].title.match(/plan\s+(\w+)/i);
          if (titleMatch) plan = titleMatch[1].toLowerCase();
        }
        // 3. Desde la tabla payments existente para este professional_id
        else if (professionalId) {
          const { data: lastPayment } = await supabaseAdmin
            .from("payments")
            .select("plan")
            .eq("professional_id", professionalId)
            .not("plan", "is", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          if (lastPayment?.plan) plan = lastPayment.plan;
        }

        console.log(`[Webhook MP] plan extraído: ${plan}`);

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
