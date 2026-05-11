import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "payment" && body.data?.id) {
      const paymentClient = new Payment(mp);
      const paymentData = await paymentClient.get({ id: body.data.id });

      if (paymentData.status === "approved") {
        const userId = paymentData.external_reference;
        const monto = paymentData.transaction_amount;
        const itemId = paymentData.additional_info?.items?.[0]?.id ?? "";
        const plan = itemId.replace("plan-", "");

        if (userId) {
          const { error } = await supabaseAdmin.from("payments").insert({
            user_id: userId,
            amount: monto,
            status: "approved",
            mp_payment_id: String(paymentData.id),
            plan,
            created_at: new Date().toISOString(),
          });

          if (error) {
            console.error("Error guardando pago:", error.message);
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
