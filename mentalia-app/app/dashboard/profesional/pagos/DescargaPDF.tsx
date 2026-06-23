"use client";

import { useState } from "react";

function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function DescargaPDF() {
  const [mes, setMes] = useState(mesActual());
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState("");

  async function descargar() {
    setError("");
    setDescargando(true);
    const res = await fetch(`/api/cobros/resumen-pdf?mes=${mes}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al generar el PDF");
      setDescargando(false);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentalia-cobros-${mes}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setDescargando(false);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex flex-wrap items-center gap-3">
      <label className="text-sm text-gray-600">Mes:</label>
      <input
        type="month"
        value={mes}
        onChange={e => setMes(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
      />
      <button
        onClick={descargar}
        disabled={descargando || !mes}
        className="text-sm bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition disabled:opacity-50"
      >
        {descargando ? "Generando..." : "Descargar resumen del mes"}
      </button>
      {error && <p className="text-sm text-red-500 w-full">{error}</p>}
    </div>
  );
}
