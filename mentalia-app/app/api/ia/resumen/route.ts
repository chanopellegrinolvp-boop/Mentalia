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
    .limit(10);

  if (!notes || notes.length === 0) {
    return NextResponse.json({ resumen: "No hay notas suficientes para generar un resumen." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API de IA no configurada" }, { status: 500 });
  }

  const notasTexto = notes.map(n =>
    `Fecha: ${n.session_date} | Estado emocional: ${n.mood_rating}/10\nNotas: ${n.content}${n.tags?.length ? `\nEtiquetas: ${n.tags.join(", ")}` : ""}`
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
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Eres un asistente clínico para profesionales de salud mental. Analizá las siguientes notas de sesión del paciente ${patientName} y generá un resumen breve y útil para el profesional antes de la próxima sesión. Resaltá patrones, progreso, temas recurrentes y cualquier punto de atención. Respondé en español, en formato claro y profesional, máximo 3 párrafos.\n\nNOTAS:\n${notasTexto}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al generar el resumen" }, { status: 500 });
  }

  const data = await res.json();
  const resumen = data.content?.[0]?.text ?? "No se pudo generar el resumen.";
  return NextResponse.json({ resumen });
}
