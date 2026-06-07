"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Professional = {
  id: string;
  specialty: string;
  bio: string | null;
  city: string | null;
  province: string | null;
  session_price: number | null;
  years_experience: number | null;
  modality: string | null;
  is_available: boolean;
  profiles: { full_name: string; email: string } | { full_name: string; email: string }[] | null;
};

const ESPECIALIDADES: Record<string, string> = {
  clinica: "Psicología clínica",
  infanto_juvenil: "Infanto-juvenil",
  pareja: "Pareja",
  familia: "Familia",
  laboral: "Laboral",
  neuropsicologia: "Neuropsicología",
  otra: "Otra",
};

function getMotivosPorEspecialidad(especialidad: string): string[] {
  const map: Record<string, string[]> = {
    clinica: [
      "Ansiedad y ataques de pánico",
      "Depresión y tristeza persistente",
      "Estrés crónico",
      "Insomnio y problemas del sueño",
      "Baja autoestima",
      "Duelo o pérdida",
      "Otro",
    ],
    pareja: [
      "Conflictos de pareja",
      "Crisis de comunicación",
      "Infidelidad o ruptura",
      "Problemas de intimidad",
      "Decisiones importantes en la relación",
      "Otro",
    ],
    infanto_juvenil: [
      "Problemas de conducta en niños",
      "Dificultades escolares",
      "Ansiedad infantil",
      "Problemas familiares que afectan al niño",
      "Desarrollo emocional",
      "Otro",
    ],
    familia: [
      "Conflictos familiares",
      "Crisis familiar",
      "Comunicación familiar",
      "Situaciones de cambio en la familia",
      "Duelo familiar",
      "Otro",
    ],
    laboral: [
      "Burnout o agotamiento laboral",
      "Conflictos en el trabajo",
      "Cambio de carrera",
      "Liderazgo y gestión de equipos",
      "Estrés por desempleo",
      "Otro",
    ],
    neuropsicologia: [
      "Evaluación neuropsicológica",
      "Dificultades de atención y memoria",
      "Rehabilitación cognitiva",
      "Secuelas de ACV o trauma",
      "Deterioro cognitivo",
      "Otro",
    ],
    otra: [
      "Ansiedad o estrés",
      "Estado de ánimo",
      "Relaciones personales",
      "Autoconocimiento y desarrollo personal",
      "Situación de vida difícil",
      "Otro",
    ],
  };
  return (
    map[especialidad] ?? [
      "Ansiedad o estrés",
      "Estado de ánimo",
      "Relaciones personales",
      "Autoconocimiento y desarrollo personal",
      "Situación de vida difícil",
      "Otro",
    ]
  );
}

const DISPONIBILIDAD_OPTS = [
  "Mañana (8:00 - 12:00)",
  "Mediodía (12:00 - 15:00)",
  "Tarde (15:00 - 19:00)",
  "Noche (19:00 - 22:00)",
];

function getProfile(p: Professional) {
  return Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
}

