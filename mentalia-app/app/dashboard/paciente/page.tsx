import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PacienteDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role === "professional") redirect("/dashboard/profesional");

  const firstName = profile?.full_name?.split(" ")[0] ?? "Paciente";
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const { data: nextAppointment } = await supabase
    .from("appointments")
    .select("*, professional:professional_id(full_name, id)")
    .eq("patient_id", user.id)
    .in("status", ["scheduled", "confirmed", "pending"])
    .gte("scheduled_at", now.toISOString())
    .order("scheduled_at")
    .limit(1)
    .single();

  const { data: pastAppointments } = await supabase
    .from("appointments")
    .select("*, professional:professional_id(full_name)")
    .eq("patient_id", user.id)
    .eq("status", "completed")
    .order("scheduled_at", { ascending: false })
    .limit(4);

  const { data: patientProfile } = await supabase
    .from("patient_profiles")
    .select("*, professional:professional_id(full_name, specialty, id)")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, <span style={{ color: "#2D6A4F" }}>{firstName}</span> 👋
        </h1>
        <p className="text-gris text-sm mt-1">
          {now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Próxima sesión */}
          {nextAppointment ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gris">Próxima sesión</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "#D8F3DC" }}>
                  🗓️
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{new Date(nextAppointment.scheduled_at).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
                  <p className="text-gris text-sm">{new Date(nextAppointment.scheduled_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs · {nextAppointment.duration_minutes} min · {nextAppointment.modality}</p>
                  <p className="text-sm mt-1 font-medium" style={{ color: "#2D6A4F" }}>con {(nextAppointment.professional as any)?.full_name ?? "tu profesional"}</p>
                </div>
                <a
                  href={`/profesional/${(nextAppointment.professional as any)?.id ?? ""}`}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl flex-shrink-0"
                  style={{ background: "#2D6A4F" }}
                >
                  Ver turno →
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-1">Sin sesiones próximas</h3>
              <p className="text-gris text-sm mb-4">Encontrá un profesional y agendá tu primera sesión</p>
              <Link href="/buscar" className="inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: "#2D6A4F" }}>
                Buscar psicólogo/a →
              </Link>
            </div>
          )}

          {/* Sesiones pasadas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Sesiones anteriores</h2>
            </div>
            <div className="p-4">
              {!pastAppointments || pastAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gris text-sm">Tus sesiones completadas aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pastAppointments.map((appt: any) => {
                    const d = new Date(appt.scheduled_at);
                    return (
                      <div key={appt.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#f8faf9" }}>
                        <div className="text-2xl">✅</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</p>
                          <p className="text-xs text-gris">con {appt.professional?.full_name} · {appt.duration_minutes} min</p>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#f3f4f6", color: "#6B7280" }}>
                          Completada
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="space-y-4">
          {/* Mi profesional */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Mi profesional</h2>
            {patientProfile?.professional ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mx-auto mb-2" style={{ background: "#2D6A4F" }}>
                  {(patientProfile.professional as any).full_name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{(patientProfile.professional as any).full_name}</p>
                <p className="text-xs text-gris mt-0.5 capitalize">{(patientProfile.professional as any).specialty}</p>
                <a href={`/profesional/${(patientProfile.professional as any).id}`} className="mt-3 block text-center text-sm font-semibold py-2 rounded-xl border-2" style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}>
                  Ver perfil
                </a>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gris mb-3">Aún no tenés un profesional asignado</p>
                <Link href="/buscar" className="block text-center text-sm font-semibold py-2.5 rounded-xl text-white" style={{ background: "#2D6A4F" }}>
                  Encontrar uno →
                </Link>
              </div>
            )}
          </div>

          {/* Herramientas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Herramientas</h2>
            <div className="space-y-2">
              {[
                { icon: "📔", label: "Diario emocional", href: "/dashboard/paciente/diario", desc: "Registrá cómo te sentís" },
                { icon: "✅", label: "Mis actividades", href: "/dashboard/paciente/actividades", desc: "Ejercicios entre sesiones" },
                { icon: "📈", label: "Mi progreso", href: "/dashboard/paciente/progreso", desc: "Seguí tu bienestar" },
              ].map((tool) => (
                <Link
                  key={tool.label}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-verde-claro"
                  style={{ background: "#f8faf9" }}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{tool.label}</p>
                    <p className="text-xs text-gris">{tool.desc}</p>
                  </div>
                  <span className="text-gris text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Buscar */}
          <div className="rounded-2xl p-5" style={{ background: "#2D6A4F" }}>
            <p className="text-white font-semibold text-sm mb-1">¿Buscás otro profesional?</p>
            <p className="text-xs mb-3" style={{ color: "#D8F3DC" }}>Explorá nuestro directorio verificado</p>
            <Link href="/buscar" className="block text-center bg-white text-sm font-semibold py-2 rounded-lg" style={{ color: "#2D6A4F" }}>
              Ver directorio →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
