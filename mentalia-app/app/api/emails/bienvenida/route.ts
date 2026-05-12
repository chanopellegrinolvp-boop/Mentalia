import { NextRequest, NextResponse } from "next/server";
import { emailBienvenida } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rol } = await req.json();
    if (!email || !nombre) return NextResponse.json({ ok: false });

    console.log(`[EMAIL] bienvenida enviado a ${email} - ${new Date().toISOString()}`);
    await emailBienvenida(email, nombre, rol ?? "professional");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
