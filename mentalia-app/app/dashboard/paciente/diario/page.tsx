"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const emociones = ["😊 Alegría", "😔 Tristeza", "😰 Ansiedad", "😡 Enojo", "😴 Agotamiento", "🤗 Gratitud", "😕 Confusión", "💪 Motivación", "😌 Calma", "😟 Miedo"];

const moodColors: Record<number, string> = {
  1: "#ef4444", 2: "#f97316", 3: "#f59e0b", 4: "#eab308", 5: "#84cc16",
  6: "#22c55e", 7: "#10b981", 8: "#14b8a6", 9: "#06b6d4", 10: "#2D6A4F",
};
const moodLabels: Record<number, string> = {
  1: "Muy mal", 2: "Mal", 3: "Regular", 4: "Un poco mal", 5: "Neutral",
  6: "Bien", 7: "Bastante bien", 8: "Muy bien", 9: "Excelente", 10: "Increíble",
};

type Entry = { id: string; date: string; mood: number; note: string; emotions: string[] };

export default function DiarioPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], mood: 5, note: "", emotions: [] as string[] });
  const supabase = createClient();

  useEffect(() => { loadEntries(); }, []);

  async function loadEntries() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("emotional_diary").select("*").eq("patient_id", user.id).order("date", { ascending: false }).limit(30);
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("emotional_diary").insert({ patient_id: user.id, date: form.date, mood: form.mood, note: form.note.trim(), emotions: form.emotions });
    setSaving(false);
    setShowForm(false);
    setForm({ date: new Date().toISOString().split("T")[0], mood: 5, note: "", emotions: [] });
    loadEntries();
  }

  function toggleEmocion(e: string) {
    setForm(f => ({ ...f, emotions: f.emotions.includes(e) ? f.emotions.filter(x => x !== e) : [...f.emotions, e] }));
  }

  const avgMood = entries.length ? Math.round(entries.slice(0, 7).reduce((s, e) => s + e.mood, 0) / Math.min(entries.length, 7)) : null;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diario emocional</h1>
          <p className="text-gris text-sm mt-1">Registrá cómo te sentís cada día</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl" style={{ background: "#2D6A4F" }}>
          + Nuevo registro
        </button>
      </div>

      {avgMood && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: moodColors[avgMood] }}>{avgMood}/10</div>
            <div className="text-xs text-gris mt-1">Promedio últimos 7 días</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{entries.length}</div>
            <div className="text-xs text-gris mt-1">Registros totales</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: moodColors[avgMood] }}>{moodLabels[avgMood]}</div>
            <div className="text-xs text-gris mt-1">Estado general</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">¿Cómo te sentís hoy?</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estado de ánimo: <span className="font-bold" style={{ color: moodColors[form.mood] }}>{form.mood}/10 — {moodLabels[form.mood]}</span>
              </label>
              <input type="range" min="1" max="10" value={form.mood} onChange={e => setForm(f => ({ ...f, mood: Number(e.target.value) }))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{ accentColor: moodColors[form.mood] }} />
              <div className="flex justify-between text-xs text-gris mt-1"><span>Muy mal</span><span>Increíble</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué emociones sentís? (elegí las que apliquen)</label>
              <div className="flex flex-wrap gap-2">
                {emociones.map(e => (
                  <button key={e} type="button" onClick={() => toggleEmocion(e)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2"
                    style={{ borderColor: form.emotions.includes(e) ? "#2D6A4F" : "#e5e7eb", background: form.emotions.includes(e) ? "#D8F3DC" : "white", color: form.emotions.includes(e) ? "#2D6A4F" : "#6B7280" }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">¿Algo que quieras anotar? (opcional)</label>
              <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={3}
                placeholder="Contá cómo fue tu día, qué pensaste, qué sentiste..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" style={{ resize: "vertical" }}
                onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 text-white font-semibold rounded-xl disabled:opacity-60" style={{ background: "#2D6A4F" }}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#2D6A4F" }} /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📔</div>
          <p className="font-semibold text-gray-800 mb-1">Tu diario está vacío</p>
          <p className="text-sm text-gris mb-4">Empezá registrando cómo te sentís hoy</p>
          <button onClick={() => setShowForm(true)} className="inline-block px-5 py-2.5 text-white text-sm font-semibold rounded-xl" style={{ background: "#2D6A4F" }}>
            Primer registro
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: moodColors[entry.mood] }}>
                  {entry.mood}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{new Date(entry.date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
                  <p className="text-xs" style={{ color: moodColors[entry.mood] }}>{moodLabels[entry.mood]}</p>
                </div>
              </div>
              {entry.emotions?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {entry.emotions.map((em, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>{em}</span>)}
                </div>
              )}
              {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
