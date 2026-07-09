import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailSolicitudHistoria } from "@/lib/resend";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "patient") {
    return NextResponse.json({ error: "Solo pacientes" }, { status: 403 });
  }

  await emailSolicitudHistoria({
    pacienteNombre: profile.full_name ?? "Paciente",
    pacienteEmail: profile.email ?? user.email ?? "—",
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
