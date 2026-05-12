"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const EMOCIONES = [
  "Ansioso/a", "Triste", "Enojado/a", "Asustado/a", "Confundido/a",
  "Calmado/a", "Alegre", "Agradecido/a", "Esperanzado/a", "Frustrado/a",
  "Cansado/a", "Motivado/a",
];

const moodEmoji = (m: number) => {
  if (m >= 9) return "😄";
  if (m >= 7) return "😊";
  if (m >= 5) return "🙂";
  if (m >= 3) return "😔";
  return "😢";
};

export default function DiarioForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mood, setMood] = useState(5);
  const [nota, setNota] = useState("");
  const [emociones, setEmociones] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  const toggleEmocion = (e: string) => {
    setEmociones(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const guardar = async () => {
    setGuardando(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setGuardando(false); return; }

    const hoy = new Date().toISOString().split("T")[0];

    const { error: err } = await supabase
      .from("emotional_diary")
      .upsert({
        patient_id: user.id,
        date: hoy,
        mood,
        note: nota || null,
        emotions: emociones,
      }, { onConflict: "patient_id,date" });

    setGuardando(false);
    if (!err) {
      setGuardado(true);
      router.refresh();
    } else {
      setError("No se pudo guardar. Intentá de nuevo.");
    }
  };

  if (guardado) {
    return (
      <div className="bg-white border border-[#2D6A4F]/20 rounded-xl p-6 text-center">
        <p className="text-2xl mb-2">{moodEmoji(mood)}</p>
        <p className="font-medium text-gray-800">Registro guardado</p>
        <p className="text-sm text-gray-400 mt-1">Estado {mood}/10 · {emociones.length} emoción{emociones.length !== 1 ? "es" : ""}</p>
        <button onClick={() => setGuardado(false)} className="mt-4 text-sm text-[#2D6A4F] hover:underline">
          Editar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">¿Cómo te sentís hoy?</label>
          <span className="text-2xl">{moodEmoji(mood)}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={mood}
          onChange={e => setMood(Number(e.target.value))}
          className="w-full accent-[#2D6A4F]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Muy mal (1)</span>
          <span className="font-medium text-[#2D6A4F]">{mood}/10</span>
          <span>Excelente (10)</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">¿Qué emociones sentís?</label>
        <div className="flex flex-wrap gap-2">
          {EMOCIONES.map(e => (
            <button
              key={e}
              onClick={() => toggleEmocion(e)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                emociones.includes(e)
                  ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#2D6A4F]/40"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Nota libre (opcional)</label>
        <textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="¿Qué pasó hoy? ¿Qué pensaste? ¿Qué sentiste?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#2D6A4F]/50 focus:ring-1 focus:ring-[#2D6A4F]/20"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={guardar}
        disabled={guardando}
        className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#235a41] transition disabled:opacity-60"
      >
        {guardando ? "Guardando..." : "Guardar registro de hoy"}
      </button>
    </div>
  );
}
