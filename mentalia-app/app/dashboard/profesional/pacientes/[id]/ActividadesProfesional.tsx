"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Actividad = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  content: any;
  patient_response: any;
  completed_at: string | null;
  due_date: string | null;
  created_at: string;
};

const TIPOS: Record<string, string> = {
  breathing: "Respiración",
  journaling: "Diario terapéutico",
  gratitude: "Gratitud",
  psychoeducation: "Psicoeducación",
  questionnaire: "Cuestionario",
  meditation: "Meditación",
  behavioral: "Activación conductual",
  custom: "Personalizada",
};

const TITULOS_DEFAULT: Record<string, string> = {
  breathing: "Ejercicio de respiración",
  journaling: "Diario de pensamientos",
  gratitude: "Lista de gratitud",
  psychoeducation: "Material de lectura",
  questionnaire: "Cuestionario de seguimiento",
  meditation: "Práctica de meditación",
  behavioral: "Activación conductual",
  custom: "Actividad personalizada",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

export default function ActividadesProfesional({
  profesionalId,
  patientProfileId,
  pacienteNombre,
  actividadesIniciales,
}: {
  profesionalId: string;
  patientProfileId: string | null;
  pacienteNombre: string;
  actividadesIniciales: Actividad[];
}) {
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [expandida, setExpandida] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const [tipo, setTipo] = useState("breathing");
  const [titulo, setTitulo] = useState(TITULOS_DEFAULT.breathing);
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const supabase = createClient();

  function handleTipoChange(nuevoTipo: string) {
    setTipo(nuevoTipo);
    setTitulo(TITULOS_DEFAULT[nuevoTipo] ?? "");
  }

  async function asignarActividad() {
    if (!patientProfileId || !titulo.trim()) return;
    setGuardando(true);
    const { data, error } = await supabase
      .from("therapeutic_activities")
      .insert({
        professional_id: profesionalId,
        patient_id: patientProfileId,
        title: titulo.trim(),
        description: descripcion.trim() || null,
        type: tipo,
        due_date: fechaVencimiento || null,
      })
      .select()
      .single();

    if (!error && data) {
      setActividades(prev => [data as Actividad, ...prev]);
      setMostrarFormulario(false);
      setTipo("breathing");
      setTitulo(TITULOS_DEFAULT.breathing);
      setDescripcion("");
      setFechaVencimiento("");
    }
    setGuardando(false);
  }

  async function eliminarActividad(actividadId: string) {
    setEliminando(actividadId);
    const { error } = await supabase
      .from("therapeutic_activities")
      .delete()
      .eq("id", actividadId);
    if (!error) {
      setActividades(prev => prev.filter(a => a.id !== actividadId));
    }
    setEliminando(null);
  }

  const pendientes = actividades.filter(a => a.status !== "completed");
  const completadas = actividades.filter(a => a.status === "completed");

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Actividades terapéuticas</h3>
        {patientProfileId && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="text-sm bg-[#40916C] text-white px-4 py-1.5 rounded-lg hover:bg-[#235a41] transition"
          >
            + Asignar
          </button>
        )}
      </div>

      {!patientProfileId && (
        <p className="text-sm text-gray-400">
          {pacienteNombre} no tiene cuenta en Mentalia. Para asignar actividades, el paciente debe estar registrado.
        </p>
      )}

      {patientProfileId && actividades.length === 0 && (
        <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">Este paciente no tiene actividades asignadas.</p>
        </div>
      )}

      {actividades.length > 0 && (
        <div className="space-y-2">
          {[...pendientes, ...completadas].map(act => (
            <div key={act.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{act.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[act.status]}`}>
                      {STATUS_LABELS[act.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {TIPOS[act.type]}
                    {act.due_date && ` · Vence ${new Date(act.due_date + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })}`}
                  </p>
                  {act.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{act.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {act.status === "completed" && (
                    <button
                      onClick={() => setExpandida(expandida === act.id ? null : act.id)}
                      className="text-xs text-[#40916C] hover:underline"
                    >
                      {expandida === act.id ? "Ocultar" : "Ver respuesta"}
                    </button>
                  )}
                  {act.status === "pending" && (
                    <button
                      onClick={() => eliminarActividad(act.id)}
                      disabled={eliminando === act.id}
                      className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              {expandida === act.id && act.patient_response && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">Respuesta del paciente</p>
                  <RespuestaViewer type={act.type} response={act.patient_response} />
                  {act.completed_at && (
                    <p className="text-xs text-gray-300 mt-2">
                      Completada el{" "}
                      {new Date(act.completed_at).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        timeZone: "America/Buenos_Aires",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={e => { if (e.target === e.currentTarget) setMostrarFormulario(false); }}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-gray-900">Asignar actividad a {pacienteNombre}</h3>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Tipo</label>
              <select
                value={tipo}
                onChange={e => handleTipoChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
              >
                {Object.entries(TIPOS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Instrucciones (opcional)</label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Instrucciones específicas para el paciente..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Fecha de vencimiento (opcional)</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={e => setFechaVencimiento(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setMostrarFormulario(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={asignarActividad}
                disabled={guardando || !titulo.trim()}
                className="flex-1 bg-[#40916C] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
              >
                {guardando ? "Asignando..." : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function RespuestaViewer({ type, response }: { type: string; response: any }) {
  if (type === "journaling" || type === "custom") {
    return <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{response.text}</p>;
  }
  if (type === "gratitude") {
    return (
      <ul className="space-y-1">
        {(response.items ?? []).map((item: string, i: number) => (
          <li key={i} className="text-xs text-gray-600">· {item}</li>
        ))}
      </ul>
    );
  }
  if (type === "questionnaire") {
    return (
      <div className="space-y-2">
        {(response.answers ?? []).map((a: any, i: number) => (
          <div key={i}>
            <p className="text-xs font-medium text-gray-500">{a.question}</p>
            <p className="text-xs text-gray-600">{a.answer}</p>
          </div>
        ))}
      </div>
    );
  }
  if (type === "behavioral") {
    return (
      <ul className="space-y-1">
        {(response.steps ?? []).map((step: any, i: number) => (
          <li key={i} className={`text-xs flex items-center gap-1.5 ${step.completed ? "text-gray-600" : "text-gray-300"}`}>
            <span>{step.completed ? "✓" : "○"}</span>
            <span className={step.completed ? "" : "line-through"}>{step.title}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-xs text-gray-400 italic">Actividad completada</p>;
}
