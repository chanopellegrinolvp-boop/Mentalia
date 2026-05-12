import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { sesionId } = await req.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: sesion } = await supabase
    .from("appointments")
    .select("id, daily_room_name, professional_id")
    .eq("id", sesionId)
    .eq("professional_id", user.id)
    .single();

  if (!sesion) return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });

  let roomName = sesion.daily_room_name;
  let roomUrl: string;

  if (!roomName) {
    // Crear sala en Daily.co
    const dailyKey = process.env.DAILY_API_KEY;

    if (!dailyKey) {
      // Sin Daily.co: usar Jitsi Meet como fallback
      roomName = `mentalia-${sesionId.slice(0, 8)}`;
      roomUrl = `https://meet.jit.si/${roomName}`;
    } else {
      const res = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${dailyKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `mentalia-${sesionId.slice(0, 8)}`,
          properties: {
            enable_prejoin_ui: false,
            enable_chat: false,
            enable_screenshare: false,
            max_participants: 2,
            exp: Math.floor(Date.now() / 1000) + 7200, // 2 horas
          },
        }),
      });
      const room = await res.json();
      roomName = room.name;
      roomUrl = room.url;
    }

    await supabase
      .from("appointments")
      .update({ daily_room_name: roomName, started_at: new Date().toISOString(), status: "confirmed" })
      .eq("id", sesionId);
  } else {
    roomUrl = process.env.DAILY_API_KEY
      ? `https://${process.env.DAILY_DOMAIN ?? "mentalia"}.daily.co/${roomName}`
      : `https://meet.daily.co/${roomName}`;
  }

  return NextResponse.json({ roomUrl: roomUrl!, roomName });
}
