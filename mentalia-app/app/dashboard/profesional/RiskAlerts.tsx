"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Flag = {
  id: string;
  nivel: "alto" | "medio";
  source: string;
  detalle: string | null;
  created_at: string;
  pacienteNombre: string;
};

export default function RiskAlerts({ flags }: { flags: Flag[] }) {
  const [items, setItems] = useState<Flag[]>(flags);
  const [busy, setBusy] = useState<string | null>(null);
  const supabase = createClient();

  if (items.length === 0) return null;

  async function marcarVisto(id: string) {
    setBusy(id);
    const { error } = await supabase
      .from("risk_flags")
      .update({ acknowledged_at: new Date().toISOString() })
      .eq("id", id);
    setBusy(null);
    if (!error) setItems(prev => prev.filter(f => f.id !== id));
  }

  return (
    <section>
      <h2 className="font-semibold text-gray-800 mb-4">Requiere atención</h2>
      <div className="space-y-2">
        {items.map(f => {
          const alto = f.nivel === "alto";
          return (
            <div
              key={f.id}
              className="rounded-xl px-5 py-4"
              style={{
                background: alto ? "#fee2e2" : "#fef3c7",
                border: `1.5px solid ${alto ? "#f1a5a5" : "#f3d38a"}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color: alto ? "#991b1b" : "#92400e" }}>
                    {alto ? "🔴 Riesgo alto" : "🟡 Riesgo medio"} — {f.pacienteNombre}
                  </p>
                  {f.detalle && (
                    <p className="text-sm mt-1" style={{ color: alto ? "#7f1d1d" : "#78350f" }}>
                      {f.detalle}
                    </p>
                  )}
                  <p className="text-xs mt-1.5" style={{ color: alto ? "#b45454" : "#a67c31" }}>
                    Origen: {f.source === "diario" ? "diario emocional" : "notas de sesión"} ·{" "}
                    {new Date(f.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button
                  onClick={() => marcarVisto(f.id)}
                  disabled={busy === f.id}
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border disabled:opacity-50"
                  style={{ borderColor: alto ? "#f1a5a5" : "#f3d38a", color: alto ? "#991b1b" : "#92400e" }}
                >
                  {busy === f.id ? "..." : "Marcar visto"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
