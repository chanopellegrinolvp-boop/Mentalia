"use client";

import { useState } from "react";

export default function CrearSalaButton() {
  const [sala, setSala] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function crearSala() {
    const id = Math.random().toString(36).substring(2, 10);
    setSala(id);
  }

  function copiarLink() {
    if (!sala) return;
    const url = `${window.location.origin}/videollamada/${sala}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      {!sala ? (
        <button
          onClick={crearSala}
          className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl text-sm"
          style={{ background: "#2D6A4F" }}
        >
          🎥 Crear sala de videollamada
        </button>
      ) : (
        <div className="space-y-2">
          <div className="p-3 rounded-xl text-xs font-mono break-all" style={{ background: "#f0faf3", color: "#2D6A4F" }}>
            /videollamada/{sala}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copiarLink}
              className="flex-1 py-2 text-sm font-semibold rounded-xl border-2 transition-all"
              style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}
            >
              {copied ? "✓ Copiado" : "Copiar link"}
            </button>
            <a
              href={`/videollamada/${sala}`}
              target="_blank"
              className="flex-1 py-2 text-sm font-semibold text-white rounded-xl text-center"
              style={{ background: "#2D6A4F" }}
            >
              Unirse →
            </a>
          </div>
          <button
            onClick={crearSala}
            className="w-full py-1.5 text-xs text-gris hover:text-gray-700"
          >
            Crear nueva sala
          </button>
        </div>
      )}
    </div>
  );
}
