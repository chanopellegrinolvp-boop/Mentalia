import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { emailRiesgoAlto } from "@/lib/resend";

// Lógica compartida del protocolo de crisis: evaluación IA + persistencia + notificación.
// La usan tanto ia/riesgo (source: sesion, disparado por el profesional) como
// diario/evaluar-riesgo (source: diario, disparado por el pre-filtro del paciente).

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NIVELES = ["bajo", "medio", "alto"];

export type Riesgo = {
  nivel: string | null; // bajo|medio|alto normalizado, o null si la IA no lo dio válido
  indicadores: string[];
  recomendaciones: string[];
  raw: Record<string, unknown>;
};

export async function evaluarRiesgoIA(notasTexto: string): Promise<Riesgo> {
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

  const raw = JSON.parse(completion.choices[0].message.content ?? "{}") as Record<string, unknown>;
  const nivel = typeof raw.nivel === "string" && NIVELES.includes(raw.nivel) ? (raw.nivel as string) : null;
  return {
    nivel,
    indicadores: Array.isArray(raw.indicadores) ? (raw.indicadores as string[]) : [],
    recomendaciones: Array.isArray(raw.recomendaciones) ? (raw.recomendaciones as string[]) : [],
    raw,
  };
}

// Persiste un risk_flag y, si el nivel es alto, notifica por email al profesional.
// El banner al paciente y la notificación en el dashboard del profesional salen solos
// de las queries ya existentes sobre risk_flags.
export async function registrarRiesgoYNotificar(opts: {
  patientId: string;
  professionalId: string | null;
  source: "diario" | "sesion";
  nivel: string;
  indicadores: string[];
}): Promise<string | null> {
  const { patientId, professionalId, source, nivel, indicadores } = opts;

  // El flag se crea SIEMPRE (aunque no haya profesional): el banner de crisis al
  // paciente sale de risk_flags por patient_id, tenga o no professional_id.
  const { data: flag } = await supabaseAdmin
    .from("risk_flags")
    .insert({
      patient_id: patientId,
      professional_id: professionalId,
      source,
      nivel,
      detalle: indicadores.join(" · ").slice(0, 2000) || null,
    })
    .select("id")
    .single();

  // Notificación/email solo si hay profesional a quién avisar.
  if (nivel === "alto" && professionalId) {
    const [{ data: prof }, { data: pac }] = await Promise.all([
      supabaseAdmin.from("profiles").select("email, full_name").eq("id", professionalId).single(),
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

  return flag?.id ?? null;
}
