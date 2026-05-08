import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrearSalaButton from "@/components/app/CrearSalaButton";


const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
  scheduled: { text: "Programado", color: "#2D6A4F", bg: "#D8F3DC" },
  confirmed: { text: "Confirmado", color: "#1a7a4a", bg: "#c5f0d0" },
  completed: { text: "Completado", color: "#6B7280", bg: "#f3f4f6" },
  pending:   { text: "Pendiente", color: "#d97706", bg: "#fef3c7" },
  cancelled: { text: "Cancelado", color: "#ef4444", bg: "#fee2e2" },
  no_show:   { text: "No asistió", color: "#9f1239", bg: "#ffe4e6" },
};

export default async function ProfesionalDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role !== "professional") redirect("/dashboard/paciente");

  const now = new Date();
  const firstName = profile.full_name?.split(" ")[0] ?? "Profesional";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const todayStr = now.toISOString().split("T")[0];

  const [
    { data: monthAppointments },
    { data: monthPayments },
    { data: todayAppointments },
    { data: allAppointments },
  ] = await Promise.all([
    supabase.from("appointments").select("id").eq("professional_id", user.id).gte("scheduled_at", startOfMonth),
    supabase.from("payments").select("amount").eq("professional_id", user.id).eq("status", "paid").gte("created_at", startOfMonth),
    supabase.from("appointments").select("*, patient:patient_id(full_name)").eq("professional_id", user.id).gte("scheduled_at", `${todayStr}T00:00:00`).lte("scheduled_at", `${todayStr}T23:59:59`).order("scheduled_at"),
    supabase.from("appointments").select("patient_id").eq("professional_id", user.id).neq("status", "cancelled"),
  ]);

  const totalBilled = monthPayments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const uniquePatients = new Set(allAppointments?.map((a) => a.patient_id) ?? []).size;

  const stats = [
    { label: "Sesiones este mes", value: monthAppointments?.length ?? 0, icon: "🗓️" },
    { label: "Cobrado este mes", value: `$${totalBilled.toLocaleString("es-AR")}`, icon: "💳", sub: "ARS" },
    { label: "Pacientes activos", value: uniquePatients, icon: "👥" },
    { label: "Turnos hoy", value: todayAppointments?.length ?? 0, icon: "⏰" },
  ];

  const [{ data: nextAppointments }, { data: proData }] = await Promise.all([
    supabase.from("appointments").select("*, patient:patient_id(full_name)").eq("professional_id", user.id).in("status", ["scheduled", "confirmed", "pending"]).gte("scheduled_at", now.toISOString()).order("scheduled_at").limit(5),
    supabase.from("professionals").select("calendly_url").eq("id", user.id).single(),
  ]);

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gris mt-0.5">{s.label}</div>
            {s.sub && <div className="text-xs text-gris">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turnos de hoy */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Turnos de hoy</h2>
            <span className="text-xs text-gris">{todayStr}</span>
          </div>
          <div className="p-4">
            {!todayAppointments || todayAppointments.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500 font-medium">Sin turnos para hoy</p>
                <p className="text-sm text-gris mt-1">Tus próximas sesiones aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayAppointments.map((appt: any) => {
                  const time = new Date(appt.scheduled_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                  const st = statusLabel[appt.status] ?? statusLabel.pending;
                  const initials = (appt.patient?.full_name ?? "?").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
                  return (
                    <div key={appt.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#f8faf9" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{appt.patient?.full_name ?? "Paciente"}</p>
                        <p className="text-xs text-gris">{time} · {appt.duration_minutes} min · {appt.modality}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: st.color, background: st.bg }}>
                        {st.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="space-y-4">
          {/* Próximas sesiones */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">Próximas sesiones</h2>
            </div>
            <div className="p-4">
              {!nextAppointments || nextAppointments.length === 0 ? (
                <p className="text-sm text-gris text-center py-4">Sin sesiones próximas</p>
              ) : (
                <div className="space-y-3">
                  {nextAppointments.map((appt: any) => {
                    const d = new Date(appt.scheduled_at);
                    return (
                      <div key={appt.id} className="flex items-center gap-3">
                        <div className="text-center flex-shrink-0" style={{ minWidth: 40 }}>
                          <div className="text-xs text-gris">{d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</div>
                          <div className="text-xs font-bold text-gray-900">{d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{appt.patient?.full_name ?? "Paciente"}</p>
                          <p className="text-xs text-gris">{appt.modality}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Acciones rápidas</h2>
            <div className="space-y-2">
              {[
                { icon: "🗓️", label: "Mi agenda (Calendly)", href: "/dashboard/profesional/agenda" },
                { icon: "👤", label: "Editar mi perfil", href: "/dashboard/profesional/perfil" },
                { icon: "👥", label: "Mis pacientes", href: "/dashboard/profesional/pacientes" },
              ].map((action) => (
                <a key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </a>
              ))}
              {proData?.calendly_url && (
                <a href={proData.calendly_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl text-sm hover:bg-gray-50 transition-colors" style={{ color: "#2D6A4F" }}>
                  <span>🔗</span>
                  <span>Compartir mi link de turnos</span>
                </a>
              )}
            </div>
          </div>

          {/* Videollamada */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-1">Videollamada</h2>
            <p className="text-xs text-gris mb-3">Creá una sala y compartí el link con tu paciente</p>
            <CrearSalaButton />
          </div>

          {/* Trial banner */}
          <div className="rounded-2xl p-5" style={{ background: "#2D6A4F" }}>
            <p className="text-white font-semibold text-sm mb-1">🎉 Trial activo</p>
            <p className="text-xs mb-3" style={{ color: "#D8F3DC" }}>10 días gratis · Sin tarjeta de crédito</p>
            <a href="/#precios" className="block text-center bg-white text-sm font-semibold py-2 rounded-lg" style={{ color: "#2D6A4F" }}>
              Ver planes →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
