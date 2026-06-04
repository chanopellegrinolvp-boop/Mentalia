"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Solicitud = {
  id: string;
  motivo: string;
  modalidad: string;
  disponibilidad: string[];
  mensaje: string | null;
  status: string;
  created_at: string;
  paciente_id: string;
  paciente: { full_name: string; email: string } | null;
};

const MODALIDAD_LABEL: Record<string, string> = {
  online: "Online",
  presencial: "Presencial",
  sin_preferencia: "Sin preferencia",
};

function tiempoTranscurrido(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours}h`;
  if (mins > 0) return `hace ${mins} min`;
  return "ahora";
}

export default function SolicitudesPanel({
  professionalId,
  professionalName,
}: {
  professionalId: string;
  professionalName: string;
}) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [aceptarSolicitud, setAceptarSolicitud] = useState<Solicitud | null>(null);
  const [fechaHora, setFechaHora] = useState("");
  const [aceptando, setAceptando] = useState(false);

  const [rechazarSolicitud, setRechazarSolicitud] = useState<Solicitud | null>(null);
  const [mensajeRechazo, setMensajeRechazo] = useState("");
  const [rechazando, setRechazando] = useState(false);

  const supabase = createClient();

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    const { data } = await supabase
      .from("solicitudes_consulta")
      .select("id, motivo, modalidad, disponibilidad, mensaje, status, created_at, paciente_id, paciente:profiles!solicitudes_consulta_paciente_id_fkey(full_name, email)")
      .eq("professional_id", professionalId)
      .eq("status", "pendiente")
      .order("created_at", { ascending: false });
    setSolicitudes((data as unknown as Solicitud[]) ?? []);
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function confirmarAceptar() {
    if (!aceptarSolicitud || !fechaHora) return;
    setAceptando(true);

    const fechaISO = new Date(fechaHora).toISOString();

    await Promise.all([
      supabase.from("appointments").insert({
        professional_id: professionalId,
        patient_id: aceptarSolicitud.paciente_id,
        scheduled_at: fechaISO,
        status: "scheduled",
        duration_minutes: 55,
      }),
      supabase
        .from("solicitudes_consulta")
        .update({ status: "aceptada", fecha_propuesta: fechaISO })
        .eq("id", aceptarSolicitud.id),
    ]);

    const fecha = new Date(fechaHora);
    fetch("/api/emails/turno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_email: aceptarSolicitud.paciente?.email,
        paciente_nombre: aceptarSolicitud.paciente?.full_name ?? "Paciente",
        profesional_nombre: professionalName,
        fecha: fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        hora: fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        modalidad: MODALIDAD_LABEL[aceptarSolicitud.modalidad] ?? aceptarSolicitud.modalidad,
      }),
    }).catch(() => {});

    setAceptando(false);
    setAceptarSolicitud(null);
    setFechaHora("");
    showToast("Turno confirmado");
    cargar();
  }

  async function confirmarRechazo() {
    if (!rechazarSolicitud) return;
    setRechazando(true);

    await supabase
      .from("solicitudes_consulta")
      .update({
        status: "rechazada",
        mensaje_profesional: mensajeRechazo || null,
      })
      .eq("id", rechazarSolicitud.id);

    const msgContent = mensajeRechazo.trim()
      ? `Lo sentimos, no podemos atenderte en este momento.\n\n${mensajeRechazo}\n\nPodés buscar otro profesional disponible en /dashboard/paciente/buscar`
      : "Tu solicitud de consulta fue revisada. Lamentablemente no podemos atenderte en este momento. Podés buscar otro profesional disponible.";

    await supabase.from("messages").insert({
      sender_id: professionalId,
      receiver_id: rechazarSolicitud.paciente_id,
      content: msgContent,
    });

    fetch("/api/emails/solicitud-rechazada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paciente_email: rechazarSolicitud.paciente?.email,
        paciente_nombre: rechazarSolicitud.paciente?.full_name ?? "Paciente",
        profesional_nombre: professionalName,
        mensaje_rechazo: mensajeRechazo.trim() || null,
      }),
    }).catch(() => {});

    setRechazando(false);
    setRechazarSolicitud(null);
    setMensajeRechazo("");
    showToast("Solicitud rechazada");
    cargar();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#40916C" }} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-semibold text-gray-800">Solicitudes pendientes</h2>
        {solicitudes.length > 0 && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: "#2D6A4F" }}
          >
            {solicitudes.length}
          </span>
        )}
      </div>

      {solicitudes.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center mb-2">
          <p className="text-sm text-gray-400">No tenés solicitudes pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{s.paciente?.full_name ?? "Paciente"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tiempoTranscurrido(s.created_at)}</p>
                </div>
                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full font-medium flex-shrink-0">
                  Pendiente
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Motivo:</span> {s.motivo}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Modalidad:</span>{" "}
                  {MODALIDAD_LABEL[s.modalidad] ?? s.modalidad}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Disponibilidad:</span>{" "}
                  {s.disponibilidad?.join(", ")}
                </p>
                {s.mensaje && (
                  <p className="text-sm text-gray-500 italic">"{s.mensaje}"</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setAceptarSolicitud(s); setFechaHora(""); }}
                  className="flex-1 py-2 text-sm font-semibold rounded-xl text-white transition-all"
                  style={{ background: "#2D6A4F" }}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => { setRechazarSolicitud(s); setMensajeRechazo(""); }}
                  className="flex-1 py-2 text-sm font-semibold rounded-xl border-2 transition-all"
                  style={{ borderColor: "#fca5a5", color: "#ef4444", background: "white" }}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Aceptar */}
      {aceptarSolicitud && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setAceptarSolicitud(null); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Confirmar turno</h3>
            <p className="text-sm text-gray-500 mb-5">
              Con {aceptarSolicitud.paciente?.full_name ?? "el paciente"}
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha y hora</label>
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAceptarSolicitud(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAceptar}
                disabled={aceptando || !fechaHora}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "#2D6A4F" }}
              >
                {aceptando ? "Confirmando..." : "Confirmar turno"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar */}
      {rechazarSolicitud && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setRechazarSolicitud(null); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Rechazar solicitud</h3>
            <p className="text-sm text-gray-500 mb-4">
              De {rechazarSolicitud.paciente?.full_name ?? "el paciente"}
            </p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mensaje para el paciente (opcional)
              </label>
              <textarea
                value={mensajeRechazo}
                onChange={(e) => setMensajeRechazo(e.target.value)}
                rows={3}
                placeholder="Explicale el motivo del rechazo..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                style={{ resize: "none" }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRechazarSolicitud(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRechazo}
                disabled={rechazando}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "#ef4444" }}
              >
                {rechazando ? "Rechazando..." : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: "#2D6A4F" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
