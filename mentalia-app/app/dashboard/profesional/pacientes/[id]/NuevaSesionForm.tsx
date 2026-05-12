"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NuevaSesionForm({ pacienteId, profesionalId }: { pacienteId: string; profesionalId: string }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [duracion, setDuracion] = useState("55");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const scheduled_at = new Date(`${fecha}T${hora}`).toISOString();
    const { data, error: err } = await supabase.from("appointments").insert({
      professional_id: profesionalId,
      paciente_id: pacienteId,
      scheduled_at,
      duration_minutes: parseInt(duracion),
      status: "scheduled",
    }).select("id").single();

    setLoading(false);
    if (err || !data) {
      setError("No se pudo programar la sesión. Intentá de nuevo.");
      return;
    }

    fetch("/api/emails/turno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: data.id }),
    }).catch(() => {});

    router.push(`/sesion/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Duración</label>
        <select
          value={duracion}
          onChange={e => setDuracion(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
        >
          <option value="30">30 minutos</option>
          <option value="45">45 minutos</option>
          <option value="55">55 minutos</option>
          <option value="90">90 minutos</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2D6A4F] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
      >
        {loading ? "Creando..." : "Programar sesión"}
      </button>
    </form>
  );
}
