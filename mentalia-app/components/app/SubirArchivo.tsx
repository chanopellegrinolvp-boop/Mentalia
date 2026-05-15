"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Archivo = {
  name: string;
  id: string;
  updated_at: string;
  metadata: { size: number; mimetype: string };
};

export default function SubirArchivo({ pacienteId, professionalId }: { pacienteId: string; professionalId: string }) {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const folder = `${professionalId}/${pacienteId}`;

  useEffect(() => { cargarArchivos(); }, []);

  async function cargarArchivos() {
    const { data } = await supabase.storage.from("archivos-pacientes").list(folder, { sortBy: { column: "updated_at", order: "desc" } });
    setArchivos((data as Archivo[]) ?? []);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("El archivo no puede superar los 10 MB."); return; }
    setError("");
    setUploading(true);
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("archivos-pacientes").upload(path, file);
    if (uploadError) setError("Error al subir el archivo.");
    else cargarArchivos();
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(name: string) {
    await supabase.storage.from("archivos-pacientes").remove([`${folder}/${name}`]);
    cargarArchivos();
  }

  async function handleDownload(name: string) {
    const { data } = await supabase.storage.from("archivos-pacientes").createSignedUrl(`${folder}/${name}`, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Archivos del paciente</h3>
        <label
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white cursor-pointer"
          style={{ background: uploading ? "#9CA3AF" : "#40916C" }}
        >
          {uploading ? "Subiendo..." : "+ Subir archivo"}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {archivos.length === 0 ? (
        <p className="text-sm text-gray-400">Sin archivos adjuntos.</p>
      ) : (
        <ul className="space-y-2">
          {archivos.map((a) => (
            <li key={a.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg">📎</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.name.replace(/^\d+_/, "")}</p>
                  {a.metadata?.size && <p className="text-xs text-gray-400">{formatSize(a.metadata.size)}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(a.name)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-[#40916C] hover:bg-[#D8F3DC]"
                >
                  Ver
                </button>
                <button
                  onClick={() => handleDelete(a.name)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
