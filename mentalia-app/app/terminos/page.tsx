import Link from "next/link";
import Image from "next/image";

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>
      <nav className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} /></Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-gris text-sm mb-8">Última actualización: mayo 2026</p>

        {[
          { title: "1. Aceptación de los términos", content: "Al acceder y utilizar la plataforma Mentalia, el usuario acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar nuestros servicios." },
          { title: "2. Descripción del servicio", content: "Mentalia es una plataforma digital que conecta a profesionales de la salud mental con pacientes en Argentina. Mentalia actúa como intermediario tecnológico y no provee servicios de salud mental directamente." },
          { title: "3. Registro y cuentas", content: "Para utilizar la plataforma, los usuarios deben registrarse con información veraz y actualizada. Los profesionales deben contar con matrícula habilitante vigente. Mentalia se reserva el derecho de verificar la identidad y credenciales de los profesionales." },
          { title: "4. Responsabilidades del profesional", content: "Los profesionales son responsables de la atención brindada, el cumplimiento de su código de ética profesional, la confidencialidad de la información de sus pacientes y la veracidad de su información profesional." },
          { title: "5. Pagos y facturación", content: "Los pagos se procesan a través de MercadoPago. Mentalia cobra una comisión por cada transacción. Los precios de las sesiones son establecidos por cada profesional. Los reembolsos están sujetos a la política de cancelación de cada profesional." },
          { title: "6. Privacidad y confidencialidad", content: "La información clínica es confidencial y solo accesible para el profesional tratante. Mentalia no accede, comparte ni vende información clínica. Los datos personales se tratan conforme a la Ley 25.326 de Protección de Datos Personales de Argentina." },
          { title: "7. Limitación de responsabilidad", content: "Mentalia no es responsable por la calidad de los servicios terapéuticos brindados por los profesionales. En ningún caso Mentalia será responsable por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma." },
          { title: "8. Modificaciones", content: "Mentalia puede modificar estos términos en cualquier momento. Los usuarios serán notificados por email ante cambios significativos. El uso continuado de la plataforma implica la aceptación de los términos actualizados." },
          { title: "9. Jurisdicción", content: "Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires." },
          { title: "10. Contacto", content: "Para consultas sobre estos términos: legal@mentalia.com.ar" },
        ].map(s => (
          <div key={s.title} className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-gray-700 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
