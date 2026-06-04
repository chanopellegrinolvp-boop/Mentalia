import { NextRequest, NextResponse } from "next/server";
import { emailSolicitudConsulta } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { profesional_email, profesional_nombre, paciente_nombre, motivo, modalidad, disponibilidad, mensaje } = await req.json();

  if (profesional_email) {
    await emailSolicitudConsulta({
      to: profesional_email,
      profesionalNombre: profesional_nombre,
      pacienteNombre: paciente_nombre,
      motivo,
      modalidad,
      disponibilidad: Array.isArray(disponibilidad) ? disponibilidad : [disponibilidad],
      mensaje: mensaje || undefined,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