export default function BuscarClient({
  profesionales,
  userId,
  pacienteNombre,
}: {
  profesionales: Professional[];
  userId: string;
  pacienteNombre: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<Professional | null>(null);
  const [motivo, setMotivo] = useState("");
  const [modalidad, setModalidad] = useState<"online" | "presencial" | "sin_preferencia">("sin_preferencia");
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  function abrirModal(p: Professional) {
    setProfesionalSeleccionado(p);
    setMotivo("");
    setModalidad("sin_preferencia");
    setDisponibilidad([]);
    setMensaje("");
    setEnviado(false);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setProfesionalSeleccionado(null);
    setErrorEnvio("");
  }

  function toggleDisponibilidad(op: string) {
    setDisponibilidad((prev) =>
      prev.includes(op) ? prev.filter((d) => d !== op) : [...prev, op]
    );
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!profesionalSeleccionado || !motivo || disponibilidad.length === 0) return;
    setEnviando(true);
    setErrorEnvio("");

    const profile = getProfile(profesionalSeleccionado);
    const contenidoMensaje = `📋 Solicitud de consulta\n\nMotivo: ${motivo}\nModalidad: ${modalidad}\nDisponibilidad: ${disponibilidad.join(", ")}${mensaje ? `\n\nMensaje: ${mensaje}` : ""}`;

    const [solicitudResult, messageResult] = await Promise.all([
      supabase.from("solicitudes_consulta").insert({
        paciente_id: userId,
        professional_id: profesionalSeleccionado.id,
        motivo,
        modalidad,
        disponibilidad,
        mensaje: mensaje || null,
        status: "pendiente",
      }),
      supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: profesionalSeleccionado.id,
        content: contenidoMensaje,
      }),
    ]);

    if (solicitudResult.error || messageResult.error) {
      setEnviando(false);
      setErrorEnvio("No se pudo enviar la solicitud. Intentá de nuevo.");
      return;
    }

    fetch("/api/emails/solicitud-consulta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profesional_email: profile?.email,
        profesional_nombre: profile?.full_name ?? "Profesional",
        paciente_nombre: pacienteNombre,
        motivo,
        modalidad,
        disponibilidad,
        mensaje,
      }),
    }).catch(() => {});

    setEnviando(false);
    setEnviado(true);

    setTimeout(() => {
      cerrarModal();
      router.push("/dashboard/mensajes");
    }, 3000);
  }

  return (
    <>
      <div className="space-y-3">
        {profesionales.map((p) => {
          const profile = getProfile(p);
          return (
            <div
              key={p.id}
              className="bg-white border border-gray-100 rounded-xl px-5 py-5 hover:border-[#40916C]/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{profile?.full_name ?? "Profesional"}</p>
                    {p.is_available && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Disponible</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {p.specialty && (
                      <span className="text-xs text-[#40916C] bg-[#D8F3DC] px-2 py-0.5 rounded-full">
                        {ESPECIALIDADES[p.specialty] ?? p.specialty}
                      </span>
                    )}
                    {p.city && (
                      <span className="text-xs text-gray-400">
                        {p.city}{p.province ? `, ${p.province}` : ""}
                      </span>
                    )}
                    {p.modality && (
                      <span className="text-xs text-gray-400 capitalize">
                        {p.modality === "online" ? "Online" : p.modality === "presencial" ? "Presencial" : "Online y presencial"}
                      </span>
                    )}
                  </div>
                  {p.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.bio}</p>}
                  <div className="flex items-center gap-4 mt-3">
                    {p.years_experience != null && p.years_experience > 0 && (
                      <span className="text-xs text-gray-500">{p.years_experience} años de experiencia</span>
                    )}
                    {p.session_price != null && p.session_price > 0 && (
                      <span className="text-xs font-medium text-gray-700">
                        ${Number(p.session_price).toLocaleString("es-AR")} / sesión
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => abrirModal(p)}
                  className="text-sm bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition"
                >
                  Solicitar consulta
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalAbierto && profesionalSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {enviado ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "#D8F3DC" }}
                  >
                    <span className="text-3xl font-bold" style={{ color: "#2D6A4F" }}>✓</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg mb-2">¡Solicitud enviada!</p>
                  <p className="text-sm text-gray-500">
                    El profesional se pondrá en contacto con vos pronto.
                  </p>
                  <p className="text-xs text-gray-400 mt-3">Redirigiendo a mensajes...</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                      Solicitar consulta con {getProfile(profesionalSeleccionado)?.full_name ?? "el profesional"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Especialidad: {ESPECIALIDADES[profesionalSeleccionado.specialty] ?? profesionalSeleccionado.specialty}
                    </p>
                  </div>

                  <form onSubmit={handleEnviar} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Motivo de consulta <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white"
                      >
                        <option value="">Seleccioná un motivo</option>
                        {getMotivosPorEspecialidad(profesionalSeleccionado.specialty).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                      <div className="flex gap-2">
                        {(
                          [
                            ["online", "Online"],
                            ["presencial", "Presencial"],
                            ["sin_preferencia", "Sin preferencia"],
                          ] as const
                        ).map(([val, label]) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setModalidad(val)}
                            className="flex-1 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all"
                            style={{
                              borderColor: modalidad === val ? "#2D6A4F" : "#e5e7eb",
                              background: modalidad === val ? "#2D6A4F" : "white",
                              color: modalidad === val ? "white" : "#6B7280",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disponibilidad horaria <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {DISPONIBILIDAD_OPTS.map((op) => (
                          <label
                            key={op}
                            className="flex items-center gap-2.5 px-3 py-2.5 border rounded-xl cursor-pointer transition-all"
                            style={{
                              borderColor: disponibilidad.includes(op) ? "#2D6A4F" : "#e5e7eb",
                              background: disponibilidad.includes(op) ? "#f0faf5" : "white",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={disponibilidad.includes(op)}
                              onChange={() => toggleDisponibilidad(op)}
                              className="w-4 h-4 accent-[#2D6A4F]"
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: disponibilidad.includes(op) ? "#2D6A4F" : "#374151" }}
                            >
                              {op}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje adicional</label>
                      <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value.slice(0, 300))}
                        rows={3}
                        placeholder="Contale algo más sobre lo que estás buscando (opcional)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                        style={{ resize: "none" }}
                      />
                      <p className="text-xs text-gray-400 text-right mt-1">{mensaje.length}/300</p>
                    </div>

                    {errorEnvio && <p className="text-sm text-red-500">{errorEnvio}</p>}

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={cerrarModal}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={enviando || !motivo || disponibilidad.length === 0}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                        style={{ background: "#2D6A4F" }}
                      >
                        {enviando ? "Enviando..." : "Enviar solicitud"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
