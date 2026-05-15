import { NextRequest, NextResponse } from "next/server";
import { emailSolicitudConsulta } from "@/lib/resend";

export async function POST(req: NextRequest) {
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
