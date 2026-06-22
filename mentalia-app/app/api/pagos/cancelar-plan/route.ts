import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "professional") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ plan: null, subscription_status: "cancelled" })
    .eq("id", user.id);

  if (error) {
    console.error("Error cancelando plan:", error);
    return NextResponse.json({ error: "Error al cancelar el plan" }, { status: 500 });
  }

  await supabase
    .from("professionals")
    .update({ plan: null })
    .eq("id", user.id);

  return NextResponse.json({ mensaje: "Plan cancelado" });
}
