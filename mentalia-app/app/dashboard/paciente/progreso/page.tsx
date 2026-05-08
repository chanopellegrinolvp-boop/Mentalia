import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const moodColors: Record<number, string> = {
  1: "#ef4444", 2: "#f97316", 3: "#f59e0b", 4: "#eab308", 5: "#84cc16",
  6: "#22c55e", 7: "#10b981", 8: "#14b8a6", 9: "#06b6d4", 10: "#2D6A4F",
};
const moodLabels: Record<number, string> = {
  1: "Muy mal", 2: "Mal", 3: "Regular", 4: "Un poco mal", 5: "Neutral",
  6: "Bien", 7: "Bastante bien", 8: "Muy bien", 9: "Excelente", 10: "Increíble",
};

export default async function ProgresoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entries } = await supabase
    .from("emotional_diary")
    .select("date, mood, emotions")
    .eq("patient_id", user.id)
    .order("date", { ascending: true })
    .limit(60);

  const { data: appointments } = await supabase
    .from("appointments")
    .select("scheduled_at, status")
    .eq("patient_id", user.id)
    .order("scheduled_at", { ascending: false });

  const diaryEntries = (entries ?? []) as { date: string; mood: number; emotions: string[] }[];
  const last7 = diaryEntries.slice(-7);
  const last30 = diaryEntries.slice(-30);

  const avg = (arr: number[]) => arr.length ? Math.round((arr.reduce((s, n) => s + n, 0) / arr.length) * 10) / 10 : 0;
  const avgLast7 = avg(last7.map(e => e.mood));
  const avgLast30 = avg(last30.map(e => e.mood));

  // Emotion frequency
  const emotionCount: Record<string, number> = {};
  diaryEntries.forEach(e => (e.emotions ?? []).forEach((em: string) => {
    emotionCount[em] = (emotionCount[em] ?? 0) + 1;
  }));
  const topEmotions = Object.entries(emotionCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Weekly breakdown (last 4 weeks)
  const weeks: { label: string; avg: number; count: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const start = new Date();
    start.setDate(start.getDate() - (w + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    const weekEntries = diaryEntries.filter(e => e.date >= startStr && e.date < endStr);
    const weekLabel = w === 0 ? "Esta semana" : w === 1 ? "Semana pasada" : `Hace ${w * 7} días`;
    weeks.push({ label: weekLabel, avg: avg(weekEntries.map(e => e.mood)), count: weekEntries.length });
  }

  const completedSessions = (appointments ?? []).filter((a: any) => a.status === "completed").length;
  const totalSessions = (appointments ?? []).length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi progreso</h1>
        <p className="text-gris text-sm mt-1">Seguimiento de tu bienestar emocional</p>
      </div>

      {diaryEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="font-bold text-gray-900 mb-2">Aún no hay datos</h3>
          <p className="text-sm text-gris mb-5">Completá el diario emocional cada día para ver tu progreso aquí</p>
          <a href="/dashboard/paciente/diario" className="inline-block px-6 py-2.5 text-white text-sm font-semibold rounded-xl" style={{ background: "#2D6A4F" }}>
            Ir al diario emocional →
          </a>
        </div>
      ) : (
        <>
          {/* Stats principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: moodColors[Math.round(avgLast7)] ?? "#2D6A4F" }}>{avgLast7}/10</div>
              <div className="text-xs text-gris mt-1">Promedio 7 días</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: moodColors[Math.round(avgLast30)] ?? "#2D6A4F" }}>{avgLast30}/10</div>
              <div className="text-xs text-gris mt-1">Promedio 30 días</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{diaryEntries.length}</div>
              <div className="text-xs text-gris mt-1">Registros en diario</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{completedSessions}</div>
              <div className="text-xs text-gris mt-1">Sesiones completadas</div>
            </div>
          </div>

          {/* Gráfico de barras — 30 días */}
          {last30.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Estado emocional — últimos 30 días</h2>
              <div className="flex items-end gap-1 h-24">
                {last30.map((e, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${Math.max(e.mood * 10, 5)}%`,
                      background: moodColors[e.mood] ?? "#52B788",
                      opacity: 0.8,
                      minHeight: 3,
                    }}
                    title={`${e.date}: ${e.mood}/10 — ${moodLabels[e.mood]}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gris mt-2">
                <span>{last30[0]?.date}</span>
                <span>Hoy</span>
              </div>
            </div>
          )}

          {/* Desglose semanal */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Tendencia semanal</h2>
            <div className="space-y-3">
              {weeks.map((week, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-28 text-xs text-gris flex-shrink-0">{week.label}</div>
                  {week.count === 0 ? (
                    <div className="flex-1 text-xs text-gray-300">Sin registros</div>
                  ) : (
                    <>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{ width: `${week.avg * 10}%`, background: moodColors[Math.round(week.avg)] ?? "#52B788" }}
                        />
                      </div>
                      <div className="w-12 text-xs font-bold text-right flex-shrink-0" style={{ color: moodColors[Math.round(week.avg)] ?? "#2D6A4F" }}>
                        {week.avg}/10
                      </div>
                      <div className="w-16 text-xs text-gris flex-shrink-0">{week.count} reg.</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emociones más frecuentes */}
          {topEmotions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Emociones más frecuentes</h2>
              <div className="space-y-2">
                {topEmotions.map(([emotion, count]) => (
                  <div key={emotion} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-700 truncate">{emotion}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${(count / (topEmotions[0]?.[1] ?? 1)) * 100}%`, background: "#52B788" }}
                      />
                    </div>
                    <div className="w-8 text-xs text-gris text-right">{count}x</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado actual */}
          {avgLast7 > 0 && (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: `${moodColors[Math.round(avgLast7)]}15`, border: `1px solid ${moodColors[Math.round(avgLast7)]}30` }}
            >
              <p className="text-sm font-medium text-gray-700">Estado general esta semana</p>
              <p className="text-2xl font-bold mt-1" style={{ color: moodColors[Math.round(avgLast7)] }}>
                {moodLabels[Math.round(avgLast7)]}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
