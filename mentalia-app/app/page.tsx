import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "professional") redirect("/dashboard/profesional");
    redirect("/dashboard/paciente");
  }

  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA", fontFamily: "system-ui, sans-serif" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50" style={{ background: "#2D6A4F" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold italic" style={{ fontFamily: "Georgia, serif", color: "white" }}>
            Mentalia
          </span>
          <nav className="hidden md:flex items-center gap-7">
            <a href="#funciones" className="text-xs font-medium text-green-100/70 hover:text-white transition">Funciones</a>
            <a href="#precios" className="text-xs font-medium text-green-100/70 hover:text-white transition">Precios</a>
            <a href="#quienes" className="text-xs font-medium text-green-100/70 hover:text-white transition">Para quién</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-medium text-green-100/80 hover:text-white transition">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-90" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.04 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_mentalia.svg" alt="" className="w-[520px]" />
        </div>

        <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-6" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
          Plataforma de salud mental con IA · Argentina
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
          Tu consultorio<br />
          <span className="italic">inteligente</span>
        </h1>
        <p className="text-base max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "#6B7280" }}>
          Videollamadas, historia clínica, resumen automático de sesiones con IA y seguimiento del paciente. Todo en un solo lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/registro" className="text-sm text-white px-7 py-3.5 rounded-xl font-semibold transition hover:opacity-90 shadow-sm" style={{ background: "#2D6A4F" }}>
            Crear cuenta gratis
          </Link>
          <a href="#funciones" className="text-sm px-7 py-3.5 rounded-xl font-semibold transition border border-gray-200 hover:border-[#2D6A4F]/40" style={{ color: "#2D6A4F" }}>
            Ver funciones
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs" style={{ color: "#9CA3AF" }}>
          <span>✓ Sin tarjeta de crédito</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>✓ 10 días de prueba gratis</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>✓ Cancelás cuando querés</span>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section id="quienes" className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold text-center uppercase tracking-widest mb-2" style={{ color: "#2D6A4F" }}>Para quién es Mentalia</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            Diseñado para profesionales y pacientes
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-7" style={{ background: "#2D6A4F" }}>
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Para psicólogos/as</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(216,243,220,0.6)" }}>Más tiempo para tus pacientes, menos para la administración.</p>
              <ul className="space-y-2.5 text-xs" style={{ color: "rgba(216,243,220,0.85)" }}>
                {[
                  "Dedicás más tiempo a tus pacientes y menos al papeleo",
                  "Toda la historia clínica accesible antes de cada sesión",
                  "Nunca más perdés el hilo entre consultas",
                  "Detectás señales de riesgo antes de que escalen",
                  "Sesiones presenciales y online desde un solo lugar",
                  "Controlás tu agenda e ingresos sin salir de la plataforma",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#D8F3DC" }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-7 border border-gray-100 bg-white">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: "#D8F3DC" }}>
                <svg className="w-4 h-4" style={{ color: "#2D6A4F" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-3" style={{ color: "#2D6A4F" }}>Para pacientes</h3>
              <ul className="space-y-2 text-xs" style={{ color: "#6B7280" }}>
                {["Diario emocional con seguimiento de estado","Ver historial de sesiones","Unirse a videollamadas con un clic","Actividades terapéuticas guiadas","Seguimiento de progreso semanal","Mensajería directa con el profesional"].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#2D6A4F" }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONES IA */}
      <section id="funciones" className="py-16 border-t border-gray-100" style={{ background: "#f7faf8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold text-center uppercase tracking-widest mb-2" style={{ color: "#2D6A4F" }}>Funciones</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            Tu consultorio, completo desde el día uno
          </h2>
          <p className="text-sm text-center max-w-lg mx-auto mb-12" style={{ color: "#6B7280" }}>
            Cada herramienta está pensada para que dediques más tiempo al paciente y menos a la administración.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", titulo: "Resumen clínico por sesión", desc: "Al finalizar cada consulta, generás un resumen estructurado con temas trabajados, estado emocional y observaciones." },
              { icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", titulo: "Seguimiento de temas clínicos", desc: "Cada sesión queda etiquetada por temas para facilitar el seguimiento longitudinal del paciente." },
              { icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", titulo: "Nivel de riesgo clínico", desc: "Clasificación en bajo, medio o alto riesgo integrada en la historia clínica para priorizar cuando más importa." },
              { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", titulo: "Historia clínica continua", desc: "Accedé al historial completo del paciente antes de cada sesión para mantener el hilo clínico." },
              { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", titulo: "Diario emocional del paciente", desc: "El paciente registra su estado entre sesiones. Vos ves la evolución directamente en la historia clínica." },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", titulo: "Progreso con datos reales", desc: "Gráficos de estado emocional y frecuencia de sesiones para visualizar la evolución clínica." },
            ].map(feat => (
              <div key={feat.titulo} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#2D6A4F]/20 transition">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: "#D8F3DC" }}>
                  <svg style={{ color: "#2D6A4F" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feat.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-xs mb-1.5" style={{ color: "#2D6A4F" }}>{feat.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-semibold text-center uppercase tracking-widest mb-2" style={{ color: "#2D6A4F" }}>Simple desde el día 1</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", titulo: "Creá tu cuenta", desc: "Registrate como profesional en menos de 2 minutos. Cargá tu perfil, especialidad y precio de sesión." },
              { num: "02", titulo: "Agregá pacientes", desc: "Creá fichas de pacientes, agendá sesiones y accedé a la videollamada con un clic desde el panel." },
              { num: "03", titulo: "La IA hace el trabajo", desc: "Al finalizar cada sesión, transcribís tus notas y la IA genera el resumen clínico automáticamente." },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: "#D8F3DC", fontFamily: "Georgia, serif" }}>{step.num}</div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#2D6A4F" }}>{step.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="relative overflow-hidden py-20 border-t border-gray-100" style={{ background: "#f7faf8" }}>

        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.025 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_mentalia.svg" alt="" className="w-[700px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#2D6A4F" }}>Precios</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
              Invertí menos que una sesión
            </h2>
            <p className="text-sm max-w-md mx-auto mb-5" style={{ color: "#6B7280" }}>
              Una consulta presencial cuesta $50–$80 USD. Con Mentalia gestionás toda tu práctica por menos.
            </p>
            <div className="inline-flex items-center gap-5 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs" style={{ color: "#6B7280" }}>
              <span>✓ 10 días gratis</span>
              <span className="w-px h-3 bg-gray-200" />
              <span>✓ Sin tarjeta</span>
              <span className="w-px h-3 bg-gray-200" />
              <span>✓ Cancelás cuando querés</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4 items-end">

            {/* Starter */}
            <div className="rounded-2xl flex flex-col bg-white" style={{ border: "1px solid #e5e7eb" }}>
              <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Starter</p>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>Para empezar</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>Ideal para psicólogos que se inician en la atención online</p>
              </div>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-bold" style={{ color: "#2D6A4F" }}>$15</span>
                  <span className="text-sm mb-1" style={{ color: "#9CA3AF" }}>USD/mes</span>
                </div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>$ 14.500 ARS/mes</p>
              </div>
              <ul className="px-6 py-5 space-y-3 flex-1">
                {["Hasta 15 pacientes activos", "Videollamadas ilimitadas", "Historia clínica digital", "5 resúmenes con IA / mes", "Agenda y gestión de cobros"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "#4B5563" }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                      <circle cx="7.5" cy="7.5" r="7.5" fill="#D8F3DC"/>
                      <path d="M4.5 7.5l2 2 4-4" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2.5 text-xs" style={{ color: "#D1D5DB" }}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="7.5" cy="7.5" r="7.5" fill="#F3F4F6"/>
                    <path d="M5 10l5-5M10 10L5 5" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  IA ilimitada (disponible en Pro)
                </li>
              </ul>
              <div className="px-6 pb-6">
                <Link href="/registro" className="block text-center py-2.5 rounded-xl font-semibold text-xs transition hover:opacity-80 border border-gray-200" style={{ color: "#2D6A4F" }}>
                  Empezar gratis
                </Link>
              </div>
            </div>

            {/* PRO */}
            <div className="rounded-2xl flex flex-col relative overflow-hidden" style={{ background: "#2D6A4F", boxShadow: "0 24px 72px rgba(45,106,79,0.4)", transform: "translateY(-20px)" }}>
              <div className="flex items-center justify-between px-7 py-3.5" style={{ background: "rgba(0,0,0,0.15)" }}>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>★ Más elegido</span>
                <span className="text-xs font-medium" style={{ color: "rgba(216,243,220,0.6)" }}>78% elige Pro</span>
              </div>
              <div className="px-7 pt-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "rgba(216,243,220,0.5)" }}>Pro</p>
                <h3 className="text-lg font-bold mb-1 text-white">Práctica completa</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(216,243,220,0.6)" }}>Para profesionales con práctica activa y en crecimiento</p>
              </div>
              <div className="px-7 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-sm line-through" style={{ color: "rgba(216,243,220,0.3)" }}>$49</span>
                  <span className="text-4xl font-bold text-white">$32</span>
                  <span className="text-sm mb-1" style={{ color: "rgba(216,243,220,0.5)" }}>USD/mes</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md mb-1" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>−35%</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(216,243,220,0.5)" }}>$ 30.000 ARS/mes · ≈ $2 por sesión</p>
              </div>
              <ul className="px-7 py-5 space-y-3 flex-1">
                {["Pacientes ilimitados", "Videollamadas ilimitadas", "Historia clínica completa", "Resúmenes IA ilimitados", "Estadísticas avanzadas", "Soporte prioritario"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(216,243,220,0.9)" }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                      <circle cx="7.5" cy="7.5" r="7.5" fill="rgba(216,243,220,0.2)"/>
                      <path d="M4.5 7.5l2 2 4-4" stroke="#D8F3DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="px-7 pb-7">
                <Link href="/registro" className="block text-center py-3 rounded-xl font-bold text-sm transition hover:opacity-90 mb-3" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
                  Empezar 10 días gratis →
                </Link>
                <p className="text-center text-xs" style={{ color: "rgba(216,243,220,0.35)" }}>Sin tarjeta de crédito requerida</p>
              </div>
            </div>

            {/* Clínica */}
            <div className="rounded-2xl flex flex-col bg-white" style={{ border: "1px solid #e5e7eb" }}>
              <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Clínica</p>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>Para equipos</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>Equipos, clínicas y centros de salud mental</p>
              </div>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-bold" style={{ color: "#2D6A4F" }}>$75</span>
                  <span className="text-sm mb-1" style={{ color: "#9CA3AF" }}>USD/mes</span>
                </div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>$ 70.000 ARS/mes · hasta 5 profesionales</p>
              </div>
              <ul className="px-6 py-5 space-y-3 flex-1">
                {["Todo lo de Pro incluido", "Hasta 5 profesionales", "Panel de administración", "Reportes del equipo", "Integración MercadoPago", "Onboarding dedicado"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "#4B5563" }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                      <circle cx="7.5" cy="7.5" r="7.5" fill="#D8F3DC"/>
                      <path d="M4.5 7.5l2 2 4-4" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="px-6 pb-6">
                <Link href="/registro" className="block text-center py-2.5 rounded-xl font-semibold text-xs transition hover:opacity-90" style={{ background: "#2D6A4F", color: "white" }}>
                  Hablar con ventas
                </Link>
              </div>
            </div>

          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-xs" style={{ color: "#9CA3AF" }}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Datos protegidos bajo ley 25.326
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Cobro en ARS vía MercadoPago
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Soporte en español · mismo huso horario
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-semibold text-center uppercase tracking-widest mb-2" style={{ color: "#2D6A4F" }}>Lo que dicen los profesionales</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>
            Confiado por psicólogos de Argentina
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { texto: "El resumen con IA me ahorra 20 minutos por consulta. Puedo enfocarme 100% en el paciente durante la sesión.", nombre: "Lic. Valentina M.", rol: "Psicóloga clínica · CABA" },
              { texto: "Antes usaba tres apps distintas. Con Mentalia tengo videollamada, historia clínica y cobros en un solo lugar.", nombre: "Lic. Sebastián R.", rol: "Psicólogo · Rosario" },
              { texto: "La detección de nivel de riesgo me ayudó a tomar decisiones más rápido en casos urgentes. Muy valiosa.", nombre: "Lic. Camila F.", rol: "Psicóloga infanto-juvenil · Córdoba" },
            ].map(t => (
              <div key={t.nombre} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5" style={{ color: "#2D6A4F" }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>&ldquo;{t.texto}&rdquo;</p>
                <p className="text-xs font-semibold" style={{ color: "#2D6A4F" }}>{t.nombre}</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{t.rol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 border-t border-gray-100" style={{ background: "#2D6A4F" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "white" }}>
            Tu consultorio digital te espera
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(216,243,220,0.8)" }}>
            Unite a los psicólogos que ya gestionan su práctica con Mentalia. 10 días gratis, sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro" className="text-sm px-8 py-3.5 rounded-xl font-semibold transition hover:opacity-90" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
              Crear cuenta gratis
            </Link>
            <Link href="/login" className="text-sm px-8 py-3.5 rounded-xl font-semibold transition border" style={{ borderColor: "rgba(216,243,220,0.3)", color: "rgba(216,243,220,0.9)" }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8" style={{ borderColor: "rgba(45,106,79,0.15)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-base font-bold italic" style={{ fontFamily: "Georgia, serif", color: "#2D6A4F" }}>Mentalia</span>
          <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} Mentalia · Plataforma de salud mental · Argentina
          </p>
          <div className="flex gap-5 text-xs" style={{ color: "#9CA3AF" }}>
            <Link href="/privacidad" className="hover:text-[#2D6A4F] transition">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#2D6A4F] transition">Términos</Link>
            <Link href="/login" className="hover:text-[#2D6A4F] transition">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
