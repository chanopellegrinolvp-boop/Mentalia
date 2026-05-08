import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { patientId, patientName } = await req.json();

  const { data: notes } = await supabase
    .from("session_notes")
    .select("session_date, content, mood_rating, tags")
    .eq("professional_id", user.id)
    .eq("patient_id", patientId)
    .order("session_date", { ascending: false })
    .limit(6);

  if (!notes || notes.length < 2) {
    return NextResponse.json({ nivel: "sin_datos", mensaje: "Se necesitan al menos 2 sesiones para evaluar el riesgo." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API de IA no configurada" }, { status: 500 });
  }

  const notasTexto = notes.map(n =>
    `Fecha: ${n.session_date} | Estado emocional: ${n.mood_rating}/10\nNotas: ${n.content}`
  ).join("\n\n---\n\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Eres un asistente clínico. Analizá las siguientes notas del paciente ${patientName} y determiná el nivel de riesgo emocional. Respondé ÚNICAMENTE con un JSON con este formato exacto:
{"nivel":"bajo|medio|alto","mensaje":"Una frase breve explicando el nivel de riesgo"}

NOTAS:\n${notasTexto}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ nivel: "sin_datos", mensaje: "Error al analizar el riesgo." });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "{}";

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ nivel: "sin_datos", mensaje: "No se pudo analizar el riesgo." });
  }
}
