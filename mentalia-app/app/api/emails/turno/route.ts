import { NextRequest, NextResponse } from "next/server";
import { emailTurnoConfirmado } from "@/lib/resend";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.paciente_email && !body.appointmentId) return NextResponse.json({ ok: true });

  // Modo directo (legacy): si vienen los campos en el body, usarlos
  if (body.paciente_email) {
    await emailTurnoConfirmado({
      to: body.paciente_email,
      pacienteName: body.paciente_nombre ?? "Paciente",
      profesionalName: body.profesional_nombre ?? "Profesional",
      fecha: body.fecha ?? "",
      hora: body.hora ?? "",
      modalidad: body.modalidad ?? "Online",
      meetUrl: body.meet_url,
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  }

  // Modo appointmentId: reconstruir datos desde la DB
  const { appointmentId } = body;
  if (!appointmentId) return NextResponse.json({ ok: true });

  const { data: appt } = await supabaseAdmin
    .from("appointments")
    .select("id, scheduled_at, video_room_url, professional_id, patient_id, paciente_id")
    .eq("id", appointmentId)
    .single();

  if (!appt) return NextResponse.json({ ok: true });

  let destEmail: string | null = null;
  let destNombre = "Paciente";

  if (appt.patient_id) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", appt.patient_id)
      .single();
    destEmail = profile?.email ?? null;
    destNombre = profile?.full_name ?? "Paciente";
  } else if (appt.paciente_id) {
    const { data: pac } = await supabaseAdmin
      .from("pacientes")
      .select("nombre, email")
      .eq("id", appt.paciente_id)
      .single();
    destNombre = pac?.nombre ?? "Paciente";
    destEmail = (pac as any)?.email ?? null;
  }

  if (!destEmail) return NextResponse.json({ ok: true });

  const { data: profProfile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", appt.professional_id)
    .single();

  const fechaTurno = new Date(appt.scheduled_at);
  const fechaStr = fechaTurno.toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });
  const horaStr = fechaTurno.toLocaleTimeString("es-AR", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  await emailTurnoConfirmado({
    to: destEmail,
    pacienteName: destNombre,
    profesionalName: profProfile?.full_name ?? "Profesional",
    fecha: fechaStr,
    hora: horaStr,
    modalidad: "Online",
    meetUrl: appt.video_room_url ?? undefined,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
