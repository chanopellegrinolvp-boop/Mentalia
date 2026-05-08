import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const professionalId = searchParams.get("professional_id");
  if (!professionalId) return NextResponse.json([]);

  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, reviewer:patient_id(full_name)")
    .eq("professional_id", professionalId)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { professional_id, rating, comment } = body;

  if (!professional_id || !rating || Number(rating) < 1 || Number(rating) > 5) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").upsert({
    professional_id,
    patient_id: user.id,
    rating: Number(rating),
    comment: comment ?? null,
  }, { onConflict: "professional_id,patient_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
