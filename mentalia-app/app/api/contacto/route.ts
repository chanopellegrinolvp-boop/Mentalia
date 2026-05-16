import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nombre, email, asunto, mensaje } = await req.json();

  if (!nombre?.trim() || !email?.trim() || !asunto?.trim() || !mensaje?.trim()) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Mentalia <hola@mentaliasalud.online>";

  if (!key) return NextResponse.json({ ok: true });

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FDFCFA;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#2D6A4F;padding:28px 40px;">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:28px;color:white;">Mentalia</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 20px;font-size:20px;color:#111827;">Nueva consulta de contacto</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf5;border-radius:10px;padding:20px;margin-bottom:24px;">
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;"><strong style="color:#2D6A4F;">Nombre:</strong> ${nombre}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;"><strong style="color:#2D6A4F;">Email:</strong> ${email}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;"><strong style="color:#2D6A4F;">Asunto:</strong> ${asunto}</td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#2D6A4F;text-transform:uppercase;letter-spacing:0.05em;">Mensaje</p>
            <div style="background:#f9fafb;border-left:3px solid #2D6A4F;padding:16px 20px;border-radius:0 8px 8px 0;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${mensaje}</p>
            </div>
            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">Podés responder directamente a este email para contactar a ${nombre}.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© 2025 Mentalia · mentaliasalud.online</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: "hola@mentaliasalud.online",
      reply_to: email,
      subject: `[Contacto Mentalia] ${asunto} — ${nombre}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[Contacto] Error Resend:", await res.text());
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
