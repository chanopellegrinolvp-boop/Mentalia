"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubirMatricula({ yaSubido }: { yaSubido: boolean }) {
  const router = useRouter();
  const [subiendo, setSubiendo] = useState(false);
  const [ok, setOk] = useState(yaSubido);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 5 * 1024 * 1024) { setError("El archivo supera 5 MB."); return; }
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) {
      setError("Subí JPG, PNG, WEBP o PDF."); return;
    }
    setSubiendo(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/profesional/subir-matricula", { method: "POST", body: fd });
    setSubiendo(false);
    if (res.ok) { setOk(true); router.refresh(); }
    else { const j = await res.json().catch(() => ({})); setError(j.error ?? "No se pudo subir."); }
  }

  return (
    <div className="mt-3">
      {ok ? (
        <p className="text-sm" style={{ color: "#78350f" }}>
          ✓ Documento recibido. Estamos revisando tu matrícula.{" "}
          <label className="underline cursor-pointer">
            Reemplazar
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={onChange} />
          </label>
        </p>
      ) : (
        <label
          className="inline-block text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer text-white"
          style={{ background: "#92400e", opacity: subiendo ? 0.6 : 1 }}
        >
          {subiendo ? "Subiendo..." : "Subir foto o PDF de mi matrícula"}
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={onChange} disabled={subiendo} />
        </label>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
