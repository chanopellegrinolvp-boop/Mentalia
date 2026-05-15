import { NextRequest, NextResponse } from "next/server";
import { emailTurnoConfirmado } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const { paciente_email, paciente_nombre, profesional_nombre, fecha, hora, modalidad, meet_url } = await req.json();

  if (paciente_email) {
    await emailTurnoConfirmado({
      to: paciente_email,
      pacienteName: paciente_nombre,
      profesionalName: profesional_nombre,
      fecha,
      hora,
      modalidad,
      meetUrl: meet_url,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
