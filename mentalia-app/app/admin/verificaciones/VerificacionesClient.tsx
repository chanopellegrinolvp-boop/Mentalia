"use client";

import { useState } from "react";

type Item = {
  id: string;
  nombre: string;
  email: string;
  matricula: string;
  provincia: string;
  docUrl: string | null;
  subido: string | null;
};

export default function VerificacionesClient({ items }: { items: Item[] }) {
  const [pendientes, setPendientes] = useState<Item[]>(items);
  const [busy, setBusy] = useState<string | null>(null);

  async function decidir(id: string, action: "aprobar" | "rechazar") {
    setBusy(id);
    const res = await fetch("/api/admin/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professionalId: id, action }),
    });
    setBusy(null);
    if (res.ok) setPendientes(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-semibold text-gray-900">Verificación de matrículas</h1>
          <p className="text-xs text-gray-400 mt-0.5">{pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {pendientes.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay profesionales pendientes de verificación</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendientes.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{p.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.email}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Matrícula: <strong>{p.matricula}</strong> · Provincia: {p.provincia}
                    </p>
                    <p className="text-xs mt-1">
                      {p.docUrl ? (
                        <a href={p.docUrl} target="_blank" rel="noopener noreferrer" className="text-[#40916C] underline font-medium">
                          Ver documento subido
                        </a>
                      ) : (
                        <span className="text-orange-500">Sin documento subido todavía</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => decidir(p.id, "aprobar")}
                      disabled={busy === p.id}
                      className="text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50"
                      style={{ background: "#40916C" }}
                    >
                      {busy === p.id ? "..." : "Aprobar"}
                    </button>
                    <button
                      onClick={() => decidir(p.id, "rechazar")}
                      disabled={busy === p.id}
                      className="text-sm font-semibold px-4 py-2 rounded-lg border disabled:opacity-50"
                      style={{ borderColor: "#f1a5a5", color: "#991b1b" }}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
