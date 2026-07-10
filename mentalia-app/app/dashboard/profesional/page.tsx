import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RiskAlerts from "./RiskAlerts";
import SubirMatricula from "./SubirMatricula";

export default async function DashboardProfesional() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Verificación de matrícula: estado propio + si ya subió el documento
  const { data: prof } = await supabase
    .from("professionals")
    .select("verification_status, license_doc_uploaded_at")
    .eq("id", user.id)
    .maybeSingle();
  const verif = prof?.verification_status as "pendiente" | "verificado" | "rechazado" | undefined;
  const docSubido = !!prof?.license_doc_uploaded_at;

  // Protocolo de crisis: alertas de riesgo sin resolver de sus pacientes
  const { data: flagsRaw } = await supabase
    .from("risk_flags")
    .select("id, nivel, source, detalle, created_at, patient:patient_id(full_name)")
    .eq("professional_id", user.id)
    .is("acknowledged_at", null)
    .in("nivel", ["alto", "medio"])
    .order("created_at", { ascending: false });

  const riskFlags = (flagsRaw ?? []).map((f: any) => ({
    id: f.id,
    nivel: f.nivel,
    source: f.source,
    detalle: f.detalle,
    created_at: f.created_at,
    pacienteNombre: f.patient?.full_name ?? "Tu paciente",
  }));

  // Próximas sesiones
  const { data: proximas } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status, paciente_id, pacientes(nombre)")
    .eq("professional_id", user.id)
    .gte("scheduled_at", new Date().toISOString())
    .not("status", "in", '("completed","cancelled","no_show")')
    .order("scheduled_at", { ascending: true })
    .limit(5);

  // Conteo de pacientes
  const { count: totalPacientes } = await supabase
    .from("pacientes")
    .select("*", { count: "exact", head: true })
    .eq("profesional_id", user.id);

  const nombre = profile?.full_name?.split(" ")[0] ?? "Profesional";

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-serif italic text-xl font-bold text-[#40916C]">Mentalia</span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profesional/pacientes" className="text-sm text-gray-600 hover:text-[#40916C]">
              Pacientes
            </Link>
            <form action="/api/auth/signout" method="post">
              <button className="text-sm text-gray-400 hover:text-gray-600">Salir</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Bienvenida */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hola, {nombre}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalPacientes ?? 0} paciente{totalPacientes !== 1 ? "s" : ""} activo{totalPacientes !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Verificación de matrícula: estado propio */}
        {verif === "pendiente" && (
          <div className="rounded-xl px-5 py-4" style={{ background: "#fef3c7", border: "1.5px solid #f3d38a" }}>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>Tu cuenta está en revisión</p>
            <p className="text-sm mt-1" style={{ color: "#78350f" }}>
              Estamos verificando tu matrícula. Mientras tanto <strong>no aparecés en el buscador</strong> ni podés
              recibir pacientes nuevos. {docSubido ? "Ya recibimos tu documento." : "Subí una foto o PDF de tu matrícula para agilizar la verificación."}
            </p>
            <SubirMatricula yaSubido={docSubido} />
          </div>
        )}
        {verif === "rechazado" && (
          <div className="rounded-xl px-5 py-4" style={{ background: "#fee2e2", border: "1.5px solid #f1a5a5" }}>
            <p className="text-sm font-bold" style={{ color: "#991b1b" }}>Verificación rechazada</p>
            <p className="text-sm mt-1" style={{ color: "#7f1d1d" }}>
              No pudimos verificar tu matrícula. Escribinos a{" "}
              <a href="mailto:hola@mentaliasalud.online" className="underline">hola@mentaliasalud.online</a> para revisar tu caso.
            </p>
          </div>
        )}

        {/* Protocolo de crisis: alertas que requieren atención */}
        <RiskAlerts flags={riskFlags} />

        {/* Próximas sesiones */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Próximas sesiones</h2>
            <Link href="/dashboard/profesional/agenda" className="text-sm text-[#40916C] hover:underline">
              Ver agenda
            </Link>
          </div>

          {!proximas || proximas.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-sm">No hay sesiones programadas</p>
              <Link
                href="/dashboard/profesional/pacientes/nuevo"
                className="inline-block mt-3 text-sm text-[#40916C] font-medium hover:underline"
              >
                + Agregar paciente
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {proximas.map((s: any) => {
                const fecha = new Date(s.scheduled_at);
                const esHoy = fecha.toDateString() === new Date().toDateString();
                return (
                  <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between hover:border-[#40916C]/30 transition">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {(s.pacientes as any)?.nombre ?? "Paciente"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {esHoy ? "Hoy" : fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short", timeZone: "America/Buenos_Aires" })}
                        {" · "}
                        {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Buenos_Aires" })}
                        {" · "}
                        {s.duration_minutes ?? 55} min
                      </p>
                    </div>
                    <Link
                      href={`/sesion/${s.id}`}
                      className="text-sm bg-[#40916C] text-white px-4 py-1.5 rounded-lg hover:bg-[#235a41] transition"
                    >
                      {esHoy ? "Iniciar" : "Ver"}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Acceso rápido */}
        <section className="grid grid-cols-2 gap-3">
          <Link href="/dashboard/profesional/pacientes/nuevo" className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#40916C]/30 transition">
            <p className="font-medium text-sm text-gray-800">Nuevo paciente</p>
            <p className="text-xs text-gray-400 mt-1">Agregá un paciente a tu consultorio</p>
          </Link>
          <Link href="/dashboard/profesional/pacientes" className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#40916C]/30 transition">
            <p className="font-medium text-sm text-gray-800">Mis pacientes</p>
            <p className="text-xs text-gray-400 mt-1">Historial y notas de sesión</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
