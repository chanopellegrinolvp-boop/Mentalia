import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { notas, patientId } = await req.json();

  // Fecha de hace 7 días en timezone ARS (America/Argentina/Buenos_Aires)
  const hace7diasStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });

  // Consultar diario emocional del paciente (solo pacientes online con patient_id)
  let diarioEntries: { date: string; mood: number; emotions: string[] | null }[] = [];
  if (patientId) {
    const { data } = await supabaseAdmin
      .from("emotional_diary")
      .select("date, mood, emotions")
      .eq("patient_id", patientId)
      .gte("date", hace7diasStr)
      .order("date", { ascending: true });
    diarioEntries = (data ?? []) as typeof diarioEntries;
  }

  // Sin datos de diario esta semana
  if (diarioEntries.length === 0) {
    return NextResponse.json({ noData: true, moodTrend: [], topEmociones: [], avgMood: null });
  }

  // Calcular moodTrend y avgMood
  const moodTrend = diarioEntries.map((e) => e.mood);
  const avgMood =
    Math.round((moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length) * 10) / 10;

  // Top 3 emociones más frecuentes
  const emocionCount: Record<string, number> = {};
  diarioEntries.forEach((e) => {
    (e.emotions ?? []).forEach((emo) => {
      emocionCount[emo] = (emocionCount[emo] ?? 0) + 1;
    });
  });
  const topEmociones = Object.entries(emocionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emo]) => emo);

  // Calcular tendencia a partir de los números (primera mitad vs segunda mitad)
  let tendencia: "positiva" | "negativa" | "estable" | "mixta" = "estable";
  if (moodTrend.length >= 2) {
    const mid = Math.floor(moodTrend.length / 2);
    const firstHalf = moodTrend.slice(0, mid);
    const secondHalf = moodTrend.slice(mid);
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const diff = avgSecond - avgFirst;
    const maxMood = Math.max(...moodTrend);
    const minMood = Math.min(...moodTrend);
    if (diff > 0.5) tendencia = "positiva";
    else if (diff < -0.5) tendencia = "negativa";
    else if (maxMood - minMood >= 3) tendencia = "mixta";
    else tendencia = "estable";
  }

  // Construir contexto para la IA
  const diarioTexto = diarioEntries
    .map((e) =>
      `${e.date}: estado ${e.mood}/10${(e.emotions ?? []).length > 0 ? `, emociones: ${e.emotions!.join(", ")}` : ""}`
    )
    .join("\n");

  const notasRecientes = (notas ?? []).filter(
    (n: { created_at: string }) => new Date(n.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const notasTexto = notasRecientes.length > 0
    ? notasRecientes
        .map((n: { content: string; created_at: string }) =>
          `Sesión (${new Date(n.created_at).toLocaleDateString("es-AR")}): ${n.content}`)
        .join("\n\n")
    : null;

  // Generar resumen narrativo con IA
  let resumen = "";
  let puntosClave: string[] | undefined;
  let sugerencias: string[] | undefined;

  try {
    const userPrompt = [
      `Analiza el estado emocional del paciente en los últimos 7 días.`,
      `\nDIARIO EMOCIONAL:\n${diarioTexto}`,
      notasTexto ? `\nNOTAS DE SESIÓN:\n${notasTexto}` : "",
      `\nRetorna SOLO este JSON:\n{"resumen":"párrafo de 2-3 oraciones en tercera persona sobre el estado general","puntosClave":["punto 1","punto 2"],"sugerencias":["sugerencia 1","sugerencia 2"]}`,
    ].join("");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Eres un asistente clinico. Responde SOLO con JSON valido, sin texto adicional." },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(completion.choices[0].message.content ?? "{}");
    } catch {
      parsed = {};
    }

    resumen = typeof parsed.resumen === "string" ? parsed.resumen : "";
    puntosClave = Array.isArray(parsed.puntosClave) ? (parsed.puntosClave as string[]) : undefined;
    sugerencias = Array.isArray(parsed.sugerencias) ? (parsed.sugerencias as string[]) : undefined;
  } catch (err) {
    console.error("[IA/resumen-semanal]", err);
    // Fallback: resumen básico sin IA
    resumen = `Esta semana el paciente registró ${diarioEntries.length} entrada${diarioEntries.length !== 1 ? "s" : ""} en el diario emocional con un estado promedio de ${avgMood}/10.${topEmociones.length > 0 ? ` Las emociones más frecuentes fueron: ${topEmociones.join(", ")}.` : ""}`;
  }

  return NextResponse.json({
    moodTrend,
    topEmociones,
    avgMood,
    tendencia,
    resumen,
    puntosClave,
    sugerencias,
    noData: false,
  });
}
