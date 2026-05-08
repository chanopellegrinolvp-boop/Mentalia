import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { emailBienvenida } from "@/lib/resend";

function traducirError(msg: string): string {
  if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("User already registered"))
    return "Ya existe una cuenta con ese email.";
  if (msg.includes("Password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (msg.includes("Unable to validate email") || msg.includes("invalid format") || msg.includes("invalid email"))
    return "El formato del email no es válido.";
  if (msg.includes("Email not confirmed"))
    return "El email no fue confirmado. Revisá tu bandeja de entrada.";
  if (msg.includes("Invalid login credentials") || msg.includes("Invalid email or password"))
    return "Email o contraseña incorrectos.";
  if (msg.includes("Email rate limit exceeded") || msg.includes("rate limit"))
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo.";
  if (msg.includes("Signup is disabled"))
    return "El registro está deshabilitado temporalmente.";
  if (msg.includes("weak password") || msg.includes("Password is too weak"))
    return "La contraseña es demasiado débil. Usá al menos 6 caracteres.";
  return "Ocurrió un error inesperado. Intentá de nuevo.";
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  const { name, email, password, role, refCode } = await request.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // Crear usuario ya confirmado con admin API
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role },
  });

  if (error) {
    const msg = traducirError(error.message);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Si es profesional, crear fila en professionals
  if (role === "professional" && data.user) {
    await supabaseAdmin.from("professionals").insert({ id: data.user.id }).select();
  }

  // Si hay código de referido, registrar el referral
  if (refCode && data.user) {
    const { data: referrer } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("referral_code", refCode.toLowerCase())
      .single();
    if (referrer) {
      await supabaseAdmin.from("referrals").insert({
        referrer_id: referrer.id,
        referred_id: data.user.id,
      });
    }
  }

  // Email de bienvenida (no bloqueante)
  emailBienvenida(email, name, role).catch(console.error);

  return NextResponse.json({ success: true });
}
