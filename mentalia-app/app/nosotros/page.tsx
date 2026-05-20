import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes somos | Mentalia",
  description: "Mentalia es una empresa tecnológica argentina que construye la plataforma de salud mental digital más completa de Latinoamérica para profesionales y pacientes.",
};

const especialidades = [
  "Psicología clínica individual",
  "Psicología infanto-juvenil",
  "Psiquiatría y psicofarmacología",
  "Terapia de pareja y familia",
  "Neuropsicología",
  "Psicología organizacional",
];

const audiencia = [
  "Profesionales con práctica activa (5 a 50+ pacientes)",
  "Atención presencial, online o modalidad mixta",
  "Especialistas que ejercen de forma independiente",
  "Equipos reducidos y centros de salud mental",
  "Profesionales que quieren crecer con orden",
  "Especialistas comprometidos con su paciente",
];

const funciones = [
  {
    titulo: "Historia Clínica con IA",
    desc: "Resúmenes clínicos generados automáticamente al finalizar cada sesión. Historial completo, seguimiento por temas y nivel de riesgo integrado.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    titulo: "Agenda Inteligente",
    desc: "Gestión de turnos, recordatorios automáticos y autogestión de citas por parte del paciente. Sin coordinación manual.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    titulo: "Mensajería Segura",
    desc: "Canal cifrado dentro de la plataforma. Sin WhatsApp, sin mezclar lo personal con lo profesional.",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
  {
    titulo: "Videollamadas Integradas",
    desc: "Telepsicología sin apps externas. El paciente se une con un clic, con privacidad clínica garantizada.",
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.806v6.388a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
  {
    titulo: "Cobros y Facturación",
    desc: "Control de pagos, sesiones abonadas y pendientes. Integración con MercadoPago para el mercado latinoamericano.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    titulo: "Seguimiento del Paciente",
    desc: "Diario emocional, progreso con datos reales, alertas de riesgo. El profesional detecta señales antes de que escalen.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA", fontFamily: "system-ui, sans-serif" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50" style={{ background: "#40916C" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold italic" style={{ fontFamily: "Georgia, serif", color: "white" }}>
            Mentalia
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/#funciones" className="text-xs font-medium text-green-100/70 hover:text-white transition">Funciones</Link>
            <Link href="/#precios" className="text-xs font-medium text-green-100/70 hover:text-white transition">Precios</Link>
            <Link href="/nosotros" className="text-xs font-medium text-white transition">Quiénes somos</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline text-xs font-medium text-green-100/80 hover:text-white transition">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="hidden md:inline text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-90" style={{ background: "#D8F3DC", color: "#40916C" }}>
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 text-center" style={{ background: "#40916C" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.06 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_mentalia_white.svg" alt="" className="w-[600px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6">
          <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(216,243,220,0.2)", color: "#D8F3DC" }}>
            Plataforma de salud mental · Latinoamérica
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-white" style={{ fontFamily: "Georgia, serif" }}>
            Quiénes somos
          </h1>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(216,243,220,0.85)" }}>
            Mentalia es una empresa tecnológica nacida en Argentina con una visión clara: construir la plataforma de salud mental digital más completa de Latinoamérica, pensada desde el primer día para los profesionales que la necesitaban y para los pacientes que los eligen.
          </p>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / REGIÓN */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                label: "Misión",
                texto: "Simplificar la práctica clínica en salud mental para que los especialistas puedan ejercer con más libertad y dedicar más tiempo real a sus pacientes.",
                accent: "#2D6A4F",
              },
              {
                label: "Visión",
                texto: "Ser la plataforma de referencia en salud mental digital para toda Latinoamérica, presente en cada consultorio de la región.",
                accent: "#40916C",
              },
              {
                label: "Región",
                texto: "Nacimos en Argentina y crecemos hacia México, Colombia, Chile, Uruguay y Brasil. Una plataforma de la región, para la región.",
                accent: "#52B788",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-7 border border-gray-100 bg-white">
                <div
                  className="w-1 h-8 rounded-full mb-5"
                  style={{ background: item.accent }}
                />
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: item.accent }}>
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-16 border-b border-gray-100" style={{ background: "#f7faf8" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            Construido escuchando a quienes lo necesitaban
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
            Somos un equipo multidisciplinario — tecnólogos, diseñadores y personas con vivencias propias en el sistema de salud mental — convencidos de que la tecnología bien aplicada puede transformar la práctica clínica. No construimos herramientas genéricas: construimos soluciones que nacieron de escuchar a quienes ejercen la profesión todos los días.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
            Cada funcionalidad de Mentalia tiene una historia. No salió de una pizarra ni de un benchmark de competidores. Salió de conversaciones reales con licenciados, psicólogos clínicos, psiquiatras y terapeutas de Argentina, México, Colombia, Chile, Uruguay y más países de la región. Primero escuchamos. Luego construimos. Y cuando terminamos, volvemos a escuchar.
          </p>
        </div>
      </section>

      {/* A QUÉ NOS DEDICAMOS */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            A qué nos dedicamos
          </h2>
          <p className="text-sm text-center max-w-xl mx-auto mb-12" style={{ color: "#6B7280" }}>
            No somos una app de videollamadas ni un simple gestor de turnos: somos todo eso junto, unificado, pensado para el flujo real de trabajo de un consultorio.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {funciones.map((f) => (
              <div key={f.titulo} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#40916C]/20 transition">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: "#D8F3DC" }}>
                  <svg width="18" height="18" fill="none" stroke="#40916C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#2D6A4F" }}>{f.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EL PROFESIONAL QUE ACOMPAÑAMOS */}
      <section className="py-16 border-b border-gray-100" style={{ background: "#f7faf8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold text-center uppercase tracking-widest mb-2" style={{ color: "#40916C" }}>Nuestro usuario</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            El profesional que acompañamos
          </h2>
          <p className="text-sm text-center max-w-2xl mx-auto mb-12" style={{ color: "#6B7280" }}>
            Mentalia fue construida para un perfil específico: el especialista en salud mental con práctica activa, que trabaja de forma independiente o en equipos pequeños, y que hoy carga con una doble exigencia: ser excelente clínicamente y gestionar todo lo administrativo de su consultorio sin ayuda.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-gray-100">
              <h3 className="font-semibold text-sm mb-5" style={{ color: "#2D6A4F" }}>Especialidades que trabajamos</h3>
              <ul className="space-y-3">
                {especialidades.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-sm" style={{ color: "#374151" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#40916C" }} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-7" style={{ background: "#40916C" }}>
              <h3 className="font-semibold text-sm mb-5 text-white">A quién buscamos</h3>
              <ul className="space-y-3">
                {audiencia.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm" style={{ color: "rgba(216,243,220,0.9)" }}>
                    <span className="flex-shrink-0 mt-1" style={{ color: "#D8F3DC" }}>✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="py-20" style={{ background: "#2D6A4F" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl font-bold mb-6 leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "white" }}>
            Porque cuidar la salud mental de Latinoamérica empieza por cuidar a quienes la cuidan.
          </p>
          <p className="text-sm mb-10" style={{ color: "rgba(216,243,220,0.75)" }}>
            mentaliasalud.online · Buenos Aires, Argentina
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro" className="text-sm px-8 py-3.5 rounded-xl font-semibold transition hover:opacity-90" style={{ background: "#D8F3DC", color: "#40916C" }}>
              Empezar gratis
            </Link>
            <Link href="/" className="text-sm px-8 py-3.5 rounded-xl font-semibold transition border" style={{ borderColor: "rgba(216,243,220,0.3)", color: "rgba(216,243,220,0.9)" }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8" style={{ borderColor: "rgba(45,106,79,0.15)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-base font-bold italic" style={{ fontFamily: "Georgia, serif", color: "#40916C" }}>Mentalia</span>
          <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} Mentalia · Plataforma de salud mental · Argentina
          </p>
          <div className="flex gap-5 text-xs" style={{ color: "#9CA3AF" }}>
            <Link href="/privacidad" className="hover:text-[#40916C] transition">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#40916C] transition">Términos</Link>
            <Link href="/contacto" className="px-3 py-1 rounded-lg border border-[#2D6A4F] text-[#2D6A4F] transition hover:bg-[#2D6A4F] hover:text-white">Contactanos</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
