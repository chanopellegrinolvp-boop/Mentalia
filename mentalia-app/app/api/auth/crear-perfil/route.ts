import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId, email, fullName, role, matricula } = await req.json();

  if (!userId || !email || !role) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName,
    role,
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

  return NextResponse.json({ ok: true });
}
