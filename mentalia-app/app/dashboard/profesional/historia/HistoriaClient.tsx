"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Patient = { id: string; full_name: string; email: string };
type Note = {
  id: string;
  session_date: string;
  content: string;
  mood_rating: number | null;
  tags: string[];
  created_at: string;
};
type ResumenSemanal = {
  moodTrend: number[];
  topEmociones: string[];
  avgMood: number | null;
  tendencia?: string;
  resumen?: string;
  puntosClave?: string[];
  sugerencias?: string[];
  noData?: boolean;
};

const moodColors: Record<number, string> = {
  1: "#ef4444", 2: "#f97316", 3: "#f59e0b", 4: "#eab308", 5: "#84cc16",
  6: "#22c55e", 7: "#10b981", 8: "#14b8a6", 9: "#06b6d4", 10: "#40916C",
};

const tendenciaConfig = {
  positiva: { bg: "#D8F3DC", color: "#40916C", label: "Tendencia positiva" },
  negativa: { bg: "#fee2e2", color: "#991b1b", label: "Tendencia negativa" },
  estable: { bg: "#f0f9ff", color: "#0369a1", label: "Tendencia estable" },
  mixta: { bg: "#fef3c7", color: "#92400e", label: "Tendencia mixta" },
};

export default function HistoriaClient({ professionalId, patients }: { professionalId: string; patients: Patient[] }) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] ?? null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [iaResumen, setIaResumen] = useState("");
  const [iaRiesgo, setIaRiesgo] = useState<{ nivel: string; mensaje: string } | null>(null);
  const [loadingIa, setLoadingIa] = useState(false);
  const [resumenSemanal, setResumenSemanal] = useState<ResumenSemanal | null>(null);
  const [loadingRS, setLoadingRS] = useState(false);

  const [form, setForm] = useState({
    session_date: new Date().toISOString().split("T")[0],
    content: "",
    mood_rating: 5,
    tags: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (!selectedPatient) return;
    loadNotes(selectedPatient.id);
    setIaResumen("");
    setIaRiesgo(null);
    setResumenSemanal(null);
  }, [selectedPatient]);

  async function loadNotes(patientId: string) {
    setLoadingNotes(true);
    const { data } = await supabase
      .from("session_notes")
      .select("*")
      .eq("professional_id", professionalId)
      .eq("patient_id", patientId)
      .order("session_date", { ascending: false });
    setNotes((data as Note[]) ?? []);
    setLoadingNotes(false);
  }

  function openNew() {
    setEditingNote(null);
    setForm({ session_date: new Date().toISOString().split("T")[0], content: "", mood_rating: 5, tags: "" });
    setShowForm(true);
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setForm({ session_date: note.session_date, content: note.content, mood_rating: note.mood_rating ?? 5, tags: (note.tags ?? []).join(", ") });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient || !form.content.trim()) return;
    setSaving(true);

    const payload = {
      professional_id: professionalId,
      patient_id: selectedPatient.id,
      session_date: form.session_date,
      content: form.content.trim(),
      mood_rating: form.mood_rating,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (editingNote) {
      await supabase.from("session_notes").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editingNote.id);
    } else {
      await supabase.from("session_notes").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    loadNotes(selectedPatient.id);
  }

  async function generarIA() {
    if (!selectedPatient) return;
    setLoadingIa(true);
    setIaResumen("");
    setIaRiesgo(null);

    const [resRes, riesgoRes] = await Promise.all([
      fetch("/api/ia/resumen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient.id, patientName: selectedPatient.full_name }) }),
      fetch("/api/ia/riesgo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient.id, patientName: selectedPatient.full_name }) }),
    ]);

    const resData = await resRes.json();
    const riesgoData = await riesgoRes.json();
    setIaResumen(resData.resumen ?? resData.error ?? "");
    setIaRiesgo(riesgoData);
    setLoadingIa(false);
  }

  async function generarResumenSemanal() {
    if (!selectedPatient) return;
    setLoadingRS(true);
    setResumenSemanal(null);

    const res = await fetch("/api/ia/resumen-semanal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: selectedPatient.id, patientName: selectedPatient.full_name }),
    });
    const data = await res.json();
    setResumenSemanal(data);
    setLoadingRS(false);
  }

  function exportarPDF() {
    if (!selectedPatient) return;
    const patientName = selectedPatient.full_name;
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Historia Clínica - ${patientName}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1f2937; }
  h1 { color: #40916C; margin-bottom: 4px; }
  .meta { color: #6B7280; font-size: 14px; margin-bottom: 24px; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
  .note { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; page-break-inside: avoid; }
  .note-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .note-date { font-weight: bold; font-size: 15px; }
  .note-mood { background: #40916C; color: white; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
  .note-content { color: #374151; line-height: 1.7; white-space: pre-wrap; }
  .note-tags { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { background: #D8F3DC; color: #40916C; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9CA3AF; font-size: 12px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <h1>Historia Clínica Digital</h1>
  <div class="meta">
    Paciente: <strong style="color:#111827">${patientName}</strong> &nbsp;·&nbsp;
    ${notes.length} nota${notes.length !== 1 ? "s" : ""} &nbsp;·&nbsp;
    Generado: ${new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
  </div>
  <hr>
  ${notes.map(note => `
    <div class="note">
      <div class="note-header">
        <span class="note-date">${new Date(note.session_date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        ${note.mood_rating ? `<span class="note-mood">Estado ${note.mood_rating}/10</span>` : ""}
      </div>
      <div class="note-content">${note.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      ${note.tags?.length ? `<div class="note-tags">${note.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
    </div>
  `).join("")}
  <div class="footer">
    <p>Mentalia — Plataforma de gestión clínica · mentaliasalud.online</p>
    <p>Documento confidencial · Solo para uso profesional · No compartir sin autorización del paciente</p>
  </div>
</body>
</html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
  }

  async function handleDelete(id: string) {
    if (!selectedPatient) return;
    await supabase.from("session_notes").delete().eq("id", id);
    loadNotes(selectedPatient.id);
  }

  const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="p-8 flex gap-6 h-full" style={{ minHeight: "calc(100vh - 0px)" }}>
      {/* Lista de pacientes */}
      <aside className="w-64 flex-shrink-0">
        <h2 className="text-xs font-bold text-gris uppercase tracking-wide mb-3">Pacientes</h2>
        {patients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center text-sm text-gris">
            Sin pacientes todavía
          </div>
        ) : (
          <div className="space-y-1">
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelectedPatient(p); setShowForm(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{
                  background: selectedPatient?.id === p.id ? "rgba(45,106,79,0.1)" : "white",
                  border: selectedPatient?.id === p.id ? "1.5px solid #40916C" : "1.5px solid #f3f4f6",
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#40916C" }}>
                  {initials(p.full_name)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.full_name}</p>
                  <p className="text-xs text-gris truncate">
                    {selectedPatient?.id === p.id && notes.length > 0 ? `${notes.length} nota${notes.length !== 1 ? "s" : ""}` : "Ver notas"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Panel principal */}
      <div className="flex-1 min-w-0">
        {!selectedPatient ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-gray-800">Seleccioná un paciente</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Historia clínica</h1>
                <p className="text-gris text-sm mt-0.5">{selectedPatient.full_name} · {notes.length} nota{notes.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={exportarPDF}
                  disabled={notes.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 disabled:opacity-40 transition-all"
                  style={{ borderColor: "#6B7280", color: "#6B7280" }}
                >
                  📄 Exportar PDF
                </button>
                <button
                  onClick={generarResumenSemanal}
                  disabled={loadingRS}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 disabled:opacity-40 transition-all"
                  style={{ borderColor: "#52B788", color: "#1b4332", background: loadingRS ? "transparent" : "#f0faf5" }}
                >
                  {loadingRS ? "Cargando..." : "📊 Resumen semanal"}
                </button>
                <button
                  onClick={generarIA}
                  disabled={loadingIa || notes.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 disabled:opacity-40 transition-all"
                  style={{ borderColor: "#40916C", color: "#40916C" }}
                >
                  {loadingIa ? "Analizando..." : "🧠 Análisis IA"}
                </button>
                <button
                  onClick={openNew}
                  className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
                  style={{ background: "#40916C" }}
                >
                  + Nueva nota
                </button>
              </div>
            </div>

            {/* Panel Resumen Semanal */}
            {resumenSemanal && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    📊 Resumen semanal — {selectedPatient.full_name}
                  </h3>
                  {resumenSemanal.tendencia && (
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: tendenciaConfig[resumenSemanal.tendencia as keyof typeof tendenciaConfig]?.bg ?? "#f3f4f6",
                        color: tendenciaConfig[resumenSemanal.tendencia as keyof typeof tendenciaConfig]?.color ?? "#374151",
                      }}
                    >
                      {tendenciaConfig[resumenSemanal.tendencia as keyof typeof tendenciaConfig]?.label ?? resumenSemanal.tendencia}
                    </span>
                  )}
                </div>

                {resumenSemanal.noData ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gris">El paciente no completó el diario emocional esta semana.</p>
                    <p className="text-xs text-gris mt-1">Cuando registre su estado diario, acá vas a ver el resumen automático.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Mood trend bars */}
                    {resumenSemanal.moodTrend.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gris uppercase tracking-wide mb-2">
                          Ánimo esta semana ({resumenSemanal.moodTrend.length} registros)
                        </p>
                        <div className="flex items-end gap-1.5 h-14">
                          {resumenSemanal.moodTrend.map((m, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-md transition-all"
                              style={{
                                height: `${Math.max(m * 10, 8)}%`,
                                background: moodColors[m] ?? "#52B788",
                                opacity: 0.8,
                                minHeight: 4,
                              }}
                              title={`${m}/10`}
                            />
                          ))}
                        </div>
                        {resumenSemanal.avgMood !== null && (
                          <p className="text-xs text-gris mt-1.5">
                            Promedio:{" "}
                            <strong style={{ color: moodColors[Math.round(resumenSemanal.avgMood)] ?? "#40916C" }}>
                              {resumenSemanal.avgMood}/10
                            </strong>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Top emotions */}
                    {resumenSemanal.topEmociones.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gris uppercase tracking-wide mb-2">Emociones más frecuentes</p>
                        <div className="flex flex-wrap gap-2">
                          {resumenSemanal.topEmociones.map((e, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "#D8F3DC", color: "#40916C" }}>
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI narrative */}
                    {resumenSemanal.resumen && (
                      <div>
                        <p className="text-xs font-bold text-gris uppercase tracking-wide mb-1.5">Observaciones IA</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{resumenSemanal.resumen}</p>
                      </div>
                    )}

                    {/* Key points */}
                    {(resumenSemanal.puntosClave ?? []).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gris uppercase tracking-wide mb-2">Puntos clave</p>
                        <ul className="space-y-1.5">
                          {resumenSemanal.puntosClave!.map((p, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="font-bold mt-0.5" style={{ color: "#40916C" }}>·</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {(resumenSemanal.sugerencias ?? []).length > 0 && (
                      <div className="rounded-xl p-4" style={{ background: "#f0faf5" }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#1b4332" }}>Sugerencias para la sesión de hoy</p>
                        <ul className="space-y-1.5">
                          {resumenSemanal.sugerencias!.map((s, i) => (
                            <li key={i} className="text-sm flex items-start gap-2" style={{ color: "#1b4332" }}>
                              <span className="mt-0.5" style={{ color: "#52B788" }}>→</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Panel IA clínica */}
            {(iaResumen || iaRiesgo) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">🧠 Análisis clínico con IA</h3>

                {iaRiesgo && iaRiesgo.nivel !== "sin_datos" && (
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{
                    background: iaRiesgo.nivel === "alto" ? "#fee2e2" : iaRiesgo.nivel === "medio" ? "#fef3c7" : "#D8F3DC",
                  }}>
                    <span className="text-xl">{iaRiesgo.nivel === "alto" ? "🔴" : iaRiesgo.nivel === "medio" ? "🟡" : "🟢"}</span>
                    <div>
                      <p className="text-sm font-bold capitalize" style={{ color: iaRiesgo.nivel === "alto" ? "#991b1b" : iaRiesgo.nivel === "medio" ? "#92400e" : "#40916C" }}>
                        Riesgo emocional: {iaRiesgo.nivel}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: iaRiesgo.nivel === "alto" ? "#7f1d1d" : iaRiesgo.nivel === "medio" ? "#78350f" : "#1b4332" }}>
                        {iaRiesgo.mensaje}
                      </p>
                    </div>
                  </div>
                )}

                {iaResumen && (
                  <div>
                    <p className="text-xs font-bold text-gris uppercase tracking-wide mb-2">Resumen clínico</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{iaResumen}</p>
                  </div>
                )}
              </div>
            )}

            {/* Formulario */}
            {showForm && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">{editingNote ? "Editar nota" : "Nueva nota de sesión"}</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de sesión</label>
                      <input
                        type="date"
                        value={form.session_date}
                        onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                        onFocus={e => (e.target.style.borderColor = "#40916C")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Estado emocional del paciente: <span className="font-bold" style={{ color: moodColors[form.mood_rating] }}>{form.mood_rating}/10</span>
                      </label>
                      <input
                        type="range" min="1" max="10"
                        value={form.mood_rating}
                        onChange={e => setForm(f => ({ ...f, mood_rating: Number(e.target.value) }))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: moodColors[form.mood_rating] }}
                      />
                      <div className="flex justify-between text-xs text-gris mt-1">
                        <span>Muy bajo</span><span>Excelente</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas de sesión</label>
                    <textarea
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      rows={6}
                      placeholder="Resumen de la sesión, observaciones clínicas, avances del paciente..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      style={{ resize: "vertical" }}
                      onFocus={e => (e.target.style.borderColor = "#40916C")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiquetas (separadas por coma)</label>
                    <input
                      value={form.tags}
                      onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      placeholder="ansiedad, duelo, avance positivo..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      onFocus={e => (e.target.style.borderColor = "#40916C")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving || !form.content.trim()}
                      className="px-6 py-2.5 text-white font-semibold rounded-xl disabled:opacity-60"
                      style={{ background: "#40916C" }}
                    >
                      {saving ? "Guardando..." : editingNote ? "Actualizar nota" : "Guardar nota"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de notas */}
            {loadingNotes ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#40916C" }} />
              </div>
            ) : notes.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-semibold text-gray-800 mb-1">Sin notas todavía</p>
                <p className="text-sm text-gris mb-4">Registrá tus observaciones después de cada sesión</p>
                <button onClick={openNew} className="inline-block px-5 py-2.5 text-white text-sm font-semibold rounded-xl" style={{ background: "#40916C" }}>
                  Crear primera nota
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(note.session_date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        {note.mood_rating && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: moodColors[note.mood_rating] }}>
                            Estado {note.mood_rating}/10
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEdit(note)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(note.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {note.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#D8F3DC", color: "#40916C" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
