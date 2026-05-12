import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DiarioForm from "./DiarioForm";

export default async function DiarioEmocional() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entradas } = await supabase
    .from("emotional_diary")
    .select("id, date, mood, note, emotions")
    .eq("patient_id", user.id)
    .order("date", { ascending: false })
    .limit(30);

  const moodEmoji = (m: number) => {
    if (m >= 9) return "😄";
    if (m >= 7) return "😊";
    if (m >= 5) return "🙂";
    if (m >= 3) return "😔";
    return "😢";
  };

  const hoy = new Date().toISOString().split("T")[0];
  const tieneHoy = entradas?.some(e => e.date === hoy);

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Diario emocional</h1>
          <p className="text-xs text-gray-400 mt-0.5">Registrá cómo te sentís cada día</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {!tieneHoy && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Registro de hoy</h2>
            <DiarioForm />
          </section>
        )}

        {entradas && entradas.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {tieneHoy ? "Tu registro" : "Historial"}
            </h2>
            <div className="space-y-2">
              {entradas.map((e: any) => (
                <div key={e.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{moodEmoji(e.mood)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(e.date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                          </p>
                          <p className="text-xs text-gray-400">Estado: {e.mood}/10</p>
                        </div>
                      </div>
                      {e.emotions && e.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {e.emotions.map((emo: string) => (
                            <span key={emo} className="text-xs bg-[#D8F3DC] text-[#40916C] px-2 py-0.5 rounded-full">{emo}</span>
                          ))}
                        </div>
                      )}
                      {e.note && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{e.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!entradas || entradas.length === 0) && tieneHoy === false && (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">Empezá registrando cómo te sentís hoy</p>
          </div>
        )}
      </main>
    </div>
  );
}
