"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Nota = { id: string; content: string; created_at: string };

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export default function NotasRapidas({ profesionalId, pacienteId }: { profesionalId: string; pacienteId: string }) {
  const supabase = createClient();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    const { data } = await supabase
      .from("quick_notes")
      .select("id, content, created_at")
      .eq("professional_id", profesionalId)
      .eq("patient_id", pacienteId)
      .order("created_at", { ascending: false });
    setNotas(data ?? []);
  }

  async function guardar() {
    if (!texto.trim()) return;
    setGuardando(true);
    await supabase.from("quick_notes").insert({
      professional_id: profesionalId,
      patient_id: pacienteId,
      content: texto.trim(),
    });
    setTexto("");
    await cargar();
    setGuardando(false);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta nota?")) return;
    await supabase.from("quick_notes").delete().eq("id", id);
    setNotas(prev => prev.filter(n => n.id !== id));
  }

  return (
    <section>
      <h3 className="font-semibold text-gray-800 mb-3">Notas rápidas</h3>
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="space-y-2">
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            rows={3}
            placeholder="Escribí una nota..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none"
          />
          <button
            onClick={guardar}
            disabled={guardando || !texto.trim()}
            className="text-sm bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar nota"}
          </button>
        </div>

        {notas.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {notas.map(n => (
              <div key={n.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 leading-relaxed">{n.content}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatFecha(n.created_at)}</p>
                </div>
                <button
                  onClick={() => eliminar(n.id)}
                  className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 transition"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
