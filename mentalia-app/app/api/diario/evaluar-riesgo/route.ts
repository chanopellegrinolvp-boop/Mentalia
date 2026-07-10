import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { detectaSenalAlerta } from "@/lib/preFiltroRiesgo";
import { evaluarRiesgoIA, registrarRiesgoYNotificar } from "@/lib/riesgo";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { note } = await req.json();

  // 1) Pre-filtro barato (sin IA). La mayoría de las entradas terminan acá.
  if (!detectaSenalAlerta(note)) {
    return NextResponse.json({ evaluado: false });
  }

  // 2) Profesional del paciente (más reciente). Sin profesional no hay a quién notificar.
  const { data: appt } = await supabaseAdmin
    .from("appointments")
    .select("professional_id")
    .eq("patient_id", user.id)
    .not("professional_id", "is", null)
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const professionalId = appt?.professional_id as string | undefined;
  if (!professionalId) {
    return NextResponse.json({ evaluado: true, flag: false, motivo: "sin profesional asignado" });
  }

  // 3) Escala a gpt-4o SOLO si el pre-filtro disparó.
  let riesgo;
  try {
    riesgo = await evaluarRiesgoIA(`Entrada del diario emocional del paciente: ${note}`);
  } catch (err) {
    console.error("[diario/evaluar-riesgo]", err);
    return NextResponse.json({ evaluado: true, error: true }, { status: 500 });
  }

  if (!riesgo.nivel) {
    return NextResponse.json({ evaluado: true, flag: false });
  }

  // 4) Persiste (source: diario) y dispara el flujo por nivel ya existente.
  const flagId = await registrarRiesgoYNotificar({
    patientId: user.id,
    professionalId,
    source: "diario",
    nivel: riesgo.nivel,
    indicadores: riesgo.indicadores,
  });

  return NextResponse.json({ evaluado: true, nivel: riesgo.nivel, flagId });
}
