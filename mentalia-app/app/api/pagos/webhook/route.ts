import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { emailPagoConfirmado } from "@/lib/resend";
import crypto from "crypto";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fix 1: verificar firma HMAC de MercadoPago
// Template: "id:<paymentId>;request-id:<x-request-id>;ts:<ts>"
function verifyMPSignature(req: Request, paymentId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Webhook MP] MP_WEBHOOK_SECRET no configurada — rechazando request");
    return false;
  }

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id") ?? "";
  if (!xSignature) return false;

  const parts: Record<string, string> = {};
  xSignature.split(",").forEach(part => {
    const idx = part.indexOf("=");
    if (idx > 0) parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts}`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

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
      // Fix 1: verificar firma antes de procesar
      if (!verifyMPSignature(req, String(body.data.id))) {
        console.warn("[Webhook MP] Firma HMAC inválida — request ignorada");
        return NextResponse.json({ ok: true });
      }

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

        let plan: string = "unknown";

        const descMatch = paymentData.description?.match(/plan\s+(\w+)/i);
        if (descMatch) {
          plan = descMatch[1].toLowerCase();
        } else if (paymentData.additional_info?.items?.[0]?.title) {
          const titleMatch = paymentData.additional_info.items[0].title.match(/plan\s+(\w+)/i);
          if (titleMatch) plan = titleMatch[1].toLowerCase();
        } else if (professionalId) {
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


        if (professionalId) {
          const { error: insertError } = await supabaseAdmin.from("payments").insert({
            professional_id: professionalId,
            amount: monto,
            status: "paid",
            mercadopago_id: String(paymentData.id),
            plan,
            paid_at: paymentData.date_approved
              ? new Date(paymentData.date_approved).toISOString()
              : new Date().toISOString(),
          });

          if (insertError) {
            console.error("Error guardando pago:", insertError.message);
          }

          if (plan && plan !== "unknown") {
            await Promise.all([
              supabaseAdmin.from("professionals").update({ plan }).eq("id", professionalId),
              supabaseAdmin.from("profiles").update({ plan }).eq("id", professionalId),
            ]);
          }

          if (!insertError) {
            try {
              const { data: prof } = await supabaseAdmin
                .from("profiles")
                .select("email, full_name")
                .eq("id", professionalId)
                .single();

              if (prof?.email) {
                await emailPagoConfirmado({
                  to: prof.email,
                  nombre: prof.full_name ?? "Profesional",
                  profesionalName: prof.full_name ?? "Profesional",
                  monto: monto ?? 0,
                  paymentId: String(paymentData.id),
                });
              }
            } catch (e) {
              console.error("[Webhook MP] Error enviando email de confirmación:", e);
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook MP:", error);
    return NextResponse.json({ ok: true }); // Fix 2: siempre 200, nunca 500
  }
}
