import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { notas } = await req.json();
  if (!notas?.length) return NextResponse.json({ error: "Sin notas" }, { status: 400 });

  const notasTexto = notas
    .map((n: { content: string; created_at: string }, i: number) =>
      `Sesion ${i + 1} (${new Date(n.created_at).toLocaleDateString("es-AR")}): ${n.content}`)
    .join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres un asistente clinico especializado en psicologia. Responde en espanol de forma profesional y concisa." },
        { role: "user", content: `Genera un resumen general del proceso terapeutico. Incluye: progreso general, temas recurrentes, observaciones importantes.\n\n${notasTexto}` },
      ],
      max_tokens: 600,
      temperature: 0.3,
    });
    return NextResponse.json({ resumen: completion.choices[0].message.content ?? "" });
  } catch (err) {
    console.error("[IA/resumen]", err);
    return NextResponse.json({ error: "Error al generar resumen" }, { status: 500 });
  }
}
