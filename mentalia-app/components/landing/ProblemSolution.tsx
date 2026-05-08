const problems = [
  {
    icon: "💸",
    problem: "Perseguís transferencias",
    solution: "Cobros automáticos antes de cada sesión. El turno no se confirma si no se paga.",
  },
  {
    icon: "📱",
    problem: "Coordinás turnos por WhatsApp",
    solution: "Agenda online que tus pacientes reservan solos, 24/7, sin interrumpirte.",
  },
  {
    icon: "⏰",
    problem: "Perdés horas en administración",
    solution: "IA que resume, toma notas y detecta patrones. Vos solo cerrás la sesión.",
  },
];

export default function ProblemSolution() {
  return (
    <section className="bg-verde-claro py-20 px-6" id="problema" style={{ position: "relative", overflow: "hidden" }}>
      <img src="/logo_mentalia.svg" alt="" aria-hidden="true" style={{ position: "absolute", left: -100, bottom: -40, width: 420, opacity: 0.09, pointerEvents: "none", userSelect: "none" }} />
      <div className="max-w-5xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="font-georgia italic text-3xl md:text-4xl font-bold text-center mb-4 fade-in" style={{ color: "#2D6A4F" }}>
          ¿Te suena esto?
        </h2>
        <p className="text-center text-gris mb-14 fade-in">
          Identificamos los principales obstáculos que enfrenta el profesional de salud mental en su práctica diaria.<br />
          Mentalia fue diseñada específicamente para eliminarlos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-7 card-hover fade-in fade-in-delay-${i + 1}`}>
              <div className="w-14 h-14 bg-verde-claro rounded-2xl flex items-center justify-center mb-5 text-3xl">{item.icon}</div>
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">El problema</div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">{item.problem}</h3>
              <div className="border-t border-verde-claro my-4"></div>
              <div className="text-xs font-bold text-verde-oscuro uppercase tracking-wider mb-2">La solución</div>
              <p className="text-gris text-sm leading-relaxed">{item.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
