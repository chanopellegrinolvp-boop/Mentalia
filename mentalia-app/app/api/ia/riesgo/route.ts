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

  const notasTexto = notas.slice(-5)
    .map((n: { content: string }, i: number) => `Sesion reciente ${i + 1}: ${n.content}`)
    .join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres un asistente clinico. Responde SOLO con JSON valido, sin texto adicional." },
        { role: "user", content: `Evalua el nivel de riesgo del paciente. Responde con este JSON: {"nivel":"bajo","indicadores":["..."],"recomendaciones":["..."]}\n\n${notasTexto}` },
      ],
      max_tokens: 400,
      temperature: 0.2,
    });
    const raw = completion.choices[0].message.content ?? "{}";
    const data = JSON.parse(raw.replace(/` + "```json|```" + `/g, "").trim());
    return NextResponse.json(data);
  } catch (err) {
    console.error("[IA/riesgo]", err);
    return NextResponse.json({ error: "Error al evaluar riesgo" }, { status: 500 });
  }
}
