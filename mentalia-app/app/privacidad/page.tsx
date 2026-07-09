import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad — Mentalia",
  description: "Cómo Mentalia recolecta, usa y protege tus datos personales. Cumplimiento Ley 25.326.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>

      <header className="sticky top-0 z-50" style={{ background: "#2D6A4F" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold italic text-white" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Mentalia
          </Link>
          <Link href="/login" className="text-xs font-medium text-green-100/80 hover:text-white transition">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#40916C" }}>Legal</p>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2D6A4F" }}>
            Política de Privacidad
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Vigente desde junio de 2026 · Última actualización: julio de 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#374151" }}>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>1. Responsable del tratamiento de datos</h2>
            <p>El responsable del tratamiento de los datos personales recolectados a través de esta plataforma es:</p>
            <ul className="mt-3 space-y-1 pl-4" style={{ color: "#6B7280" }}>
              <li><strong className="text-gray-800">Nombre:</strong> Mentalia</li>
              <li><strong className="text-gray-800">Plataforma:</strong> mentaliasalud.online</li>
              <li><strong className="text-gray-800">Email de contacto:</strong> <a href="mailto:hola@mentaliasalud.online" className="underline" style={{ color: "#40916C" }}>hola@mentaliasalud.online</a></li>
              <li><strong className="text-gray-800">País:</strong> República Argentina</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>2. Qué datos recopilamos</h2>
            <div className="space-y-5" style={{ color: "#6B7280" }}>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.1 Datos de registro</p>
                <p>Nombre completo, dirección de email y contraseña (almacenada encriptada mediante bcrypt; nunca en texto plano).</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.2 Datos de perfil</p>
                <p>DNI, fecha de nacimiento, teléfono y foto de perfil (opcionales). Para profesionales: número de matrícula, especialidad, provincia, ciudad, años de experiencia, modalidad de atención y precio de sesión.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.3 Datos de salud (datos sensibles)</p>
                <p>En el marco de lo establecido por el artículo 7 de la Ley N° 25.326, los siguientes datos son considerados <strong>datos sensibles</strong> y reciben protección reforzada:</p>
                <ul className="mt-2 pl-4 list-disc space-y-1">
                  <li>Notas clínicas y resúmenes de sesión registrados por el profesional.</li>
                  <li>Entradas del diario emocional del paciente (estado de ánimo, emociones, notas libres).</li>
                  <li>Historial de sesiones y evolución clínica.</li>
                  <li>Nivel de riesgo evaluado en cada sesión.</li>
                </ul>
                <p className="mt-2">Estos datos solo son accesibles por el profesional titular de la cuenta y/o el paciente al que pertenecen. Mentalia no accede ni procesa este contenido salvo para la generación automatizada de resúmenes clínicos (ver sección 4.2 sobre OpenAI).</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.4 Datos de pago</p>
                <p>El procesamiento de pagos es realizado íntegramente por MercadoPago. Mentalia no almacena números de tarjeta, CVV ni datos bancarios. Únicamente registramos el ID de transacción de MercadoPago, el monto, el plan contratado y el estado del pago.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.5 Datos de uso técnico</p>
                <p>Fecha y hora de acceso, tipo de dispositivo, sistema operativo y dirección IP. Se utilizan exclusivamente para seguridad, prevención de fraude y análisis agregado de uso de la plataforma.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.6 Datos de mensajería</p>
                <p>Mensajes intercambiados entre profesional y paciente dentro de la plataforma. Solo accesibles por los participantes de la conversación.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">2.7 Base legal del tratamiento</p>
                <p>El tratamiento de tus datos se basa en tu <strong>consentimiento libre, expreso e informado</strong> (art. 5 de la Ley N° 25.326), que prestás al registrarte marcando la casilla específica. Para los <strong>datos de salud (datos sensibles)</strong> rige, además, el consentimiento expreso del art. 7. Registramos la fecha y la versión del texto de consentimiento que aceptaste. Podés retirar tu consentimiento en cualquier momento escribiendo a <a href="mailto:hola@mentaliasalud.online" className="underline" style={{ color: "#40916C" }}>hola@mentaliasalud.online</a>, sin que ello afecte la licitud del tratamiento previo.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>3. Para qué usamos los datos</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Prestar el servicio de gestión de consultorio digital (agenda, historia clínica, videollamadas, mensajería).</li>
              <li>Enviar emails transaccionales: confirmación de registro, bienvenida, recordatorios de turno (24 horas antes), confirmación de pago y notificaciones de nuevas sesiones.</li>
              <li>Generar resúmenes clínicos post-sesión asistidos por inteligencia artificial (cuando el profesional lo activa).</li>
              <li>Procesar y confirmar pagos de suscripción.</li>
              <li>Detectar y prevenir fraudes, accesos no autorizados y usos abusivos.</li>
              <li>Mejorar la plataforma en base a métricas de uso agregadas y anonimizadas.</li>
              <li>Cumplir con obligaciones legales vigentes en la República Argentina.</li>
            </ul>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              <strong className="text-gray-800">No utilizamos los datos para publicidad.</strong> Mentalia no vende, alquila ni cede datos personales a terceros bajo ninguna circunstancia con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>4. Proveedores de servicios (encargados del tratamiento)</h2>
            <p className="mb-4" style={{ color: "#6B7280" }}>Trabajamos con los siguientes proveedores, todos bajo acuerdos de confidencialidad y tratamiento de datos:</p>
            <div className="space-y-4" style={{ color: "#6B7280" }}>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.1 Supabase (Supabase Inc.)</p>
                <p className="mt-1">Proveedor de base de datos (PostgreSQL), autenticación y almacenamiento. Los datos se almacenan en servidores de AWS región us-east-1 (Virginia, EE.UU.). Supabase implementa cifrado en reposo y en tránsito. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de Supabase</a>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.2 OpenAI (OpenAI, L.L.C.)</p>
                <p className="mt-1">Únicamente el texto de las notas clínicas es enviado a la API de OpenAI para generar el resumen post-sesión. <strong>No se envían datos identificatorios del paciente</strong> (nombre, email, DNI, teléfono). El profesional puede optar por no usar esta funcionalidad. OpenAI no entrena sus modelos con datos enviados a través de la API. <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de OpenAI</a>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.3 MercadoPago (Mercado Libre S.R.L.)</p>
                <p className="mt-1">Procesamos pagos de suscripción a través de MercadoPago. Los datos financieros (número de tarjeta, CVV, datos bancarios) son gestionados exclusivamente por MercadoPago bajo su propia política de seguridad PCI DSS. Mentalia solo recibe confirmación del pago (ID, monto, estado). <a href="https://www.mercadopago.com.ar/privacidad" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de MercadoPago</a>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.4 Resend (Resend Inc.)</p>
                <p className="mt-1">Proveedor de envío de emails transaccionales. Solo recibe el email del destinatario, el nombre y el contenido del mensaje a enviar. Los emails se envían desde hola@mentaliasalud.online. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de Resend</a>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.5 Daily.co (Daily.co Inc.)</p>
                <p className="mt-1">Las videollamadas se realizan a través de Daily.co, una plataforma de videoconferencia segura. El audio y video de las sesiones son procesados por los servidores de Daily.co. Mentalia no graba ni almacena el contenido de las videollamadas. <a href="https://www.daily.co/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de Daily.co</a>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: "#D8F3DC" }}>
                <p className="font-medium text-gray-800">4.6 Vercel (Vercel Inc.)</p>
                <p className="mt-1">Proveedor de infraestructura y hosting. La plataforma está desplegada en Vercel (servidores de AWS). Los logs de acceso se retienen por un período limitado para fines de diagnóstico técnico. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#40916C" }}>Ver política de Vercel</a>.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>5. Almacenamiento local (localStorage)</h2>
            <p style={{ color: "#6B7280" }}>
              La plataforma utiliza el almacenamiento local del navegador (localStorage) de forma temporal para: guardar notas rápidas durante videollamadas y el estado de actividades terapéuticas completadas en el día. Estos datos permanecen en tu dispositivo y no se transmiten a nuestros servidores. Podés borrarlos en cualquier momento desde la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>6. Aplicación móvil (Android)</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia está disponible como aplicación instalable en dispositivos Android (PWA / Google Play Store). La aplicación accede a: cámara y micrófono (para videollamadas, con permiso explícito del usuario) e internet (para el funcionamiento de la plataforma). No accedemos a contactos, ubicación, archivos ni ningún otro dato del dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>7. Por cuánto tiempo conservamos los datos</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Los datos personales se conservan mientras la cuenta esté activa.</li>
              <li>Al solicitar la eliminación de la cuenta, los datos personales se eliminan en un plazo máximo de 30 días hábiles.</li>
              <li><strong className="text-gray-700">Historia clínica:</strong> por imperativo de la Ley N° 26.529 (Derechos del Paciente e Historia Clínica), las historias clínicas se conservan por un plazo mínimo de <strong>10 años</strong> desde la última actuación registrada. Este contenido no se elimina antes de dicho plazo aunque se dé de baja la cuenta; queda a resguardo y con acceso restringido hasta el vencimiento legal.</li>
              <li>Los datos de facturación (ID de transacción, monto, plan) pueden conservarse por hasta 5 años por obligaciones legales impositivas (Ley N° 11.683 de Procedimiento Fiscal).</li>
              <li>Los logs técnicos de acceso se eliminan automáticamente a los 30 días.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>8. Tus derechos — Ley N° 25.326 (Argentina)</h2>
            <p style={{ color: "#6B7280" }}>En cumplimiento de la Ley N° 25.326 de Protección de Datos Personales y su decreto reglamentario, tenés derecho a:</p>
            <ul className="mt-3 space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li><strong className="text-gray-700">Acceso (art. 14):</strong> solicitar gratuitamente qué datos personales tenemos sobre vos, una vez cada seis meses.</li>
              <li><strong className="text-gray-700">Rectificación (art. 16):</strong> corregir datos inexactos, incompletos o falsos.</li>
              <li><strong className="text-gray-700">Supresión (art. 16):</strong> solicitar la eliminación definitiva de tus datos (&ldquo;derecho al olvido&rdquo;), salvo que exista una obligación legal de conservarlos.</li>
              <li><strong className="text-gray-700">Confidencialidad (art. 7):</strong> los datos de salud (datos sensibles) tienen protección reforzada y solo pueden ser tratados con tu consentimiento expreso o por razones de salud pública.</li>
              <li><strong className="text-gray-700">Oposición:</strong> oponerte al tratamiento de tus datos con fines distintos a los informados.</li>
            </ul>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              Para ejercer cualquiera de estos derechos, escribí a{" "}
              <a href="mailto:hola@mentaliasalud.online" className="underline" style={{ color: "#40916C" }}>hola@mentaliasalud.online</a>{" "}
              indicando en el asunto &ldquo;Ejercicio de derechos LPDP&rdquo;. Respondemos en un plazo máximo de 10 días hábiles.
            </p>
            <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
              La Agencia de Acceso a la Información Pública (AAIP) — Dirección Nacional de Protección de Datos Personales es el organismo de control competente:{" "}
              <a href="https://www.argentina.gob.ar/aaip/datospersonales" target="_blank" rel="noopener noreferrer" className="underline">www.argentina.gob.ar/aaip/datospersonales</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>9. Seguridad de los datos</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Toda la comunicación entre tu dispositivo y nuestros servidores está cifrada mediante HTTPS/TLS 1.2+.</li>
              <li>La autenticación es gestionada por Supabase Auth con JWT y hashing de contraseñas (bcrypt). Las contraseñas nunca se almacenan en texto plano.</li>
              <li>El acceso a los datos está restringido por políticas de Row Level Security (RLS) a nivel de base de datos: cada usuario solo puede acceder a sus propios datos.</li>
              <li>Los datos sensibles (notas clínicas, diario emocional) están aislados y no son accesibles por el personal de Mentalia.</li>
              <li>Realizamos revisiones periódicas de accesos y monitoreo de actividad anormal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>10. Transferencia internacional de datos</h2>
            <p style={{ color: "#6B7280" }}>
              Al utilizar Mentalia, tus datos pueden ser transferidos y procesados en servidores ubicados fuera de la República Argentina (EE.UU.), a través de los proveedores indicados en la sección 4. Esta transferencia se realiza en el marco del artículo 12 de la Ley N° 25.326, únicamente con proveedores que ofrecen garantías adecuadas de protección (cumplimiento con GDPR europeo y/o certificaciones equivalentes).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>11. Menores de edad</h2>
            <p style={{ color: "#6B7280" }}>
              El acceso a Mentalia como paciente registrado está destinado a mayores de 18 años. En el caso de menores de edad bajo tratamiento, los datos son ingresados y gestionados por el profesional tratante o por el padre/madre/tutor legal con plena responsabilidad sobre dicho consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>12. Cambios a esta política</h2>
            <p style={{ color: "#6B7280" }}>
              Podemos actualizar esta política periódicamente. Cuando lo hagamos, te notificaremos por email con al menos 15 días de anticipación. La fecha de última actualización en la parte superior de este documento siempre reflejará la versión vigente. El uso continuado de la plataforma tras los cambios implica la aceptación de la nueva política.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>13. Contacto</h2>
            <p style={{ color: "#6B7280" }}>
              Para cualquier consulta sobre esta política de privacidad o para ejercer tus derechos, contactanos en:{" "}
              <a href="mailto:hola@mentaliasalud.online" className="underline font-medium" style={{ color: "#40916C" }}>hola@mentaliasalud.online</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t py-8 mt-16" style={{ borderColor: "rgba(45,106,79,0.15)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2D6A4F" }}>Mentalia</span>
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
