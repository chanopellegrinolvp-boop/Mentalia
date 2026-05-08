"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VideollamadaPacientePage() {
  const [sala, setSala] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function unirse() {
    const clean = sala.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!clean) { setError("Ingresá el código de sala que te compartió tu profesional."); return; }
    router.push(`/videollamada/${clean}`);
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Videollamada</h1>
      <p className="text-gris text-sm mb-8">Ingresá el código que te envió tu profesional para unirte a la sesión</p>

      {/* Card ingreso */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#D8F3DC" }}>
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="22" height="16" rx="3" />
              <path d="M24 12l6-4v16l-6-4" />
            </svg>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Código de sala</label>
        <input
          value={sala}
          onChange={e => { setSala(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && unirse()}
          placeholder="ej. abc12345"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono mb-1 focus:outline-none"
          style={{ letterSpacing: "0.05em" }}
          onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
          onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          autoFocus
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <button
          onClick={unirse}
          className="w-full mt-4 py-3.5 text-white font-semibold rounded-xl transition-all hover:opacity-90"
          style={{ background: "#2D6A4F" }}
        >
          Unirme a la sesión →
        </button>
      </div>

      {/* Instrucciones */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">¿Cómo funciona?</h3>
        <div className="space-y-3">
          {[
            { n: "1", text: "Tu profesional crea la sala desde su panel y te comparte el código o link." },
            { n: "2", text: "Ingresás el código acá o usás el link directo que te enviaron." },
            { n: "3", text: "Se abre la videollamada directamente en Mentalia, sin apps extra." },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                {n}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
