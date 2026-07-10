import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { professionalId, action } = await req.json();
  const nuevo = action === "aprobar" ? "verificado" : action === "rechazar" ? "rechazado" : null;
  if (!professionalId || !nuevo) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("professionals")
    .update({ verification_status: nuevo })
    .eq("id", professionalId);
  if (error) {
    console.error("[admin/verificar]", error.message);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, verification_status: nuevo });
}
