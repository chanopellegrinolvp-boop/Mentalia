const FROM = process.env.EMAIL_FROM ?? "Mentalia <onboarding@resend.dev>";

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[Resend] RESEND_API_KEY no configurado"); return; }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) console.error("[Resend] Error:", await res.text());
}

function base(content: string) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mentalia</title></head>
<body style="margin:0;padding:0;background:#f0f7f2;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#2D6A4F,#52B788);padding:32px 40px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:28px;font-weight:bold;font-style:italic;">Mentalia</h1>
    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Salud mental, organizada.</p>
  </div>
  <div style="padding:36px 40px;">${content}</div>
  <div style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">mentalia.com.ar · Buenos Aires, Argentina</p>
  </div>
</div>
</body></html>`;
}

function btn(text: string, url: string) {
  return `<div style="text-align:center;margin:28px 0;">
    <a href="${url}" style="background:#2D6A4F;color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;display:inline-block;">${text}</a>
  </div>`;
}

export async function emailBienvenida(to: string, nombre: string, rol: "professional" | "patient") {
  const esPro = rol === "professional";
  const subject = `¡Bienvenido a Mentalia, ${nombre.split(" ")[0]}!`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">¡Hola, ${nombre.split(" ")[0]}! 👋</h2>
    <p style="color:#374151;line-height:1.7;">Tu cuenta de Mentalia está lista. ${esPro
      ? "Completá tu perfil para que los pacientes puedan encontrarte en el directorio."
      : "Ahora podés buscar el profesional ideal y reservar tu primera sesión."
    }</p>
    ${esPro
      ? btn("Completar mi perfil →", `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentalia-app.vercel.app"}/dashboard/profesional/perfil`)
      : btn("Buscar profesionales →", `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentalia-app.vercel.app"}/buscar`)
    }
    <p style="color:#6B7280;font-size:13px;">Tenés 10 días de prueba gratis. Sin tarjeta de crédito.</p>
  `);
  await send(to, subject, html);
}

export async function emailTurnoConfirmado(opts: {
  to: string;
  pacienteName: string;
  profesionalName: string;
  fecha: string;
  hora: string;
  modalidad: string;
  meetUrl?: string;
}) {
  const subject = `Turno confirmado con ${opts.profesionalName}`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">¡Turno confirmado! ✅</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${opts.pacienteName}</strong>, tu sesión quedó agendada.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Profesional:</strong> ${opts.profesionalName}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Fecha:</strong> ${opts.fecha}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Hora:</strong> ${opts.hora}</p>
      <p style="margin:0;color:#374151;"><strong>Modalidad:</strong> ${opts.modalidad}</p>
    </div>
    ${opts.meetUrl ? btn("Unirme a la videollamada →", opts.meetUrl) : ""}
    <p style="color:#6B7280;font-size:13px;">Si necesitás cancelar o reprogramar, hacelo con al menos 24hs de anticipación.</p>
  `);
  await send(opts.to, subject, html);
}

export async function emailPagoConfirmado(opts: {
  to: string;
  nombre: string;
  profesionalName: string;
  monto: number;
  paymentId: string;
}) {
  const subject = "Pago confirmado — Mentalia";
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Pago recibido ✅</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${opts.nombre}</strong>, confirmamos el pago de tu sesión.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Profesional:</strong> ${opts.profesionalName}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Monto:</strong> $${opts.monto.toLocaleString("es-AR")} ARS</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">N° de pago: ${opts.paymentId}</p>
    </div>
    ${btn("Ver mis pagos →", `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentalia-app.vercel.app"}/dashboard/paciente/pagos`)}
  `);
  await send(opts.to, subject, html);
}

export async function emailNuevoTurnoProfesional(opts: {
  to: string;
  profesionalName: string;
  pacienteName: string;
  patieneEmail: string;
  fecha: string;
  hora: string;
}) {
  const subject = `Nuevo turno reservado — ${opts.pacienteName}`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Tenés un nuevo turno 📅</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${opts.profesionalName}</strong>, un paciente acaba de reservar una sesión.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Paciente:</strong> ${opts.pacienteName}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Email:</strong> ${opts.patieneEmail}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Fecha:</strong> ${opts.fecha}</p>
      <p style="margin:0;color:#374151;"><strong>Hora:</strong> ${opts.hora}</p>
    </div>
    ${btn("Ver mi agenda →", `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentalia-app.vercel.app"}/dashboard/profesional/agenda`)}
  `);
  await send(opts.to, subject, html);
}
