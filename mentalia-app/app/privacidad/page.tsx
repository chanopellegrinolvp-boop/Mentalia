import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad — Mentalia",
  description: "Cómo Mentalia recolecta, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50" style={{ background: "#40916C" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold italic text-white" style={{ fontFamily: "Georgia, serif" }}>
            Mentalia
          </Link>
          <Link href="/login" className="text-xs font-medium text-green-100/80 hover:text-white transition">
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#40916C" }}>Legal</p>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#40916C" }}>
            Política de Privacidad
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Vigente desde mayo de 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#374151" }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>1. Responsable del tratamiento de datos</h2>
            <p>El responsable del tratamiento de los datos personales recolectados a través de esta plataforma es:</p>
            <ul className="mt-3 space-y-1 pl-4">
              <li><strong>Nombre:</strong> Mentalia</li>
              <li><strong>Email de contacto:</strong> <Link href="/contacto" className="underline" style={{ color: "#40916C" }}>privacidad@mentaliasalud.online</Link></li>
              <li><strong>País:</strong> República Argentina</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>2. Qué datos recolectamos</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">Datos de registro</p>
                <p style={{ color: "#6B7280" }}>Nombre completo, dirección de email y contraseña (almacenada de forma encriptada mediante bcrypt; nunca en texto plano).</p>
              </div>
              <div>
                <p className="font-medium mb-1">Datos profesionales</p>
                <p style={{ color: "#6B7280" }}>Número de matrícula, especialidad, provincia, ciudad, años de experiencia, modalidad de atención y precio de sesión. Estos datos son opcionales y se utilizan para el directorio de profesionales.</p>
              </div>
              <div>
                <p className="font-medium mb-1">Datos clínicos</p>
                <p style={{ color: "#6B7280" }}>Notas de sesión y resúmenes clínicos generados por el profesional. Estos datos son estrictamente confidenciales y solo accesibles por el profesional titular de la cuenta. No son visibles para Mentalia ni para terceros.</p>
              </div>
              <div>
                <p className="font-medium mb-1">Datos del paciente</p>
                <p style={{ color: "#6B7280" }}>Entradas del diario emocional, registros de estado de ánimo e historial de sesiones. Son accesibles únicamente por el paciente titular y, en forma agregada y anonimizada, por el profesional tratante.</p>
              </div>
              <div>
                <p className="font-medium mb-1">Datos de uso</p>
                <p style={{ color: "#6B7280" }}>Fecha y hora de acceso, tipo de dispositivo y dirección IP. Se utilizan exclusivamente para fines de seguridad y prevención de accesos no autorizados.</p>
              </div>
              <div>
                <p className="font-medium mb-1">Datos de pago</p>
                <p style={{ color: "#6B7280" }}>El procesamiento de pagos es realizado íntegramente por MercadoPago. Mentalia no almacena números de tarjeta, CVV ni datos bancarios. Solo registramos el ID de transacción, el monto y el estado del pago.</p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>3. Para qué usamos los datos</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Prestar el servicio de gestión de consultorio digital.</li>
              <li>Enviar emails transaccionales: confirmación de registro, recordatorios de turno, confirmación de pago y notificaciones de nuevas sesiones.</li>
              <li>Generar resúmenes clínicos asistidos (ver sección 4 sobre OpenAI).</li>
              <li>Detectar y prevenir fraudes o accesos no autorizados.</li>
              <li>Mejorar la plataforma en base a métricas de uso agregadas y anonimizadas.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>4. Con quién compartimos los datos</h2>
            <div className="space-y-3" style={{ color: "#6B7280" }}>
              <p><strong className="text-gray-800">Supabase:</strong> proveedor de base de datos y autenticación. Los datos se almacenan en servidores de AWS región us-east-1. Supabase actúa como encargado del tratamiento bajo contrato de confidencialidad.</p>
              <p><strong className="text-gray-800">OpenAI:</strong> únicamente el texto de las notas clínicas es enviado a la API de OpenAI para generar el resumen post-sesión. No se envían datos identificatorios del paciente (nombre, email, DNI). El profesional puede optar por no usar esta funcionalidad.</p>
              <p><strong className="text-gray-800">MercadoPago:</strong> datos necesarios para procesar el pago de la suscripción (email, monto). MercadoPago opera bajo su propia política de privacidad.</p>
              <p><strong className="text-gray-800">Resend:</strong> proveedor de envío de emails transaccionales. Solo recibe el email del destinatario y el contenido del mensaje.</p>
              <p className="font-medium text-gray-800">Mentalia no vende, alquila ni cede datos personales a terceros bajo ninguna circunstancia.</p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>5. Por cuánto tiempo guardamos los datos</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Los datos se conservan mientras la cuenta esté activa.</li>
              <li>Al solicitar la eliminación de la cuenta, los datos personales se eliminan en un plazo máximo de 30 días hábiles.</li>
              <li>Los datos de facturación pueden conservarse por hasta 5 años por obligaciones legales impositivas.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>6. Tus derechos — Ley 25.326 (Argentina)</h2>
            <p style={{ color: "#6B7280" }}>En cumplimiento de la Ley N° 25.326 de Protección de Datos Personales, tenés derecho a:</p>
            <ul className="mt-3 space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li><strong className="text-gray-700">Acceso:</strong> solicitar qué datos tenemos sobre vos.</li>
              <li><strong className="text-gray-700">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong className="text-gray-700">Supresión:</strong> solicitar la eliminación de tus datos ("derecho al olvido").</li>
              <li><strong className="text-gray-700">Oposición:</strong> oponerte al tratamiento de tus datos con fines específicos.</li>
            </ul>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              Para ejercer cualquiera de estos derechos, escribí a{" "}
              <Link href="/contacto" className="underline" style={{ color: "#40916C" }}>privacidad@mentaliasalud.online</Link>.
              Respondemos en un plazo máximo de 10 días hábiles.
            </p>
            <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
              La Dirección Nacional de Protección de Datos Personales (DNPDP) es el organismo de control competente:{" "}
              <a href="https://www.argentina.gob.ar/aaip/datospersonales" target="_blank" rel="noopener noreferrer" className="underline">www.argentina.gob.ar/aaip/datospersonales</a>
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>7. Seguridad</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Toda la comunicación entre tu dispositivo y nuestros servidores está encriptada mediante HTTPS/TLS.</li>
              <li>La autenticación está gestionada por Supabase Auth, que implementa estándares de seguridad modernos (JWT, hashing de contraseñas con bcrypt).</li>
              <li>El acceso a los datos clínicos está restringido por políticas de Row Level Security (RLS) a nivel de base de datos: cada usuario solo puede acceder a sus propios datos.</li>
              <li>Realizamos revisiones periódicas de accesos y monitoreo de actividad inusual.</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>8. Cambios a esta política</h2>
            <p style={{ color: "#6B7280" }}>
              Podemos actualizar esta política de privacidad periódicamente. Cuando lo hagamos, te notificaremos por email con al menos 15 días de anticipación. La fecha de vigencia en la parte superior de este documento siempre reflejará la versión actual.
            </p>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 mt-16" style={{ borderColor: "rgba(45,106,79,0.15)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-base font-bold italic" style={{ fontFamily: "Georgia, serif", color: "#40916C" }}>Mentalia</span>
          <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} Mentalia · Plataforma de salud mental · Argentina
          </p>
          <div className="flex gap-5 text-xs" style={{ color: "#9CA3AF" }}>
            <Link href="/privacidad" className="hover:text-[#40916C] transition font-medium" style={{ color: "#40916C" }}>Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#40916C] transition">Términos</Link>
            <Link href="/login" className="hover:text-[#40916C] transition">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
