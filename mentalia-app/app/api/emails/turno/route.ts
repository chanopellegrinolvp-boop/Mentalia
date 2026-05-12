import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { emailTurnoConfirmado, emailNuevoTurnoProfesional } from "@/lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();
    if (!appointmentId) return NextResponse.json({ ok: false });

    const { data: appt } = await supabaseAdmin
      .from("appointments")
      .select("scheduled_at, duration_minutes, professional_id, paciente_id")
      .eq("id", appointmentId)
      .single();

    if (!appt) return NextResponse.json({ ok: false });

    const [{ data: profProfile }, { data: paciente }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", appt.professional_id)
        .single(),
      supabaseAdmin
        .from("pacientes")
        .select("nombre, email")
        .eq("id", appt.paciente_id)
        .single(),
    ]);

    const fecha = new Date(appt.scheduled_at).toLocaleDateString("es-AR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const hora = new Date(appt.scheduled_at).toLocaleTimeString("es-AR", {
      hour: "2-digit", minute: "2-digit",
    });

    const tasks: Promise<void>[] = [];

    if (paciente?.email) {
      console.log(`[EMAIL] turno_confirmado enviado a ${paciente.email} - ${new Date().toISOString()}`);
      tasks.push(
        emailTurnoConfirmado({
          to: paciente.email,
          pacienteName: paciente.nombre,
          profesionalName: profProfile?.full_name ?? "tu profesional",
          fecha,
          hora,
          modalidad: "online",
        })
      );
    }

    if (profProfile?.email) {
      console.log(`[EMAIL] turno_nuevo_profesional enviado a ${profProfile.email} - ${new Date().toISOString()}`);
      tasks.push(
        emailNuevoTurnoProfesional({
          to: profProfile.email,
          profesionalName: profProfile.full_name ?? "Profesional",
          pacienteName: paciente?.nombre ?? "Paciente",
          patieneEmail: paciente?.email ?? "(sin email registrado)",
          fecha,
          hora,
        })
      );
    }

    await Promise.allSettled(tasks);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
