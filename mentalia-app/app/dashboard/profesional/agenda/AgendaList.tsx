"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Sesion = {
  id: string;
  scheduled_at: string;
  duration_minutes: number | null;
  status: string;
  pacientes: { nombre: string } | null;
  profiles: { full_name: string | null; email: string | null } | null;
};

export default function AgendaList({ sesiones: inicial }: { sesiones: Sesion[] }) {
  const [sesiones, setSesiones] = useState(inicial);
  const [cancelando, setCancelando] = useState<Sesion | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const cancelables = ["confirmed", "pending", "scheduled"];

  async function confirmarCancelar() {
    if (!cancelando) return;
    setLoading(true);
    await supabase
      .from("appointments")
      .delete()
      .eq("id", cancelando.id);
    setSesiones((prev) => prev.filter((s) => s.id !== cancelando.id));
    setLoading(false);
    setCancelando(null);
  }

  if (sesiones.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-sm">No hay sesiones programadas</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {sesiones.map((s) => {
          const fecha = new Date(s.scheduled_at);
          const nombre = s.pacientes?.nombre ?? s.profiles?.full_name ?? s.profiles?.email ?? "Paciente";
          const puedeCancel = cancelables.includes(s.status);
          return (
            <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-3">
              <Link href={`/sesion/${s.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Buenos_Aires" })}
                  {" · "}
                  {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Buenos_Aires" })}
                </p>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === "completed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                  {s.status === "completed" ? "Completada" : s.status === "confirmed" ? "Confirmada" : "Programada"}
                </span>
                {puedeCancel && (
                  <button
                    onClick={() => setCancelando(s)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Cancelar sesión"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cancelando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setCancelando(null); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Cancelar sesión</h3>
            <p className="text-sm text-gray-500 mb-6">
              Vas a cancelar la sesión con{" "}
              <span className="font-medium text-gray-800">
                {cancelando.pacientes?.nombre ?? cancelando.profiles?.full_name ?? "el paciente"}
              </span>
              . Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelando(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                No
              </button>
              <button
                onClick={confirmarCancelar}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "#ef4444" }}
              >
                {loading ? "Cancelando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
