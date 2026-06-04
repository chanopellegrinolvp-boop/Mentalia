import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { sesionId } = await req.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  await supabase
    .from("appointments")
    .update({ ended_at: new Date().toISOString(), status: "completed" })
    .eq("id", sesionId)
    .eq("professional_id", user.id);

  return NextResponse.json({ ok: true });
}
