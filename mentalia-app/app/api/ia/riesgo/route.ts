import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { emailRiesgoAlto } from "@/lib/resend";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NIVELES = ["bajo", "medio", "alto"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { notas, patientId, source } = await req.json();
  if (!notas?.length) return NextResponse.json({ error: "Sin notas" }, { status: 400 });

  const notasTexto = notas.slice(-5)
    .map((n: { content: string }, i: number) => `Sesion reciente ${i + 1}: ${n.content}`)
    .join("\n\n");

  let data: Record<string, unknown>;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres un asistente clinico. Responde SOLO con JSON valido, sin texto adicional." },
        { role: "user", content: `Evalua el nivel de riesgo del paciente. Responde con este JSON: {"nivel":"bajo","indicadores":["..."],"recomendaciones":["..."]}\n\n${notasTexto}` },
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.2,
    });

    try {
      data = JSON.parse(completion.choices[0].message.content ?? "{}");
    } catch {
      console.error("[IA/riesgo] JSON inválido:", completion.choices[0].message.content);
      return NextResponse.json({ error: "Respuesta de IA inválida" }, { status: 500 });
    }
  } catch (err) {
    console.error("[IA/riesgo]", err);
    return NextResponse.json({ error: "Error al evaluar riesgo" }, { status: 500 });
  }

  // ── Protocolo de crisis: persistir la evaluación en risk_flags ──
  // Solo para pacientes online (patient_id = cuenta real) y nivel normalizado.
  const nivel = typeof data.nivel === "string" && NIVELES.includes(data.nivel) ? data.nivel : null;

  if (patientId && nivel) {
    // Verificar que el paciente es realmente de este profesional (evita flags arbitrarios)
    const { count } = await supabaseAdmin
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id)
      .eq("patient_id", patientId);

    if (count && count > 0) {
      const indicadores = Array.isArray(data.indicadores) ? (data.indicadores as string[]) : [];
      const src = source === "diario" ? "diario" : "sesion";

      const { data: flag } = await supabaseAdmin
        .from("risk_flags")
        .insert({
          patient_id: patientId,
          professional_id: user.id,
          source: src,
          nivel,
          detalle: indicadores.join(" · ").slice(0, 2000) || null,
        })
        .select("id")
        .single();

      // Nivel alto: email al profesional (además de la notificación en su dashboard)
      if (nivel === "alto") {
        const [{ data: prof }, { data: pac }] = await Promise.all([
          supabaseAdmin.from("profiles").select("email, full_name").eq("id", user.id).single(),
          supabaseAdmin.from("profiles").select("full_name").eq("id", patientId).single(),
        ]);
        if (prof?.email) {
          await emailRiesgoAlto({
            to: prof.email,
            profesionalName: prof.full_name ?? "Profesional",
            pacienteName: pac?.full_name ?? "un paciente",
            indicadores,
          }).catch(() => {});
        }
      }

      return NextResponse.json({ ...data, flagId: flag?.id ?? null });
    }
  }

  return NextResponse.json(data);
}
