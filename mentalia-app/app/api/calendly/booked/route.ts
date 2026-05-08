import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailTurnoConfirmado, emailNuevoTurnoProfesional } from "@/lib/resend";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { professionalId, eventUri, inviteeUri } = await req.json().catch(() => ({}));
  if (!professionalId) return NextResponse.json({ ok: true });

  // Obtener datos del profesional
  const { data: pro } = await supabaseAdmin
    .from("professionals")
    .select("*, profiles!id(full_name, email)")
    .eq("id", professionalId)
    .single();

  const profProfile = pro?.profiles as any;
  const professionalName: string = profProfile?.full_name ?? "Profesional";
  const professionalEmail: string = profProfile?.email ?? "";

  // Intentar obtener detalles del evento vía Calendly API si hay token
  let patientName = "Paciente";
  let patientEmail = "";
  let startTime = new Date().toISOString();
  let durationMinutes = 60;

  const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
  if (calendlyToken && eventUri) {
    try {
      const [evRes, invRes] = await Promise.all([
        fetch(eventUri, { headers: { Authorization: `Bearer ${calendlyToken}` } }),
        inviteeUri ? fetch(inviteeUri, { headers: { Authorization: `Bearer ${calendlyToken}` } }) : Promise.resolve(null),
      ]);
      if (evRes.ok) {
        const evData = await evRes.json();
        const ev = evData.resource;
        if (ev?.start_time) startTime = ev.start_time;
        if (ev?.start_time && ev?.end_time) {
          durationMinutes = Math.round((new Date(ev.end_time).getTime() - new Date(ev.start_time).getTime()) / 60000);
        }
      }
      if (invRes?.ok) {
        const invData = await invRes.json();
        const inv = invData.resource;
        if (inv?.name) patientName = inv.name;
        if (inv?.email) patientEmail = inv.email;
      }
    } catch { /* silencioso */ }
  }

  // Buscar paciente por email en nuestra DB
  let patientId: string | null = null;
  if (patientEmail) {
    const { data: patient } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .eq("email", patientEmail)
      .single();
    if (patient) { patientId = patient.id; patientName = patient.full_name ?? patientName; }
  }

  // Crear el turno en Supabase
  await supabaseAdmin.from("appointments").insert({
    professional_id: professionalId,
    patient_id: patientId,
    scheduled_at: startTime,
    duration_minutes: durationMinutes,
    status: "confirmed",
    modality: "online",
    notes: eventUri ? `Calendly: ${eventUri}` : "Reservado vía Calendly",
  });

  // Emails de confirmación
  const startDate = new Date(startTime);
  const fechaStr = startDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const horaStr = startDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  await Promise.all([
    patientEmail ? emailTurnoConfirmado({
      to: patientEmail,
      pacienteName: patientName,
      profesionalName: professionalName,
      fecha: fechaStr,
      hora: horaStr,
      modalidad: "Online",
    }) : Promise.resolve(),
    professionalEmail ? emailNuevoTurnoProfesional({
      to: professionalEmail,
      profesionalName: professionalName,
      pacienteName: patientName,
      patieneEmail: patientEmail,
      fecha: fechaStr,
      hora: horaStr,
    }) : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
