import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { notas, pacienteNombre, motivoConsulta, historialPrevio } = await req.json();

  if (!notas?.trim()) {
    return NextResponse.json({ error: "Sin notas para analizar" }, { status: 400 });
  }

  const contextoHistorial = historialPrevio
    ? `\n\nCONTEXTO DE SESIONES ANTERIORES:\n${historialPrevio}`
    : "";

  const prompt = `Sos un asistente clínico para psicólogos. Analizá las notas de sesión y generá un resumen estructurado.

PACIENTE: ${pacienteNombre ?? "Paciente"}
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
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as any).text?.trim() ?? "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}");

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
