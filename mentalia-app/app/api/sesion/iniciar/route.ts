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

  const roomName = sesion.daily_room_name ?? `mentalia-sesion-${sesionId}`;
  const roomUrl = `https://meet.jit.si/${roomName}`;

  if (!sesion.daily_room_name) {
    await supabase
      .from("appointments")
      .update({ daily_room_name: roomName, started_at: new Date().toISOString(), status: "confirmed" })
      .eq("id", sesionId);
  }

  return NextResponse.json({ roomUrl, roomName });
}
