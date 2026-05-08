export default function Hero() {
  return (
    <section className="hero-bg pb-20 px-6" style={{ position: "relative", overflow: "hidden", paddingTop: 130 }}>
      <img
        src="/logo_mentalia.svg"
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", right: -80, top: "50%", transform: "translateY(-50%)", width: 520, opacity: 0.07, pointerEvents: "none", userSelect: "none" }}
      />
      <div className="max-w-4xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
        <div className="inline-flex items-center gap-2 bg-white border border-verde-claro rounded-full px-4 py-1.5 mb-8 shadow-sm fade-in">
          <div className="pulse-dot"></div>
          <span className="text-sm text-verde-oscuro font-medium">+200 profesionales ya usan Mentalia</span>
        </div>

        <h1 className="font-georgia italic text-3xl md:text-5xl font-bold leading-tight mb-6 fade-in fade-in-delay-1" style={{ color: "#2D6A4F" }}>
          La plataforma que organiza<br />tu consultorio y potencia<br />tu práctica con IA
        </h1>

        <p className="text-lg md:text-xl text-gris max-w-2xl mx-auto mb-10 leading-relaxed fade-in fade-in-delay-2">
          Gestión clínica, cobros automatizados, videoconsultas e inteligencia artificial integrados en una sola plataforma.<br />
          <span className="text-gray-600">Diseñada para profesionales de la salud mental que priorizan el vínculo terapéutico sobre la administración.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in fade-in-delay-3">
          <a href="/registro" className="bg-verde-oscuro text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-opacity-90 transition-all hover:shadow-xl hover:-translate-y-0.5 transform">
            Empezar 10 días gratis
            <span className="block text-xs font-normal opacity-75 mt-0.5">Sin tarjeta de crédito</span>
          </a>
          <a href="/api/demo/login" className="border-2 border-verde-oscuro text-verde-oscuro font-semibold px-8 py-4 rounded-xl text-base hover:bg-verde-claro transition-all">
            Ver demo →
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gris fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-verde-oscuro" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Agenda, cobros e historia clínica integrados</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-verde-oscuro" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Datos clínicos cifrados y seguros</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-verde-oscuro" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
            </svg>
            <span>Soporte dedicado en español</span>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-3xl mx-auto">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 ml-4 text-xs text-gray-400 text-center">mentalia.com.ar/dashboard</div>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-verde-claro rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-verde-oscuro">24</div>
                  <div className="text-xs text-verde-oscuro mt-1">Sesiones este mes</div>
                </div>
                <div className="bg-verde-claro rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-verde-oscuro">$89.600</div>
                  <div className="text-xs text-verde-oscuro mt-1">Cobrado (ARS)</div>
                </div>
                <div className="bg-verde-claro rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-verde-oscuro">18</div>
                  <div className="text-xs text-verde-oscuro mt-1">Pacientes activos</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gris uppercase tracking-wide mb-3">Próximas sesiones hoy</div>
                <div className="flex items-center gap-3 bg-verde-claro/40 rounded-lg px-4 py-3">
                  <div className="w-8 h-8 bg-verde-oscuro rounded-full flex items-center justify-center text-white text-xs font-bold">VM</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">Valentina M.</div>
                    <div className="text-xs text-gris">14:00 — 55 min · Pagado ✓</div>
                  </div>
                  <span className="text-xs bg-verde-oscuro text-white px-2 py-1 rounded-full">IA lista</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">MR</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">Marcos R.</div>
                    <div className="text-xs text-gris">16:30 — 55 min · Pagado ✓</div>
                  </div>
                  <span className="text-xs bg-gray-200 text-gris px-2 py-1 rounded-full">En 2h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
