import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Estadisticas() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1).toISOString();
  const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).toISOString();

  const [
    { count: totalPacientes },
    { count: sesionesMes },
    { count: sesionesCompletadasMes },
    { count: totalSesionesHistorico },
    { data: ingresosMes },
  ] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }).eq("profesional_id", user.id).eq("activo", true),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("professional_id", user.id).gte("scheduled_at", inicioMes),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("professional_id", user.id).eq("status", "completed").gte("scheduled_at", inicioMes),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("professional_id", user.id).eq("status", "completed"),
    supabase.from("payments").select("amount").eq("professional_id", user.id).eq("status", "paid").gte("paid_at", inicioMes),
  ]);

  const ingresosMesTotal = ingresosMes?.reduce((acc, p) => acc + Number(p.amount), 0) ?? 0;
  const tasaCompletado = sesionesMes ? Math.round(((sesionesCompletadasMes ?? 0) / sesionesMes) * 100) : 0;

  const stats = [
    { label: "Pacientes activos", valor: String(totalPacientes ?? 0), sub: "en tu consultorio" },
    { label: "Sesiones este mes", valor: String(sesionesMes ?? 0), sub: `${sesionesCompletadasMes ?? 0} completadas` },
    { label: "Tasa de completado", valor: `${tasaCompletado}%`, sub: "este mes" },
    { label: "Total sesiones", valor: String(totalSesionesHistorico ?? 0), sub: "histórico" },
    { label: "Ingresos este mes", valor: ingresosMesTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }), sub: "cobrados" },
  ];

  // Sesiones por día este mes
  const { data: sesionesDia } = await supabase
    .from("appointments")
    .select("scheduled_at, status")
    .eq("professional_id", user.id)
    .gte("scheduled_at", inicioMes)
    .lte("scheduled_at", ahora.toISOString())
    .order("scheduled_at");

  const diasDelMes = ahora.getDate();
  const porDia: Record<string, number> = {};
  sesionesDia?.forEach(s => {
    const d = new Date(s.scheduled_at).getDate().toString();
    porDia[d] = (porDia[d] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-semibold text-gray-900">Estadísticas</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {ahora.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-2xl font-bold text-[#40916C]">{s.valor}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Actividad del mes */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Actividad — {ahora.toLocaleDateString("es-AR", { month: "long" })}</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            {diasDelMes > 0 ? (
              <div className="flex items-end gap-1 h-20 overflow-x-auto pb-2">
                {Array.from({ length: diasDelMes }, (_, i) => {
                  const dia = String(i + 1);
                  const cnt = porDia[dia] ?? 0;
                  const maxVal = Math.max(...Object.values(porDia), 1);
                  return (
                    <div key={dia} className="flex flex-col items-center flex-1 min-w-[18px]">
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: cnt > 0 ? `${(cnt / maxVal) * 56}px` : "4px",
                          background: cnt > 0 ? "#40916C" : "#e5e7eb",
                        }}
                        title={`Día ${dia}: ${cnt} sesión${cnt !== 1 ? "es" : ""}`}
                      />
                      {(i + 1) % 5 === 0 && <span className="text-xs text-gray-300 mt-1">{i + 1}</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Sin actividad registrada este mes</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
