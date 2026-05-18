import { NextRequest, NextResponse } from "next/server";

const FROM = process.env.EMAIL_FROM ?? "Mentalia <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mentaliasalud.online";

export async function POST(req: NextRequest) {
  const { paciente_email, paciente_nombre, profesional_nombre, fecha, hora } = await req.json();
  if (!paciente_email) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: true });

  const primerNombre = (paciente_nombre as string)?.split(" ")[0] ?? "Paciente";

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mentalia</title></head>
<body style="margin:0;padding:0;background:#f0f7f2;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#40916C,#52B788);padding:32px 40px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:28px;font-weight:bold;font-style:italic;">Mentalia</h1>
    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Salud mental, organizada.</p>
  </div>
  <div style="padding:36px 40px;">
    <h2 style="color:#111827;margin-top:0;">Sesión cancelada</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${primerNombre}</strong>, lamentamos informarte que tu sesión fue cancelada.</p>
    <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #D1D5DB;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Profesional:</strong> ${profesional_nombre}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Fecha:</strong> ${fecha}</p>
      <p style="margin:0;color:#374151;"><strong>Hora:</strong> ${hora}</p>
    </div>
    <p style="color:#374151;line-height:1.7;">Podés reagendar o comunicarte directamente con el profesional desde tu panel.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${SITE_URL}/dashboard/paciente/sesiones" style="background:#40916C;color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;display:inline-block;">Ver mis sesiones →</a>
    </div>
    <p style="color:#9CA3AF;font-size:13px;margin-top:28px;padding-top:16px;border-top:1px solid #f3f4f6;">El equipo de Mentalia</p>
  </div>
  <div style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">mentaliasalud.online · Buenos Aires, Argentina</p>
  </div>
</div>
</body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: paciente_email, subject: "Tu sesión fue cancelada", html }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
