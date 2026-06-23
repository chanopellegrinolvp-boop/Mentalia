"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Plan = {
  id: string;
  title: string;
  objectives: string;
  techniques: string | null;
  tasks: string | null;
  evaluation: string | null;
  status: "active" | "completed" | "paused";
  created_at: string;
  updated_at: string;
};

type FormData = {
  title: string;
  objectives: string;
  techniques: string;
  tasks: string;
  evaluation: string;
};

const EMPTY_FORM: FormData = { title: "", objectives: "", techniques: "", tasks: "", evaluation: "" };

const statusConfig = {
  active: { label: "Activo", class: "bg-green-50 text-green-600" },
  paused: { label: "Pausado", class: "bg-yellow-50 text-yellow-700" },
  completed: { label: "Completado", class: "bg-gray-100 text-gray-500" },
};

export default function PlanTratamiento({ profesionalId, pacienteId }: { profesionalId: string; pacienteId: string }) {
  const supabase = createClient();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [vista, setVista] = useState<"lista" | "nuevo" | "detalle">("lista");
  const [planActivo, setPlanActivo] = useState<Plan | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    const { data } = await supabase
      .from("treatment_plans")
      .select("*")
      .eq("professional_id", profesionalId)
      .eq("patient_id", pacienteId)
      .order("created_at", { ascending: false });
    setPlanes((data as Plan[]) ?? []);
  }

  function abrirNuevo() {
    setForm(EMPTY_FORM);
    setVista("nuevo");
  }

  function abrirDetalle(plan: Plan) {
    setPlanActivo(plan);
    setForm({
      title: plan.title,
      objectives: plan.objectives,
      techniques: plan.techniques ?? "",
      tasks: plan.tasks ?? "",
      evaluation: plan.evaluation ?? "",
    });
    setVista("detalle");
  }

  function volver() {
    setVista("lista");
    setPlanActivo(null);
  }

  async function guardarNuevo() {
    if (!form.title.trim() || !form.objectives.trim()) return;
    setGuardando(true);
    await supabase.from("treatment_plans").insert({
      professional_id: profesionalId,
      patient_id: pacienteId,
      title: form.title.trim(),
      objectives: form.objectives.trim(),
      techniques: form.techniques.trim() || null,
      tasks: form.tasks.trim() || null,
      evaluation: form.evaluation.trim() || null,
    });
    await cargar();
    setVista("lista");
    setGuardando(false);
  }

  async function guardarEdicion() {
    if (!planActivo || !form.title.trim() || !form.objectives.trim()) return;
    setGuardando(true);
    await supabase.from("treatment_plans").update({
      title: form.title.trim(),
      objectives: form.objectives.trim(),
      techniques: form.techniques.trim() || null,
      tasks: form.tasks.trim() || null,
      evaluation: form.evaluation.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", planActivo.id);
    await cargar();
    volver();
    setGuardando(false);
  }

  async function cambiarEstado(id: string, status: Plan["status"]) {
    await supabase.from("treatment_plans").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    if (planActivo?.id === id) setPlanActivo(prev => prev ? { ...prev, status } : null);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este plan de tratamiento?")) return;
    await supabase.from("treatment_plans").delete().eq("id", id);
    setPlanes(prev => prev.filter(p => p.id !== id));
    if (planActivo?.id === id) volver();
  }

  const campoClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none";

  if (vista === "nuevo" || vista === "detalle") {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            {vista === "nuevo" ? "Nuevo plan de tratamiento" : form.title || "Plan de tratamiento"}
          </h3>
          <button onClick={volver} className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← Volver
          </button>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          {vista === "detalle" && planActivo && (
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[planActivo.status].class}`}>
                {statusConfig[planActivo.status].label}
              </span>
              <select
                value={planActivo.status}
                onChange={e => cambiarEstado(planActivo.id, e.target.value as Plan["status"])}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#40916C]"
              >
                <option value="active">Activo</option>
                <option value="paused">Pausado</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ej: Plan de intervención TCC"
              className={campoClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Objetivos *</label>
            <textarea rows={3} value={form.objectives} onChange={e => setForm(f => ({ ...f, objectives: e.target.value }))} placeholder="Objetivos terapéuticos..." className={campoClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Técnicas</label>
            <textarea rows={2} value={form.techniques} onChange={e => setForm(f => ({ ...f, techniques: e.target.value }))} placeholder="Técnicas a utilizar..." className={campoClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tareas</label>
            <textarea rows={2} value={form.tasks} onChange={e => setForm(f => ({ ...f, tasks: e.target.value }))} placeholder="Tareas entre sesiones..." className={campoClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Evaluación</label>
            <textarea rows={2} value={form.evaluation} onChange={e => setForm(f => ({ ...f, evaluation: e.target.value }))} placeholder="Criterios de evaluación..." className={campoClass} />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={vista === "nuevo" ? guardarNuevo : guardarEdicion}
              disabled={guardando || !form.title.trim() || !form.objectives.trim()}
              className="text-sm bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            {vista === "detalle" && planActivo && (
              <button
                onClick={() => eliminar(planActivo.id)}
                className="text-sm text-red-400 hover:text-red-600 transition"
              >
                Eliminar plan
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Plan de tratamiento</h3>
        <button
          onClick={abrirNuevo}
          className="text-sm bg-[#40916C] text-white px-3 py-1.5 rounded-lg hover:bg-[#235a41] transition"
        >
          + Crear plan
        </button>
      </div>

      {planes.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">Sin planes de tratamiento registrados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {planes.map(p => (
            <button
              key={p.id}
              onClick={() => abrirDetalle(p)}
              className="w-full text-left bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-[#40916C]/30 transition"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-gray-900">{p.title}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[p.status].class}`}>
                  {statusConfig[p.status].label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.objectives}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
