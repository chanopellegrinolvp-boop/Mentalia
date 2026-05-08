export default function CTAFinal() {
  return (
    <section className="bg-verde-oscuro py-20 px-6" style={{ position: "relative", overflow: "hidden" }}>
      <img
        src="/logo_mentalia.svg"
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 680, opacity: 0.06, pointerEvents: "none", userSelect: "none", filter: "brightness(10)" }}
      />
      <div className="max-w-3xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="font-georgia italic text-3xl md:text-5xl font-bold text-white mb-4 fade-in">
          Empezá hoy.<br />10 días gratis, sin tarjeta.
        </h2>
        <p className="text-verde-claro text-lg mb-10 fade-in fade-in-delay-1">
          Más de 200 psicólogos/as ya organizaron su consulta con Mentalia.<br />
          Configuración en menos de 10 minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in fade-in-delay-2">
          <a
            href="/registro"
            className="bg-white text-verde-oscuro font-bold text-lg px-10 py-4 rounded-xl hover:bg-verde-claro transition-all hover:shadow-xl hover:-translate-y-0.5 transform"
          >
            Crear mi cuenta gratis →
          </a>
          <a href="#demo" className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
            Ver demo primero
          </a>
        </div>

        <p className="text-verde-claro/60 text-sm mt-8 fade-in">
          Sin tarjeta de crédito · Cancelás cuando querés · Soporte en español, italiano e inglés
        </p>
      </div>
    </section>
  );
}
