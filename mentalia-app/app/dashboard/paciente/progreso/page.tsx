import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MiProgreso() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const { count: totalSesiones } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user.id)
    .eq("status", "completed");

  const { count: sesionesMes } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user.id)
    .eq("status", "completed")
    .gte("scheduled_at", inicioMes);

  const { data: entradas } = await supabase
    .from("emotional_diary")
    .select("mood, date")
    .eq("patient_id", user.id)
    .order("date", { ascending: false })
    .limit(30);

  const { count: totalDiario } = await supabase
    .from("emotional_diary")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user.id);

  const avgMood = entradas && entradas.length > 0
    ? (entradas.reduce((acc, e) => acc + e.mood, 0) / entradas.length).toFixed(1)
    : null;

  const moodEmoji = (m: number) => {
    if (m >= 8) return "😊";
    if (m >= 6) return "🙂";
    if (m >= 4) return "😐";
    return "😔";
  };

  // Últimos 7 días de diario para mini chart
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ahora);
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const entrada = entradas?.find(e => e.date === key);
    return { key, mood: entrada?.mood ?? null, label: d.toLocaleDateString("es-AR", { weekday: "short" }) };
  });

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Mi Progreso</h1>
          <p className="text-xs text-gray-400 mt-0.5">Tu evolución en Mentalia</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#40916C]">{totalSesiones ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Sesiones completadas</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#40916C]">{sesionesMes ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Sesiones este mes</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#40916C]">
              {avgMood ? `${moodEmoji(Number(avgMood))} ${avgMood}` : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Estado promedio</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#40916C]">{totalDiario ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Días en el diario</p>
          </div>
        </div>

        {/* Mini chart últimos 7 días */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Estado emocional — última semana</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            {entradas && entradas.length > 0 ? (
              <div className="flex items-end justify-between gap-2 h-24">
                {ultimos7.map(({ key, mood, label }) => (
                  <div key={key} className="flex flex-col items-center flex-1 gap-1">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: mood ? `${(mood / 10) * 80}px` : "4px",
                        background: mood ? "#40916C" : "#e5e7eb",
                        opacity: mood ? 0.8 : 0.4,
                      }}
                    />
                    <span className="text-xs text-gray-400">{label}</span>
                    {mood && <span className="text-xs font-medium text-[#40916C]">{mood}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">Registrá tu estado emocional para ver la evolución</p>
                <Link href="/dashboard/paciente/diario" className="inline-block mt-2 text-sm text-[#40916C] font-medium hover:underline">
                  Ir al diario
                </Link>
              </div>
            )}
          </div>
        </section>

        {(totalSesiones === 0 && (totalDiario ?? 0) === 0) && (
          <div className="bg-[#D8F3DC] rounded-xl p-5 text-center">
            <p className="font-medium text-[#40916C] text-sm">Empezá tu proceso</p>
            <p className="text-xs text-[#40916C]/70 mt-1">Agendá tu primera sesión y comenzá tu diario emocional</p>
            <div className="flex gap-3 justify-center mt-3">
              <Link href="/dashboard/paciente/buscar" className="text-xs bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition">
                Buscar profesional
              </Link>
              <Link href="/dashboard/paciente/diario" className="text-xs bg-white text-[#40916C] px-4 py-2 rounded-lg hover:bg-white/80 transition">
                Mi diario
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
