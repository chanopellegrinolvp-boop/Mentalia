type PlanItem = { ok: boolean; text: string; bold?: boolean; ai?: boolean };
type Plan = { name: string; price: string; period: string; ars: string; featured: boolean; badge?: string; items: PlanItem[]; cta: string; ctaStyle: string };

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$15",
    period: "USD/mes",
    ars: "≈ $21.000 ARS/mes",
    featured: false,
    items: [
      { ok: true, text: "Agenda online" },
      { ok: true, text: "Cobros MercadoPago" },
      { ok: true, text: "Video integrado" },
      { ok: true, text: "Hasta 15 pacientes" },
      { ok: true, text: "Recordatorios automáticos" },
      { ok: false, text: "Sin historia clínica" },
      { ok: false, text: "Sin funciones de IA" },
      { ok: false, text: "Sin perfil verificado" },
    ],
    cta: "Empezar gratis 10 días",
    ctaStyle: "border",
  },
  {
    name: "Pro",
    price: "$32",
    period: "USD/mes",
    ars: "≈ $44.800 ARS/mes",
    featured: true,
    badge: "⭐ Más elegido",
    items: [
      { ok: true, text: "Todo Starter", bold: true },
      { ok: true, text: "Pacientes ilimitados" },
      { ok: true, text: "Historia clínica digital" },
      { ok: true, text: "Notas de sesión con IA", ai: true },
      { ok: true, text: "Resumen semanal con IA", ai: true },
      { ok: true, text: "Detección de riesgo", ai: true },
      { ok: true, text: "Perfil verificado en directorio" },
      { ok: true, text: "Estadísticas de adherencia" },
    ],
    cta: "Empezar gratis 10 días",
    ctaStyle: "dark",
  },
  {
    name: "Clínica",
    price: "$75",
    period: "USD/mes",
    ars: "≈ $105.000 ARS/mes",
    featured: false,
    items: [
      { ok: true, text: "Todo Pro", bold: true },
      { ok: true, text: "Hasta 8 profesionales" },
      { ok: true, text: "Panel de supervisión clínica" },
      { ok: true, text: "IA para el paciente entre sesiones" },
      { ok: true, text: "Branding propio" },
      { ok: true, text: "Soporte 24/7" },
      { ok: true, text: "API para sistemas propios" },
      { ok: true, text: "Facturación unificada" },
    ],
    cta: "Hablar con ventas →",
    ctaStyle: "border",
  },
];

export default function Pricing() {
  return (
    <section className="bg-gray-50 py-20 px-6" id="precios">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-georgia italic text-3xl md:text-4xl font-bold text-center mb-3 fade-in" style={{ color: "#2D6A4F" }}>
          Elegí tu plan
        </h2>
        <p className="text-center text-gris mb-4 fade-in">10 días gratis, sin tarjeta de crédito. Cancelás cuando quieras.</p>

        <div className="flex justify-center mb-12 fade-in">
          <div className="bg-verde-claro text-verde-oscuro text-sm font-semibold px-5 py-2 rounded-full border border-verde-oscuro/20">
            🎉 Trial gratuito disponible en todos los planes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-7 ${plan.featured ? "plan-pro relative" : "border border-gray-200"} fade-in fade-in-delay-${i + 1}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-verde-oscuro text-white text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className={`mb-6 ${plan.featured ? "pt-2" : ""}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-3xl font-bold ${plan.featured ? "text-verde-oscuro" : "text-gray-900"}`}>{plan.price}</span>
                  <span className="text-gris text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-gris">{plan.ars}</p>
              </div>

              <ul className="space-y-2.5 mb-8 text-sm">
                {plan.items.map((item, j) => (
                  <li key={j} className={`flex items-center gap-2 ${item.ok ? "text-gray-700" : "text-gray-400"}`}>
                    <span className={item.ok ? "text-verde-oscuro font-bold" : ""}>{item.ok ? "✓" : "✗"}</span>
                    {item.bold ? <strong>{item.text}</strong> : item.text}
                    {item.ai && <span className="badge-ia">IA</span>}
                  </li>
                ))}
              </ul>

              <a
                href="/registro"
                className={`block text-center font-semibold py-3 rounded-xl transition-all ${
                  plan.ctaStyle === "dark"
                    ? "bg-gray-900 text-white font-bold py-3.5 hover:bg-verde-oscuro hover:shadow-lg"
                    : "border-2 border-gray-300 text-gray-700 hover:border-verde-oscuro hover:text-verde-oscuro"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
