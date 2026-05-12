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

function sig() {
  return `<p style="color:#9CA3AF;font-size:13px;margin-top:28px;padding-top:16px;border-top:1px solid #f3f4f6;">El equipo de Mentalia</p>`;
}

export async function emailBienvenida(to: string, nombre: string, rol: "professional" | "patient") {
  const esPro = rol === "professional";
  const primerNombre = nombre.split(" ")[0];
  const subject = `Bienvenido a Mentalia, ${primerNombre}`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Hola, ${primerNombre}</h2>
    <p style="color:#374151;line-height:1.7;">
      Tu cuenta de Mentalia está lista.
      ${esPro
        ? "Completá tu perfil profesional para que tus pacientes puedan encontrarte y empezá a gestionar tu consultorio digital."
        : "Ya podés conectarte con tu profesional y llevar un seguimiento de tu bienestar emocional."
      }
    </p>
    ${esPro
      ? btn("Completar mi perfil →", `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profesional/perfil`)
      : btn("Ver mi dashboard →", `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/paciente`)
    }
    <p style="color:#6B7280;font-size:13px;">Tenés 10 días de prueba gratis. Sin tarjeta de crédito.</p>
    ${sig()}
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
  const primerNombre = opts.pacienteName.split(" ")[0];
  const subject = `Tu sesión con ${opts.profesionalName} está confirmada`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Sesión confirmada</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${primerNombre}</strong>, tu sesión quedó agendada.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Profesional:</strong> ${opts.profesionalName}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Fecha:</strong> ${opts.fecha}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Hora:</strong> ${opts.hora}</p>
      <p style="margin:0;color:#374151;"><strong>Modalidad:</strong> ${opts.modalidad}</p>
    </div>
    ${opts.meetUrl
      ? btn("Unirme a la videollamada →", opts.meetUrl)
      : btn("Ver mis sesiones →", `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/paciente/sesiones`)
    }
    <p style="color:#6B7280;font-size:13px;">Si necesitás cancelar o reprogramar, hacelo con al menos 24 horas de anticipación.</p>
    ${sig()}
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
  const primerNombre = opts.nombre.split(" ")[0];
  const subject = "Tu suscripción a Mentalia está activa";
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Pago confirmado</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${primerNombre}</strong>, recibimos tu pago. Tu plan ya está activo.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Monto:</strong> $${opts.monto.toLocaleString("es-AR")} ARS</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">N° de pago: ${opts.paymentId}</p>
    </div>
    ${btn("Ir a mi dashboard →", `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profesional`)}
    <p style="color:#6B7280;font-size:13px;">Ante cualquier consulta sobre tu facturación, respondé este email.</p>
    ${sig()}
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
  const primerNombre = opts.profesionalName.split(" ")[0];
  const subject = `Nueva sesión programada — ${opts.pacienteName}`;
  const html = base(`
    <h2 style="color:#111827;margin-top:0;">Nueva sesión en tu agenda</h2>
    <p style="color:#374151;line-height:1.7;">Hola <strong>${primerNombre}</strong>, se programó una nueva sesión.</p>
    <div style="background:#f0faf3;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #2D6A4F;">
      <p style="margin:0 0 8px;color:#374151;"><strong>Paciente:</strong> ${opts.pacienteName}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Email:</strong> ${opts.patieneEmail}</p>
      <p style="margin:0 0 8px;color:#374151;"><strong>Fecha:</strong> ${opts.fecha}</p>
      <p style="margin:0;color:#374151;"><strong>Hora:</strong> ${opts.hora}</p>
    </div>
    ${btn("Ver mi agenda →", `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/profesional/agenda`)}
    ${sig()}
  `);
  await send(opts.to, subject, html);
}
