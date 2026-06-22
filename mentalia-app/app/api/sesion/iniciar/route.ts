import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { sesionId } = await req.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: sesion } = await supabase
    .from("appointments")
    .select("id, video_room_url, professional_id")
    .eq("id", sesionId)
    .eq("professional_id", user.id)
    .single();

  if (!sesion) return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });

  // Si ya tiene sala creada, devolvemos la existente
  if (sesion.video_room_url) {
    return NextResponse.json({ url: sesion.video_room_url });
  }

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "DAILY_API_KEY no configurado" }, { status: 500 });

  const exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: `mentalia-${sesionId}`,
      properties: { exp, enable_chat: true, eject_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Daily.co] Error creando sala:", err);
    return NextResponse.json({ error: "No se pudo crear la sala" }, { status: 500 });
  }

  const room = await res.json();

  await supabase
    .from("appointments")
    .update({
      daily_room_name: room.name,
      video_room_url: room.url,
      started_at: new Date().toISOString(),
      status: "confirmed",
    })
    .eq("id", sesionId);

  return NextResponse.json({ url: room.url, name: room.name });
}
