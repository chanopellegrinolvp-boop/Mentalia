import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { professionalId, professionalName, price, specialty } = body;

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "MercadoPago no configurado" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentalia-app.vercel.app";

  const preference = {
    items: [
      {
        id: professionalId,
        title: `Sesión con ${professionalName}`,
        description: specialty ?? "Sesión de psicología",
        quantity: 1,
        unit_price: Number(price),
        currency_id: "ARS",
      },
    ],
    payer: user ? { email: user.email } : undefined,
    back_urls: {
      success: `${siteUrl}/pago/exito?pro=${professionalId}`,
      failure: `${siteUrl}/pago/fallo?pro=${professionalId}`,
      pending: `${siteUrl}/pago/pendiente?pro=${professionalId}`,
    },
    auto_return: "approved",
    statement_descriptor: "MENTALIA",
    external_reference: `${professionalId}${user ? `-${user.id}` : ""}`,
    notification_url: `${siteUrl}/api/pagos/webhook`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("MP error:", err);
    return NextResponse.json({ error: "Error creando preferencia" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point });
}
