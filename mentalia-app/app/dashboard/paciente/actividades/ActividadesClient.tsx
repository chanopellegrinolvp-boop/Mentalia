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
};

const TIPO_LABELS: Record<string, string> = {
  breathing: "Respiración",
  journaling: "Diario terapéutico",
  gratitude: "Gratitud",
  psychoeducation: "Psicoeducación",
  questionnaire: "Cuestionario",
  meditation: "Meditación",
  behavioral: "Activación conductual",
  custom: "Personalizada",
};

export default function ActividadesClient({
  actividades: inicial,
}: {
  actividades: Actividad[];
}) {
  const [actividades, setActividades] = useState<Actividad[]>(inicial);
  const [modal, setModal] = useState<Actividad | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [texto, setTexto] = useState("");
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [respuestasQ, setRespuestasQ] = useState<Record<number, string>>({});
  const [stepsState, setStepsState] = useState<boolean[]>([]);

  const supabase = createClient();

  function abrirModal(act: Actividad) {
    setModal(act);
    setTexto("");
    setGratitudes(["", "", ""]);
    setRespuestasQ({});
    if (act.type === "behavioral" && act.content?.steps) {
      setStepsState(act.content.steps.map(() => false));
    } else {
      setStepsState([]);
    }
  }

  async function completar() {
    if (!modal) return;
    setGuardando(true);

    let patient_response: any = {};
    const tipo = modal.type;

    if (tipo === "breathing" || tipo === "meditation") {
      patient_response = { completed: true };
    } else if (tipo === "psychoeducation") {
      patient_response = { read: true };
    } else if (tipo === "journaling" || tipo === "custom") {
      patient_response = { text: texto.trim() };
    } else if (tipo === "gratitude") {
      patient_response = { items: gratitudes.filter(g => g.trim()) };
    } else if (tipo === "questionnaire") {
      const questions: string[] = modal.content?.questions ?? [];
      patient_response = {
        answers: questions.map((q, i) => ({ question: q, answer: respuestasQ[i] ?? "" })),
      };
    } else if (tipo === "behavioral") {
      const steps: string[] = modal.content?.steps ?? [];
      patient_response = {
        steps: steps.map((title, i) => ({ title, completed: stepsState[i] ?? false })),
      };
    }

    const { error } = await supabase
      .from("therapeutic_activities")
      .update({
        status: "completed",
        patient_response,
        completed_at: new Date().toISOString(),
      })
      .eq("id", modal.id);

    if (!error) {
      setActividades(prev =>
        prev.map(a =>
          a.id === modal.id
            ? { ...a, status: "completed", patient_response, completed_at: new Date().toISOString() }
            : a
        )
      );
      setModal(null);
    }
    setGuardando(false);
  }

  const pendientes = actividades.filter(a => a.status !== "completed");
  const completadas = actividades.filter(a => a.status === "completed");

  if (actividades.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-sm">No tenés actividades asignadas todavía.</p>
        <p className="text-xs text-gray-300 mt-1">Tu profesional puede asignarte ejercicios terapéuticos desde tu perfil.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {pendientes.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pendientes</h2>
            <div className="space-y-2">
              {pendientes.map(act => (
                <ActividadCard key={act.id} act={act} onCompletar={() => abrirModal(act)} />
              ))}
            </div>
          </section>
        )}

        {completadas.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Completadas</h2>
            <div className="space-y-2">
              {completadas.map(act => (
                <ActividadCard key={act.id} act={act} />
              ))}
            </div>
          </section>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <p className="text-xs text-[#40916C] font-medium">{TIPO_LABELS[modal.type]}</p>
              <h3 className="font-semibold text-gray-900 mt-0.5">{modal.title}</h3>
              {modal.description && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{modal.description}</p>
              )}
            </div>

            <CompletionForm
              act={modal}
              texto={texto}
              setTexto={setTexto}
              gratitudes={gratitudes}
              setGratitudes={setGratitudes}
              respuestasQ={respuestasQ}
              setRespuestasQ={setRespuestasQ}
              stepsState={stepsState}
              setStepsState={setStepsState}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={completar}
                disabled={guardando}
                className="flex-1 bg-[#40916C] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Completar actividad"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActividadCard({
  act,
  onCompletar,
}: {
  act: Actividad;
  onCompletar?: () => void;
}) {
  const done = act.status === "completed";
  return (
    <div
      className="bg-white border rounded-xl px-5 py-4 transition-all"
      style={{ borderColor: done ? "#40916C" : "#f3f4f6", opacity: done ? 0.75 : 1 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${done ? "line-through text-gray-400" : "text-gray-900"}`}>
            {act.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {TIPO_LABELS[act.type]}
            {act.due_date && ` · Vence ${new Date(act.due_date + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short" })}`}
          </p>
          {act.description && !done && (
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{act.description}</p>
          )}
        </div>
        {done ? (
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "#40916C" }}
          >
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : (
          <button
            onClick={onCompletar}
            className="flex-shrink-0 text-xs bg-[#40916C] text-white px-3 py-1.5 rounded-lg hover:bg-[#235a41] transition"
          >
            Completar
          </button>
        )}
      </div>
    </div>
  );
}

function CompletionForm({
  act,
  texto,
  setTexto,
  gratitudes,
  setGratitudes,
  respuestasQ,
  setRespuestasQ,
  stepsState,
  setStepsState,
}: {
  act: Actividad;
  texto: string;
  setTexto: (v: string) => void;
  gratitudes: string[];
  setGratitudes: (v: string[]) => void;
  respuestasQ: Record<number, string>;
  setRespuestasQ: (v: Record<number, string>) => void;
  stepsState: boolean[];
  setStepsState: (v: boolean[]) => void;
}) {
  const tipo = act.type;

  if (tipo === "breathing" || tipo === "meditation") {
    return (
      <div className="bg-[#D8F3DC]/30 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          Realizá el ejercicio y cuando termines presioná &ldquo;Completar actividad&rdquo;.
        </p>
      </div>
    );
  }

  if (tipo === "psychoeducation") {
    return (
      <div className="space-y-3">
        {act.content?.text && (
          <div className="bg-[#D8F3DC]/30 border border-[#40916C]/20 rounded-xl p-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{act.content.text}</p>
          </div>
        )}
        <p className="text-xs text-gray-400 text-center">Leé el material y confirmá cuando termines.</p>
      </div>
    );
  }

  if (tipo === "journaling" || tipo === "custom") {
    return (
      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        rows={5}
        placeholder={tipo === "journaling" ? "Escribí tus pensamientos y reflexiones..." : "Escribí tu respuesta..."}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none"
      />
    );
  }

  if (tipo === "gratitude") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Escribí 3 cosas por las que estás agradecido/a hoy:</p>
        {[0, 1, 2].map(i => (
          <input
            key={i}
            type="text"
            value={gratitudes[i]}
            onChange={e => {
              const next = [...gratitudes];
              next[i] = e.target.value;
              setGratitudes(next);
            }}
            placeholder={`Gratitud ${i + 1}...`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
          />
        ))}
      </div>
    );
  }

  if (tipo === "questionnaire") {
    const questions: string[] = act.content?.questions ?? [];
    if (questions.length === 0) {
      return <p className="text-xs text-gray-400 text-center">Sin preguntas configuradas.</p>;
    }
    return (
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i}>
            <label className="text-xs font-medium text-gray-600 block mb-1">{q}</label>
            <input
              type="text"
              value={respuestasQ[i] ?? ""}
              onChange={e => setRespuestasQ({ ...respuestasQ, [i]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C]"
            />
          </div>
        ))}
      </div>
    );
  }

  if (tipo === "behavioral") {
    const steps: string[] = act.content?.steps ?? [];
    if (steps.length === 0) {
      return (
        <div className="bg-[#D8F3DC]/30 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">Completá la actividad cuando estés listo/a.</p>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Marcá los pasos que completaste:</p>
        {steps.map((step, i) => (
          <label key={i} className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={stepsState[i] ?? false}
              onChange={e => {
                const next = [...stepsState];
                next[i] = e.target.checked;
                setStepsState(next);
              }}
              className="w-4 h-4 accent-[#40916C] flex-shrink-0"
            />
            <span className={`text-sm ${stepsState[i] ? "line-through text-gray-400" : "text-gray-700"}`}>
              {step}
            </span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
