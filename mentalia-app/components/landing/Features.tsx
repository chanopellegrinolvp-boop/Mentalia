const features = [
  { icon: "🗓️", title: "Agenda inteligente", desc: "Tus pacientes reservan solos, vos confirmás con un click. Recordatorios automáticos por email y SMS.", ai: false },
  { icon: "💳", title: "Cobros automáticos", desc: "MercadoPago integrado. Cobro previo a la sesión, sin perseguir a nadie. Historial y facturas incluidas.", ai: false },
  { icon: "🎥", title: "Videollamada integrada", desc: "Cifrada y segura, sin instalar Zoom. La sesión ocurre dentro de Mentalia, con el historial del paciente al lado.", ai: false },
  { icon: "📋", title: "Historia clínica digital", desc: "Notas de sesión organizadas, seguras y accesibles desde cualquier dispositivo. Solo vos las ves.", ai: false },
  { icon: "🧠", title: "Resumen semanal del paciente", desc: "Recibís un resumen con el estado emocional de la semana antes de cada sesión. Llegás preparado.", ai: true },
  { icon: "🔔", title: "Detección de riesgo emocional", desc: "Alertas tempranas cuando el diario emocional del paciente muestra señales de atención urgente.", ai: true },
];

export default function Features() {
  return (
    <section className="bg-blanco py-20 px-6" id="funciones">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-georgia italic text-3xl md:text-4xl font-bold text-center mb-4 fade-in" style={{ color: "#2D6A4F" }}>
          Todo lo que necesitás, potenciado con IA
        </h2>
        <p className="text-center text-gris mb-14 fade-in">
          Una plataforma completa. Sin apps extra. Sin Zoom. Sin cuentas bancarias separadas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bg-white border border-gray-100 rounded-2xl p-6 card-hover fade-in fade-in-delay-${(i % 3) + 1} relative overflow-hidden`}
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              {f.ai && (
                <div className="absolute top-0 right-0 bg-verde-oscuro text-white text-xs font-bold px-3 py-1 rounded-bl-xl">IA</div>
              )}
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gris text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature destacada */}
        <div className="flex justify-center mt-6 fade-in">
          <div
            className="bg-white border-2 border-verde-claro rounded-2xl p-7 card-hover relative overflow-hidden w-full"
            style={{ maxWidth: 560, boxShadow: "0 4px 20px rgba(45,106,79,0.12)" }}
          >
            <div className="absolute top-0 right-0 bg-verde-oscuro text-white text-xs font-bold px-3 py-1 rounded-bl-xl">NUEVO · IA</div>
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Seguimiento semanal con IA</h3>
            <p className="text-gris text-sm leading-relaxed mb-5">
              La IA consolida el diario emocional, las actividades completadas y los juegos asignados por el profesional en un informe semanal de acompañamiento, entregado antes de cada sesión.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Resumen automático del estado emocional del paciente",
                "Registro de actividades completadas y adherencia al proceso",
                "Juegos y tareas que el profesional autoriza desde su panel",
                "Alertas automáticas si el paciente no realizó las tareas asignadas",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-verde-oscuro mt-0.5 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm text-gris mt-10 fade-in">
          * Las funciones con IA están disponibles en los planes <strong>Pro</strong> y <strong>Clínica</strong>.
        </p>
      </div>
    </section>
  );
}
