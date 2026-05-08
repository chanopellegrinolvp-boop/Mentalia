import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const moodLabels: Record<number, string> = {
  1: "Muy mal", 2: "Mal", 3: "Regular", 4: "Un poco mal", 5: "Neutral",
  6: "Bien", 7: "Bastante bien", 8: "Muy bien", 9: "Excelente", 10: "Increíble",
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { patientId, patientName } = await req.json();

  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().split("T")[0];

  const [{ data: diaryEntries }, { data: recentNotes }] = await Promise.all([
    supabase
      .from("emotional_diary")
      .select("date, mood, emotions, note")
      .eq("patient_id", patientId)
      .gte("date", dateStr)
      .order("date", { ascending: true }),
    supabase
      .from("session_notes")
      .select("session_date, content, mood_rating, tags")
      .eq("professional_id", user.id)
      .eq("patient_id", patientId)
      .order("session_date", { ascending: false })
      .limit(2),
  ]);

  const moodTrend = (diaryEntries ?? []).map((e: any) => e.mood as number);
  const avgMood = moodTrend.length
    ? Math.round((moodTrend.reduce((s, m) => s + m, 0) / moodTrend.length) * 10) / 10
    : null;

  const emotionCounts: Record<string, number> = {};
  (diaryEntries ?? []).forEach((e: any) => {
    (e.emotions ?? []).forEach((em: string) => {
      emotionCounts[em] = (emotionCounts[em] ?? 0) + 1;
    });
  });
  const topEmociones = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([e]) => e);

  if (!diaryEntries || diaryEntries.length === 0) {
    return NextResponse.json({ moodTrend: [], topEmociones: [], avgMood: null, noData: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ moodTrend, topEmociones, avgMood, noData: false });
  }

  const diarioTexto = (diaryEntries as any[]).map(e =>
    `${e.date}: Estado ${e.mood}/10 (${moodLabels[e.mood] ?? ""}) | Emociones: ${(e.emotions ?? []).join(", ") || "ninguna"}${e.note ? ` | Nota: "${e.note}"` : ""}`
  ).join("\n");

  const notasTexto = (recentNotes as any[] ?? []).map(n =>
    `${n.session_date}: ${n.content.substring(0, 250)}`
  ).join("\n");

  const prompt = `Eres un asistente clínico para profesionales de salud mental en Argentina. Analizá el diario emocional de ${patientName} de la última semana y generá un resumen para que el profesional llegue preparado a la sesión.

DIARIO EMOCIONAL (últimos 7 días):
${diarioTexto}
${notasTexto ? `\nCONTEXTO DE SESIONES ANTERIORES:\n${notasTexto}` : ""}

Respondé SOLO con un JSON válido, sin texto adicional, con este formato:
{
  "tendencia": "positiva|negativa|estable|mixta",
  "resumen": "2-3 oraciones sobre el estado emocional de la semana",
  "puntosClave": ["máximo 3 puntos concretos a tener en cuenta"],
  "sugerencias": ["máximo 2 sugerencias para trabajar en la sesión"]
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error("API error");

    const aiData = await res.json();
    const text = aiData.content?.[0]?.text?.trim() ?? "{}";
    // Strip markdown code blocks if present
    const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ moodTrend, topEmociones, avgMood, noData: false, ...parsed });
  } catch {
    return NextResponse.json({ moodTrend, topEmociones, avgMood, noData: false });
  }
}
