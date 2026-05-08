import Link from "next/link";
import Image from "next/image";

const planes = [
  {
    nombre: "Básico",
    precio: "Gratis",
    sub: "Para siempre",
    color: "#6B7280",
    bg: "#f9fafb",
    features: ["Perfil en el directorio", "Hasta 5 pacientes activos", "Historia clínica digital", "Calendly integrado", "Videollamada básica"],
    cta: "Empezar gratis",
    href: "/registro?tipo=profesional",
    destacado: false,
  },
  {
    nombre: "Profesional",
    precio: "$9.900",
    sub: "por mes · ARS",
    color: "#2D6A4F",
    bg: "#2D6A4F",
    features: ["Todo lo del plan Básico", "Pacientes ilimitados", "Análisis IA de sesiones", "Detección de riesgo emocional", "Recordatorios automáticos", "Cobros con MercadoPago", "Soporte prioritario"],
    cta: "Empezar prueba gratis",
    href: "/registro?tipo=profesional&plan=pro",
    destacado: true,
  },
  {
    nombre: "Premium",
    precio: "$18.900",
    sub: "por mes · ARS",
    color: "#1a4a3a",
    bg: "#f0faf3",
    features: ["Todo lo del plan Profesional", "Multi-agenda (varios profesionales)", "Panel de supervisión clínica", "API para integraciones", "Manager de cuenta dedicado", "Facturación electrónica AFIP"],
    cta: "Contactar ventas",
    href: "mailto:ventas@mentalia.com.ar",
    destacado: false,
  },
];

export default function PreciosPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 60%, #FDFCFA 100%)" }}>
      <nav className="px-8 py-4 flex items-center justify-between border-b border-verde-claro/50" style={{ background: "rgba(216,243,220,0.8)", backdropFilter: "blur(12px)" }}>
        <Link href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} /></Link>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-verde-oscuro">Iniciar sesión</Link>
          <Link href="/registro" className="text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "#2D6A4F" }}>Empezar gratis</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Planes simples y transparentes</h1>
          <p className="text-gris text-lg">10 días de prueba gratis en todos los planes · Sin tarjeta de crédito</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map(plan => (
            <div key={plan.nombre} className="rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-md"
              style={{ background: plan.destacado ? plan.bg : "white", border: plan.destacado ? "none" : "1px solid #f3f4f6" }}>
              {plan.destacado && (
                <div className="px-6 pt-4 text-center">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-white/20">⭐ Más popular</span>
                </div>
              )}
              <div className="p-8">
                <h2 className="text-lg font-bold mb-1" style={{ color: plan.destacado ? "white" : "#111827" }}>{plan.nombre}</h2>
                <div className="mb-1">
                  <span className="text-4xl font-bold" style={{ color: plan.destacado ? "white" : plan.color }}>{plan.precio}</span>
                </div>
                <p className="text-sm mb-6" style={{ color: plan.destacado ? "rgba(255,255,255,0.7)" : "#6B7280" }}>{plan.sub}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: plan.destacado ? "rgba(255,255,255,0.9)" : "#374151" }}>
                      <span style={{ color: plan.destacado ? "#86efac" : "#2D6A4F" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}
                  className="block w-full py-3 text-center font-semibold rounded-xl transition-all hover:shadow-md"
                  style={{ background: plan.destacado ? "white" : "#2D6A4F", color: plan.destacado ? "#2D6A4F" : "white" }}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gris mt-8">
          ¿Tenés dudas? <a href="mailto:hola@mentalia.com.ar" className="font-semibold hover:underline" style={{ color: "#2D6A4F" }}>Escribinos</a>
        </p>
      </div>
    </div>
  );
}
