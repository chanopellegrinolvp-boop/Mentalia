import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones — Mentalia",
  description: "Condiciones de uso de la plataforma Mentalia.",
};

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Vigentes desde mayo de 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#374151" }}>

          {/* 1 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>1. Descripción del servicio</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia es una plataforma SaaS (Software as a Service) que permite a profesionales de la salud mental gestionar su consultorio digital: agenda, historia clínica, videollamadas, cobros y resúmenes clínicos asistidos. A su vez, permite a los pacientes acceder a sus sesiones programadas, registrar su estado emocional y comunicarse de forma segura con su profesional tratante.
            </p>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              Al registrarte y utilizar Mentalia, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debés utilizar el servicio.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>2. Requisitos para profesionales</h2>
            <p className="mb-3" style={{ color: "#6B7280" }}>Para usar Mentalia como profesional de la salud mental, debés:</p>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Contar con matrícula profesional vigente en la República Argentina (psicólogos/as, psiquiatras u otros profesionales de salud mental habilitados).</li>
              <li>Ser mayor de 18 años.</li>
              <li>Usar el servicio de forma ética y dentro del marco legal y deontológico vigente en Argentina.</li>
              <li>No compartir tus credenciales de acceso con terceros.</li>
              <li>Ser el único responsable del contenido clínico que generás dentro de la plataforma.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>3. Requisitos para pacientes</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Ser mayor de 18 años. En el caso de menores de edad, el registro y uso de la plataforma requiere la supervisión y consentimiento de un padre, madre o tutor legal.</li>
              <li>Proporcionar información veraz al registrarse y al usar el servicio.</li>
              <li>No grabar ni difundir el contenido de las videollamadas sin el consentimiento expreso del profesional.</li>
              <li>Usar el servicio solo para fines relacionados con la atención de salud mental.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>4. Planes y facturación</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Los precios de los planes están expresados en pesos argentinos (ARS) y en dólares estadounidenses (USD) como referencia. El cobro se realiza en ARS.</li>
              <li>Los precios pueden actualizarse con un aviso previo de al menos 30 días corridos comunicado por email.</li>
              <li>La facturación es mensual y se renueva automáticamente en la fecha de contratación.</li>
              <li>Todos los planes incluyen un período de prueba gratuito de 10 días sin necesidad de ingresar datos de tarjeta de crédito.</li>
              <li>Las cancelaciones aplican al próximo período de facturación; no se realizan reembolsos proporcionales por el período en curso.</li>
              <li>Los pagos son procesados por MercadoPago. Mentalia no almacena datos de medios de pago.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>5. Limitación de responsabilidad</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Mentalia es una herramienta de gestión para profesionales de la salud mental. No somos una entidad de salud, no brindamos servicios de salud directamente y no reemplazamos la relación terapéutica entre profesional y paciente.</li>
              <li>No somos responsables del contenido clínico generado, registrado o compartido por los profesionales dentro de la plataforma.</li>
              <li>Los resúmenes clínicos generados con asistencia de inteligencia artificial son orientativos y de apoyo al profesional. No reemplazan el criterio, diagnóstico ni tratamiento indicado por el profesional habilitado. El profesional es el único responsable de las decisiones clínicas que tome.</li>
              <li>No garantizamos disponibilidad ininterrumpida del servicio, aunque nos comprometemos a mantener una disponibilidad mínima del 99% mensual.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>6. Propiedad intelectual</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>El código, diseño, marca, logo, textos e interfaz de Mentalia son propiedad exclusiva de Mentalia y están protegidos por las leyes de propiedad intelectual de la República Argentina.</li>
              <li>Los datos clínicos (notas, resúmenes, historias clínicas) ingresados en la plataforma son propiedad del profesional y del paciente. Mentalia no reclama derechos sobre dicho contenido.</li>
              <li>Queda prohibida la reproducción, distribución o uso comercial de cualquier elemento de la plataforma sin autorización expresa por escrito.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>7. Suspensión y cancelación de cuentas</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia se reserva el derecho de suspender o cancelar cuentas que violen estos términos, que realicen un uso fraudulento del servicio o que perjudiquen a otros usuarios. En casos graves, la suspensión puede ser inmediata y sin previo aviso.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>8. Ley aplicable y jurisdicción</h2>
            <p style={{ color: "#6B7280" }}>
              Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier controversia derivada del uso de la plataforma, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#40916C" }}>9. Contacto</h2>
            <p style={{ color: "#6B7280" }}>
              Para consultas sobre estos términos escribí a{" "}
              <a href="mailto:hola@mentaliasalud.lat" className="underline" style={{ color: "#40916C" }}>hola@mentaliasalud.lat</a>.
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
            <Link href="/privacidad" className="hover:text-[#40916C] transition">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#40916C] transition font-medium" style={{ color: "#40916C" }}>Términos</Link>
            <Link href="/login" className="hover:text-[#40916C] transition">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
