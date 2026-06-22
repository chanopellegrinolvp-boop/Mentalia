import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import NuevaSesionForm from "./NuevaSesionForm";
import SubirArchivo from "@/components/app/SubirArchivo";
import ActividadesProfesional from "./ActividadesProfesional";

export default async function PacienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "null" || id === "undefined") redirect("/dashboard/profesional/pacientes");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: paciente } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .eq("profesional_id", user.id)
    .single();

  if (!paciente) notFound();

  const [{ data: sesiones }, { data: apptConProfile }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, scheduled_at, duration_minutes, status, session_notes(id, content, ai_summary, temas_clave, nivel_riesgo)")
      .eq("professional_id", user.id)
      .eq("paciente_id", id)
      .order("scheduled_at", { ascending: false })
      .limit(20),
    supabase
      .from("appointments")
      .select("patient_id")
      .eq("professional_id", user.id)
      .eq("paciente_id", id)
      .not("patient_id", "is", null)
      .limit(1)
      .maybeSingle(),
  ]);

  const patientProfileId = apptConProfile?.patient_id ?? null;

  const { data: actividades } = patientProfileId
    ? await supabase
        .from("therapeutic_activities")
        .select("id, title, description, type, status, content, patient_response, completed_at, due_date, created_at")
        .eq("professional_id", user.id)
        .eq("patient_id", patientProfileId)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profesional/pacientes" className="text-sm text-gray-500 hover:text-[#40916C]">
            ← Pacientes
          </Link>
          <span className="font-medium text-sm text-gray-700">{paciente.nombre}</span>
          <div />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Info del paciente */}
        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900">{paciente.nombre}</h2>
          {paciente.motivo_consulta && (
            <p className="text-sm text-gray-500 mt-1">{paciente.motivo_consulta}</p>
          )}
          {paciente.email && <p className="text-xs text-gray-400 mt-2">{paciente.email}</p>}
        </section>

        {/* Programar nueva sesión */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-3">Nueva sesión</h3>
          <NuevaSesionForm pacienteId={id} profesionalId={user.id} />
        </section>

        {/* Historial de sesiones */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-3">Historial</h3>
          {!sesiones || sesiones.length === 0 ? (
            <p className="text-sm text-gray-400">Aún no hay sesiones registradas.</p>
          ) : (
            <div className="space-y-3">
              {sesiones.map((s: any) => {
                const nota = s.session_notes?.[0];
                const fecha = new Date(s.scheduled_at);
                return (
                  <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <p className="text-xs text-gray-400">{s.duration_minutes ?? 55} min · {s.status}</p>
                      </div>
                      <Link
                        href={`/sesion/${s.id}`}
                        className="text-xs text-[#40916C] hover:underline"
                      >
                        {nota ? "Ver notas" : "Abrir sesión"}
                      </Link>
                    </div>
                    {nota?.ai_summary && (
                      <div className="bg-[#D8F3DC]/40 rounded-lg p-3">
                        <p className="text-xs font-medium text-[#40916C] mb-1">Resumen IA</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{nota.ai_summary}</p>
                        {nota.temas_clave?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {nota.temas_clave.map((t: string) => (
                              <span key={t} className="text-[10px] bg-[#40916C]/10 text-[#40916C] px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {nota?.content && !nota.ai_summary && (
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{nota.content}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
        {/* Actividades terapéuticas */}
        <ActividadesProfesional
          profesionalId={user.id}
          patientProfileId={patientProfileId}
          pacienteNombre={paciente.nombre}
          actividadesIniciales={(actividades ?? []) as any}
        />

        {/* Archivos del paciente */}
        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <SubirArchivo pacienteId={id} professionalId={user.id} />
        </section>
      </main>
    </div>
  );
}
