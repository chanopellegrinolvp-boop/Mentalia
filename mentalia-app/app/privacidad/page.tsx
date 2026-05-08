import Link from "next/link";
import Image from "next/image";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>
      <nav className="px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} /></Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-gris text-sm mb-8">Última actualización: mayo 2026</p>

        {[
          { title: "¿Qué datos recopilamos?", content: "Recopilamos nombre, email, teléfono y rol (paciente/profesional) al registrarse. Para profesionales: matrícula, especialidad, años de experiencia y datos de facturación. No recopilamos datos de salud directamente — las notas clínicas son ingresadas y controladas exclusivamente por los profesionales." },
          { title: "¿Cómo usamos tus datos?", content: "Usamos tus datos para proveer el servicio, procesar pagos, enviarte recordatorios de sesiones y mejorar la plataforma. No vendemos, alquilamos ni compartimos datos personales con terceros sin consentimiento, excepto cuando lo requiera la ley." },
          { title: "Datos clínicos y confidencialidad", content: "Las notas de sesión, historia clínica e información terapéutica son de acceso exclusivo del profesional tratante. Estos datos están cifrados y almacenados con Row Level Security (RLS). Mentalia no lee ni procesa información clínica." },
          { title: "Cookies y tecnologías similares", content: "Usamos cookies de sesión para mantener tu inicio de sesión. No usamos cookies de seguimiento de terceros. Podés configurar tu navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de la plataforma." },
          { title: "Seguridad", content: "Toda la información se transmite cifrada (HTTPS/TLS). Las contraseñas se almacenan con hash bcrypt. Usamos Supabase con infraestructura en AWS para el almacenamiento seguro de datos." },
          { title: "Tus derechos (Ley 25.326)", content: "Tenés derecho a acceder, rectificar y suprimir tus datos personales. Para ejercer estos derechos escribinos a privacidad@mentalia.com.ar. Podés eliminar tu cuenta en cualquier momento desde la configuración de tu perfil." },
          { title: "Retención de datos", content: "Conservamos los datos mientras la cuenta esté activa. Al eliminar la cuenta, los datos personales se eliminan en un plazo de 30 días. Los datos de facturación se conservan por 5 años según requisitos legales." },
          { title: "Contacto", content: "Para consultas de privacidad: privacidad@mentalia.com.ar" },
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
