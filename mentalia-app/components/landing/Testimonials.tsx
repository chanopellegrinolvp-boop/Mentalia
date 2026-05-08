const pros = [
  { initials: "VM", name: "Lic. Valeria M.", role: "Psicóloga clínica · CABA", badge: "Psicóloga clínica", quote: "Desde que uso Mentalia no persigo más una transferencia. Todo llega solo antes de la sesión. Cambió completamente mi forma de trabajar." },
  { initials: "MR", name: "Lic. Marcos R.", role: "Psicólogo · Córdoba", badge: "Psicólogo", quote: "El resumen semanal de la IA me ayuda a llegar a cada sesión mucho mejor preparado. Ya no arranco desde cero recordando qué pasó la semana anterior." },
  { initials: "AC", name: "Lic. Andrea C.", role: "Psicóloga · Rosario", badge: "Psicóloga", quote: "Por fin tengo toda mi agenda, cobros e historia clínica en un solo lugar. Le recomendé Mentalia a todos mis colegas del grupo de supervisión." },
];

const patients = [
  { initials: "SB", name: "Santiago B.", role: "Paciente · Buenos Aires", quote: "En 5 minutos el quiz me mostró tres psicólogas que se adaptaban a lo que necesitaba. Elegí, pagué y listo. Nunca fue tan fácil pedir ayuda." },
  { initials: "LF", name: "Lucía F.", role: "Paciente · Mendoza", quote: "El diario emocional y los juegos que me manda mi psicóloga entre sesiones me ayudan un montón. Siento que el proceso no para cuando termina la hora." },
  { initials: "TG", name: "Tomás G.", role: "Paciente · Córdoba", quote: "Venía de viajar dos horas para ir al consultorio. Con Mentalia la sesión es desde casa, con la misma calidad. No volvería a hacerlo de otra manera." },
];

function TestimonialCard({ initials, name, role, badge, quote, color }: { initials: string; name: string; role: string; badge?: string; quote: string; color: string }) {
  return (
    <div className="testimonial-card fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-yellow-400">★★★★★</span>
        {badge && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>{badge}</span>
        )}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #f0f0f0" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: color }}>
          {initials}
        </div>
        <div>
          <div className="font-semibold text-sm text-gray-900">{name}</div>
          <div className="text-xs text-gris">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 px-6" style={{ background: "#f8faf9", position: "relative", overflow: "hidden" }}>
      <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        <div className="text-center mb-6 fade-in">
          <h2 className="font-georgia italic text-3xl md:text-4xl font-bold mb-3" style={{ color: "#2D6A4F" }}>
            Lo que dicen quienes usan Mentalia
          </h2>
          <p className="text-gris">Profesionales y pacientes comparten su experiencia real</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 fade-in fade-in-delay-1">
          {[
            { value: "4.9 / 5", sub: "★★★★★", label: "Valoración media de la plataforma", stars: true },
            { value: "+200", sub: "Psicólogos/as activos/as", label: "En toda Argentina" },
            { value: "+1.200", sub: "Sesiones por mes", label: "Y creciendo cada semana" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: "0 2px 12px rgba(45,106,79,0.08)", border: "1px solid rgba(45,106,79,0.08)" }}>
              <div className="font-georgia italic text-3xl font-bold text-verde-oscuro mb-1">{stat.value}</div>
              <div className={`${stat.stars ? "text-yellow-400 text-base" : "text-sm font-semibold text-gray-700"} mb-1`}>{stat.sub}</div>
              <div className="text-xs text-gris">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profesionales */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-7 fade-in">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full" style={{ background: "#2D6A4F", color: "white", whiteSpace: "nowrap" }}>
              🩺 Profesionales de la salud
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(45,106,79,0.15)" }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pros.map((p) => <TestimonialCard key={p.initials} {...p} color="#2D6A4F" />)}
          </div>
        </div>

        {/* Pacientes */}
        <div>
          <div className="flex items-center gap-4 mb-7 fade-in">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full" style={{ background: "#52B788", color: "white", whiteSpace: "nowrap" }}>
              💬 Pacientes
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(82,183,136,0.25)" }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {patients.map((p) => <TestimonialCard key={p.initials} {...p} badge="Paciente" color="#52B788" />)}
          </div>
        </div>
      </div>
    </section>
  );
}
