import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // Privacidad: NO se envía el nombre del paciente a OpenAI (solo texto clínico).
  const { notas, motivoConsulta, historialPrevio } = await req.json();

  if (!notas?.trim()) {
    return NextResponse.json({ error: "Sin notas para analizar" }, { status: 400 });
  }

  const contextoHistorial = historialPrevio
    ? `\n\nCONTEXTO DE SESIONES ANTERIORES:\n${historialPrevio}`
    : "";

  const prompt = `Sos un asistente clínico para psicólogos. Analizá las notas de sesión y generá un resumen estructurado.

MOTIVO DE CONSULTA: ${motivoConsulta ?? "No especificado"}${contextoHistorial}

NOTAS DE LA SESIÓN:
${notas}

Respondé en JSON con exactamente este formato:
{
  "resumen": "Párrafo conciso (3-5 oraciones) describiendo los temas principales de la sesión, el estado emocional del paciente y observaciones clínicas relevantes. Escrito en tercera persona.",
  "temas": ["tema1", "tema2", "tema3"],
  "nivelRiesgo": "bajo" | "medio" | "alto"
}

Para nivelRiesgo:
- "bajo": sin indicadores de riesgo
- "medio": indicadores que requieren seguimiento
- "alto": ideación suicida, autolesiones, situación de peligro

Solo respondé el JSON, sin texto adicional.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1024,
    });

    const parsed = JSON.parse(completion.choices[0].message.content ?? "{}");

    return NextResponse.json({
      resumen: parsed.resumen ?? "",
      temas: Array.isArray(parsed.temas) ? parsed.temas.slice(0, 6) : [],
      nivelRiesgo: ["bajo", "medio", "alto"].includes(parsed.nivelRiesgo) ? parsed.nivelRiesgo : "bajo",
    });
  } catch (err) {
    console.error("Error IA:", err);
    return NextResponse.json({ error: "Error al generar resumen" }, { status: 500 });
  }
}
