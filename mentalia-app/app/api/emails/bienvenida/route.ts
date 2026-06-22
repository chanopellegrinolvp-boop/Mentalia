import { NextRequest, NextResponse } from "next/server";
import { emailBienvenida } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Fix 11: verificar sesión activa para evitar spam abuse
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { email, nombre, rol } = await req.json();
    if (!email || !nombre) return NextResponse.json({ ok: false });

    await emailBienvenida(email, nombre, rol ?? "professional");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Email] Error enviando bienvenida:", e);
    return NextResponse.json({ ok: false });
  }
}
