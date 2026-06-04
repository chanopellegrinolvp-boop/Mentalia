import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId, email, fullName, role, matricula } = await req.json();

  if (!userId || !email || !role) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Verificar que el userId existe en auth y fue creado hace menos de 5 minutos
  const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (!authData?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (new Date(authData.user.created_at) < fiveMinutesAgo) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Preservar referral_code existente si el usuario ya tiene uno
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  const referralCode = existing?.referral_code ?? generateReferralCode();

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName,
    role,
    referral_code: referralCode,
  });

  if (profileError) {
    console.error("[crear-perfil] Error profiles:", profileError.message);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (role === "professional") {
    const { error: profError } = await supabaseAdmin.from("professionals").upsert({
      id: userId,
      license_number: matricula || null,
    });
    if (profError) {
      console.error("[crear-perfil] Error professionals:", profError.message);
    }
  }

  // Auto-confirmar email para que el usuario pueda iniciar sesión inmediatamente
  await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });

  return NextResponse.json({ ok: true });
}
