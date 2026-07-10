import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { evaluarRiesgoIA, registrarRiesgoYNotificar } from "@/lib/riesgo";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { notas, patientId, source } = await req.json();
  if (!notas?.length) return NextResponse.json({ error: "Sin notas" }, { status: 400 });

  const notasTexto = notas.slice(-5)
    .map((n: { content: string }, i: number) => `Sesion reciente ${i + 1}: ${n.content}`)
    .join("\n\n");

  let riesgo;
  try {
    riesgo = await evaluarRiesgoIA(notasTexto);
  } catch (err) {
    console.error("[IA/riesgo]", err);
    return NextResponse.json({ error: "Error al evaluar riesgo" }, { status: 500 });
  }

  // Protocolo de crisis: persistir solo para pacientes online y nivel normalizado.
  if (patientId && riesgo.nivel) {
    // Verificar la relación profesional↔paciente (evita flags arbitrarios)
    const { count } = await supabaseAdmin
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id)
      .eq("patient_id", patientId);

    if (count && count > 0) {
      const flagId = await registrarRiesgoYNotificar({
        patientId,
        professionalId: user.id,
        source: source === "diario" ? "diario" : "sesion",
        nivel: riesgo.nivel,
        indicadores: riesgo.indicadores,
      });
      return NextResponse.json({ ...riesgo.raw, flagId });
    }
  }

  return NextResponse.json(riesgo.raw);
}
