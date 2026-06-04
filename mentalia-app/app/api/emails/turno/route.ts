import { NextRequest, NextResponse } from "next/server";
import { emailTurnoConfirmado } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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
