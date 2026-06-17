import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mentaliasalud.online";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const planesValidos: Record<string, number> = {
  Starter: 16500,
  Pro: 45000,
  Clinica: 85000,
};

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { plan, monto } = await req.json();

  // Normalizar: "Clínica" → "Clinica", "Starter" → "Starter", etc.
  const planNorm: string = (plan ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "");

  if (!planesValidos[planNorm] || planesValidos[planNorm] !== monto) {
    return NextResponse.json({ error: "Plan o monto inválido" }, { status: 400 });
  }

  try {
    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        items: [
          {
            id: `plan-${planNorm.toLowerCase()}`,
            title: `Mentalia — Plan ${planNorm}`,
            description: `Suscripción mensual al plan ${planNorm} de Mentalia`,
            quantity: 1,
            unit_price: monto,
            currency_id: "ARS",
          },
        ],
        payer: { email: user.email },
        back_urls: {
          success: `${SITE_URL}/dashboard/profesional/pagos?status=success&plan=${planNorm}`,
          failure: `${SITE_URL}/dashboard/profesional/pagos?status=failure`,
          pending: `${SITE_URL}/dashboard/profesional/pagos?status=pending`,
        },
        auto_return: "approved",
        notification_url: `${SITE_URL}/api/pagos/webhook`,
        external_reference: user.id,
        statement_descriptor: "MENTALIA",
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Error creando preferencia MP:", error);
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 });
  }
}
