import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { sesionId } = await req.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { error } = await supabase
    .from("appointments")
    .update({ ended_at: new Date().toISOString(), status: "completed" })
    .eq("id", sesionId)
    .eq("professional_id", user.id);

  if (error) {
    console.error("[sesion/finalizar] Error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
