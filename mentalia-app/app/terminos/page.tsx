import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones — Mentalia",
  description: "Condiciones de uso de la plataforma Mentalia. Planes, precios y responsabilidades.",
};

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Vigentes desde junio de 2026 · Última actualización: julio de 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#374151" }}>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>1. Descripción del servicio</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia es una plataforma SaaS (Software as a Service) de telesalud mental que permite a profesionales de la salud mental (psicólogos/as, psiquiatras y demás profesionales habilitados) gestionar su consultorio digital: agenda, historia clínica, videollamadas, mensajería, cobros y resúmenes clínicos asistidos por inteligencia artificial.
            </p>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              A su vez, permite a los pacientes acceder a sus sesiones programadas, registrar su estado emocional mediante un diario, realizar actividades terapéuticas guiadas y comunicarse de forma segura con su profesional tratante.
            </p>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              Al registrarte y utilizar Mentalia, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debés utilizar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>2. Requisitos para profesionales</h2>
            <p className="mb-3" style={{ color: "#6B7280" }}>Para usar Mentalia como profesional de la salud mental, debés:</p>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Contar con matrícula profesional vigente en la República Argentina o en tu país de ejercicio (psicólogos/as, psiquiatras u otros profesionales de salud mental habilitados).</li>
              <li>Ser mayor de 18 años.</li>
              <li>Utilizar el servicio de forma ética y dentro del marco legal y deontológico vigente en tu jurisdicción.</li>
              <li>No compartir tus credenciales de acceso con terceros.</li>
              <li>Ser el único responsable del contenido clínico que generás y gestionás dentro de la plataforma.</li>
              <li>Obtener el consentimiento informado de tus pacientes para el uso de la plataforma digital, incluyendo el uso de herramientas de inteligencia artificial para resúmenes clínicos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>3. Requisitos para pacientes</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Ser mayor de 18 años. En el caso de menores de edad, el registro y uso de la plataforma requiere la supervisión y consentimiento expreso de un padre, madre o tutor legal.</li>
              <li>Proporcionar información veraz al registrarse y al usar el servicio.</li>
              <li>No grabar ni difundir el contenido de las videollamadas sin el consentimiento expreso del profesional tratante.</li>
              <li>Usar el servicio exclusivamente para fines relacionados con la atención de salud mental.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>4. Planes, precios y facturación</h2>

            <div className="rounded-xl overflow-hidden border border-gray-100 mb-5">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#2D6A4F" }}>
                    <th className="text-left px-4 py-3 text-white font-semibold">Plan</th>
                    <th className="text-right px-4 py-3 text-white font-semibold">USD/mes</th>
                    <th className="text-right px-4 py-3 text-white font-semibold">ARS/mes</th>
                  </tr>
                </thead>
                <tbody style={{ color: "#374151" }}>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">Starter</td>
                    <td className="px-4 py-3 text-right">USD 15</td>
                    <td className="px-4 py-3 text-right">$ 16.500</td>
                  </tr>
                  <tr className="border-t border-gray-100" style={{ background: "#f0faf3" }}>
                    <td className="px-4 py-3 font-medium">Pro <span className="text-xs font-normal text-[#40916C]">(recomendado)</span></td>
                    <td className="px-4 py-3 text-right">USD 40</td>
                    <td className="px-4 py-3 text-right">$ 45.000</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">Clínica</td>
                    <td className="px-4 py-3 text-right">USD 75</td>
                    <td className="px-4 py-3 text-right">$ 85.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li><strong className="text-gray-700">Período de prueba:</strong> todos los planes incluyen 10 días de prueba gratuita. No se requiere tarjeta de crédito para activar el período de prueba.</li>
              <li><strong className="text-gray-700">Moneda de cobro:</strong> los precios en ARS son los que aplican al cobro. El equivalente en USD se indica como referencia. Los precios en ARS pueden ajustarse periódicamente.</li>
              <li><strong className="text-gray-700">Facturación:</strong> mensual, con renovación automática en la fecha de contratación.</li>
              <li><strong className="text-gray-700">Actualización de precios:</strong> Mentalia puede actualizar los precios con un aviso previo de al menos 30 días corridos comunicado por email.</li>
              <li><strong className="text-gray-700">Cancelación:</strong> podés cancelar tu plan en cualquier momento. La cancelación aplica al próximo período de facturación; no se realizan reembolsos proporcionales por el período en curso.</li>
              <li><strong className="text-gray-700">Descuento por referido:</strong> al referir a otro profesional que se registre y active su cuenta, ambos obtienen un 20% de descuento durante 2 meses. El descuento se aplica automáticamente cuando el referido realiza su primer pago.</li>
              <li><strong className="text-gray-700">Procesamiento de pagos:</strong> los pagos son procesados exclusivamente por MercadoPago. Mentalia no almacena datos de medios de pago.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>5. Uso aceptable</h2>
            <p className="mb-3" style={{ color: "#6B7280" }}>Al utilizar Mentalia, te comprometés a no:</p>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Usar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros.</li>
              <li>Intentar acceder a cuentas, datos o sistemas de otros usuarios sin autorización.</li>
              <li>Introducir virus, malware o cualquier código dañino en la plataforma.</li>
              <li>Realizar ingeniería inversa, descompilar o desensamblar cualquier parte del software.</li>
              <li>Usar herramientas automatizadas (bots, scrapers) para extraer datos de la plataforma.</li>
              <li>Hacerte pasar por otro usuario, profesional o entidad.</li>
              <li>Usar la mensajería interna o las funciones de la plataforma para enviar spam o contenido no solicitado.</li>
              <li>Compartir, publicar o difundir notas clínicas, resúmenes o información de pacientes sin su consentimiento expreso.</li>
              <li>Ejercer presión, acoso o discriminación hacia otros usuarios a través de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>6. Disponibilidad del servicio</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia se compromete a mantener una disponibilidad mínima del 99% mensual del servicio. Pueden existir interrupciones programadas por mantenimiento, de las cuales se notificará con antelación por email. No somos responsables por interrupciones del servicio causadas por factores fuera de nuestro control (cortes de internet, fallos de proveedores de infraestructura, fuerza mayor).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>7. Limitación de responsabilidad</h2>

            <div className="rounded-xl p-4 mb-4" style={{ background: "#fff7ed", border: "1px solid rgba(194,65,12,0.25)" }}>
              <p className="font-semibold mb-1" style={{ color: "#9a3412" }}>Mentalia no es un servicio de emergencia.</p>
              <p style={{ color: "#7c2d12" }}>
                La plataforma no brinda atención de urgencia ni intervención en crisis, y no reemplaza la atención
                médica o psicológica de urgencia. Si vos o alguien está atravesando una crisis o riesgo de vida,
                contactá de inmediato: <strong>SAME 107</strong> o <strong>911</strong> (emergencias), o el{" "}
                <strong>Centro de Asistencia al Suicida (CAS) — 135</strong> (CABA/GBA) o{" "}
                <strong>0800-345-1435</strong> (todo el país), de 8 a 24 h. La función de detección de riesgo de la
                plataforma es una ayuda al profesional y no garantiza la identificación de todas las situaciones de riesgo.
              </p>
            </div>

            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>Mentalia es una herramienta de gestión para profesionales de la salud mental. <strong className="text-gray-700">No somos una entidad de salud, no brindamos servicios de salud directamente</strong> y no reemplazamos la relación terapéutica entre profesional y paciente.</li>
              <li>No somos responsables del contenido clínico generado, registrado o compartido por los profesionales dentro de la plataforma. La responsabilidad clínica recae íntegramente en el profesional habilitado.</li>
              <li>Los resúmenes clínicos generados con asistencia de inteligencia artificial son de carácter orientativo y de apoyo al profesional. <strong className="text-gray-700">No reemplazan el criterio clínico, diagnóstico ni tratamiento</strong> indicado por el profesional. El profesional es el único responsable de las decisiones clínicas que tome.</li>
              <li>En ningún caso Mentalia será responsable por daños indirectos, especiales, incidentales o consecuentes derivados del uso o imposibilidad de uso del servicio, incluyendo pérdida de datos, ingresos o ganancias.</li>
              <li>La responsabilidad máxima de Mentalia por cualquier reclamo se limita al monto pagado en el mes en que ocurrió el evento que originó el reclamo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>8. Propiedad intelectual</h2>
            <ul className="space-y-2 pl-4 list-disc" style={{ color: "#6B7280" }}>
              <li>El código, diseño, marca, logo, textos e interfaz de Mentalia son propiedad exclusiva de Mentalia y están protegidos por las leyes de propiedad intelectual de la República Argentina (Ley N° 11.723).</li>
              <li>Los datos clínicos (notas, resúmenes, historias clínicas) y el contenido generado por los usuarios dentro de la plataforma son propiedad del profesional y/o del paciente. Mentalia no reclama derechos de propiedad sobre dicho contenido.</li>
              <li>Queda prohibida la reproducción, distribución o uso comercial de cualquier elemento de la plataforma sin autorización expresa y escrita de Mentalia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>9. Privacidad y datos personales</h2>
            <p style={{ color: "#6B7280" }}>
              El tratamiento de los datos personales de los usuarios se rige por nuestra{" "}
              <Link href="/privacidad" className="underline font-medium" style={{ color: "#40916C" }}>Política de Privacidad</Link>,
              que cumple con la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y los requisitos de las plataformas de distribución (Google Play Store, App Store). Al aceptar estos Términos, también aceptás la Política de Privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>10. Suspensión y cancelación de cuentas</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia se reserva el derecho de suspender o cancelar cuentas que violen estos Términos, realicen un uso fraudulento del servicio, incurran en morosidad en los pagos o perjudiquen a otros usuarios. En casos graves (fraude, conducta dañina hacia pacientes), la suspensión puede ser inmediata y sin previo aviso. En caso de cancelación por incumplimiento, no se realizarán reembolsos por el período en curso.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>11. Modificaciones al servicio</h2>
            <p style={{ color: "#6B7280" }}>
              Mentalia puede modificar, suspender o discontinuar funcionalidades del servicio con un aviso previo razonable por email. Nos comprometemos a no remover funcionalidades esenciales sin un aviso de al menos 30 días y a ofrecer alternativas cuando sea posible.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>12. Ley aplicable y jurisdicción</h2>
            <p style={{ color: "#6B7280" }}>
              Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier controversia derivada del uso de la plataforma, las partes se someten voluntariamente a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "#2D6A4F" }}>13. Contacto</h2>
            <p style={{ color: "#6B7280" }}>
              Para consultas sobre estos Términos y Condiciones, soporte técnico o cualquier inquietud sobre el servicio, escribí a:{" "}
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
            <Link href="/privacidad" className="hover:text-[#40916C] transition">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#40916C] transition font-medium" style={{ color: "#40916C" }}>Términos</Link>
            <Link href="/login" className="hover:text-[#40916C] transition">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
