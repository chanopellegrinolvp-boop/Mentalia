import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "DAILY_API_KEY no configurado en el servidor" }, { status: 500 });

  const { sesionId } = await req.json();

  const { data: appt } = await supabase
    .from("appointments")
    .select("video_room_url")
    .eq("id", sesionId)
    .single();

  if (appt?.video_room_url?.startsWith("https://")) {
    return NextResponse.json({ url: appt.video_room_url });
  }

  const exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  const roomName = `mentalia-${sesionId}`;

  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      properties: { exp, enable_chat: true, eject_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    }),
  });

  const resText = await res.text();

  if (!res.ok) {
    // Si la sala ya existe, obtenerla
    if (res.status === 400 && resText.includes("already exists")) {
      const getRes = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (getRes.ok) {
        const existing = await getRes.json();
        await supabase.from("appointments").update({
          daily_room_name: existing.name,
          video_room_url: existing.url,
          started_at: new Date().toISOString(),
          status: "confirmed",
        }).eq("id", sesionId);
        return NextResponse.json({ url: existing.url, name: existing.name });
      }
    }
    return NextResponse.json({ error: `Error Daily.co ${res.status}: ${resText}` }, { status: 500 });
  }

  const room = JSON.parse(resText);

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
