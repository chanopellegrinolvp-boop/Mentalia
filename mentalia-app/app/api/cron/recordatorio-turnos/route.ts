import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mentaliasalud.online";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Calcular "mañana completo" en ARS (UTC-3, sin DST)
  const ahora = new Date();
  const ahoraARS = new Date(ahora.getTime() - 3 * 60 * 60 * 1000);
  // Inicio de mañana en ARS: 00:00 ARS = 03:00 UTC
  const mañanaARS = new Date(ahoraARS);
  mañanaARS.setUTCDate(mañanaARS.getUTCDate() + 1);
  mañanaARS.setUTCHours(0, 0, 0, 0);
  const pasadoARS = new Date(mañanaARS);
  pasadoARS.setUTCDate(pasadoARS.getUTCDate() + 1);
  const desde = new Date(mañanaARS.getTime() + 3 * 60 * 60 * 1000); // 03:00 UTC
  const hasta = new Date(pasadoARS.getTime() + 3 * 60 * 60 * 1000); // 03:00 UTC siguiente

  const { data: turnos, error } = await supabase
    .from("appointments")
    .select("id, scheduled_at, video_room_url, patient_id, professional_id, professionals ( profiles (full_name) )")
    .eq("status", "scheduled")
    .gte("scheduled_at", desde.toISOString())
    .lte("scheduled_at", hasta.toISOString());

  if (error) {
    console.error("[cron] Error consultando turnos:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!turnos || turnos.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  let enviados = 0;
  let errores = 0;

  for (const turno of turnos) {
    const { data: pacienteProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", turno.patient_id)
      .single();

    if (!pacienteProfile?.email) continue;

    const fechaTurno = new Date(turno.scheduled_at);
    const fecha = fechaTurno.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    });
    const hora = fechaTurno.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const profesionalNombre = (turno.professionals as any)?.profiles?.full_name ?? "tu profesional";
    const meet_url = turno.video_room_url ?? `${SITE_URL}/dashboard/paciente/videollamada`;

    const res = await fetch(`${SITE_URL}/api/emails/recordatorio-turno`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_email: pacienteProfile.email,
        paciente_nombre: pacienteProfile.full_name ?? "Paciente",
        profesional_nombre: profesionalNombre,
        fecha,
        hora,
        meet_url,
      }),
    });

    if (res.ok) {
      enviados++;
    } else {
      errores++;
      console.error(`[cron] Error enviando recordatorio turno ${turno.id}`);
    }
  }

  console.log(`[cron] Recordatorios: ${enviados} enviados, ${errores} errores`);
  return NextResponse.json({ ok: true, enviados, errores });
}
