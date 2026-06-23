"use client";

import { useState, useEffect, useRef } from "react";

type Adjunto = {
  id: string;
  file_name: string;
  file_type: string;
  notes: string | null;
  created_at: string;
  signed_url: string | null;
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function fileIcon(type: string) {
  if (type === "application/pdf") return "📄";
  if (type.startsWith("image/")) return "🖼️";
  return "📎";
}

export default function AdjuntosClinicos({ pacienteId }: { pacienteId: string }) {
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    const res = await fetch(`/api/pacientes/${pacienteId}/adjuntos`);
    if (res.ok) setAdjuntos(await res.json());
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSubiendo(true);
    setProgreso("Subiendo...");

    const fd = new FormData();
    fd.append("file", file);
    if (descripcion.trim()) fd.append("notes", descripcion.trim());

    const res = await fetch(`/api/pacientes/${pacienteId}/adjuntos`, { method: "POST", body: fd });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al subir");
    } else {
      setDescripcion("");
      await cargar();
    }

    setSubiendo(false);
    setProgreso("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este adjunto? No se puede deshacer.")) return;
    await fetch(`/api/pacientes/${pacienteId}/adjuntos/${id}`, { method: "DELETE" });
    setAdjuntos(prev => prev.filter(a => a.id !== id));
  }

  return (
    <section>
      <h3 className="font-semibold text-gray-800 mb-3">Adjuntos clínicos</h3>
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
          />
          <div className="flex items-center gap-3">
            <label
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white cursor-pointer transition"
              style={{ background: subiendo ? "#9CA3AF" : "#40916C" }}
            >
              {subiendo ? progreso : "+ Subir archivo"}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                disabled={subiendo}
                onChange={handleUpload}
              />
            </label>
            <span className="text-xs text-gray-400">PDF, JPG, PNG, WEBP · máx 10 MB</span>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {adjuntos.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {adjuntos.map(a => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{fileIcon(a.file_type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.file_name}</p>
                    {a.notes && <p className="text-xs text-gray-500 truncate">{a.notes}</p>}
                    <p className="text-xs text-gray-400">{formatFecha(a.created_at)}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {a.signed_url && (
                    <a
                      href={a.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-[#40916C] hover:bg-[#D8F3DC] transition"
                    >
                      Descargar
                    </a>
                  )}
                  <button
                    onClick={() => eliminar(a.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {adjuntos.length === 0 && (
          <p className="text-sm text-gray-400">Sin adjuntos clínicos.</p>
        )}
      </div>
    </section>
  );
}
