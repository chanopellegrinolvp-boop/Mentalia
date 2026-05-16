import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { notas } = await req.json();
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  const recientes = (notas ?? []).filter((n: { created_at: string }) => new Date(n.created_at) >= hace7dias);

  if (!recientes.length) return NextResponse.json({ resumen: "No hay sesiones en los ultimos 7 dias." });

  const notasTexto = recientes
    .map((n: { content: string; created_at: string }) =>
      `Sesion (${new Date(n.created_at).toLocaleDateString("es-AR")}): ${n.content}`)
    .join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres un asistente clinico. Responde en espanol de forma concisa y profesional." },
        { role: "user", content: `Genera un resumen semanal. Incluye: estado general, avances, pendientes para proxima sesion.\n\n${notasTexto}` },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });
    return NextResponse.json({ resumen: completion.choices[0].message.content ?? "" });
  } catch (err) {
    console.error("[IA/resumen-semanal]", err);
    return NextResponse.json({ error: "Error al generar resumen semanal" }, { status: 500 });
  }
}
