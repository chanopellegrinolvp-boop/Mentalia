import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SesionesPacientePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, professional:professional_id(full_name, specialty)")
    .eq("patient_id", user.id)
    .order("scheduled_at", { ascending: false });

  const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
    scheduled:  { text: "Programada",  color: "#2D6A4F", bg: "#D8F3DC" },
    confirmed:  { text: "Confirmada",  color: "#1a7a4a", bg: "#c5f0d0" },
    completed:  { text: "Completada",  color: "#6B7280", bg: "#f3f4f6" },
    pending:    { text: "Pendiente",   color: "#d97706", bg: "#fef3c7" },
    cancelled:  { text: "Cancelada",  color: "#ef4444", bg: "#fee2e2" },
    no_show:    { text: "No asistió", color: "#9f1239", bg: "#ffe4e6" },
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
        <p className="text-gris text-sm mt-1">{appointments?.length ?? 0} sesión{(appointments?.length ?? 0) !== 1 ? "es" : ""} en total</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!appointments || appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🗓️</div>
            <p className="font-semibold text-gray-800 mb-1">Sin sesiones todavía</p>
            <p className="text-sm text-gris mb-6">Encontrá un profesional y reservá tu primera sesión</p>
            <Link href="/buscar" className="inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: "#2D6A4F" }}>
              Buscar profesional →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((appt: any) => {
              const d = new Date(appt.scheduled_at);
              const st = statusLabel[appt.status] ?? statusLabel.pending;
              return (
                <div key={appt.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="text-center flex-shrink-0" style={{ minWidth: 52 }}>
                    <div className="text-xs font-bold text-gray-900">{d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</div>
                    <div className="text-xs text-gris">{d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">con {(appt.professional as any)?.full_name ?? "Profesional"}</p>
                    <p className="text-xs text-gris">{appt.duration_minutes} min · {appt.modality}</p>
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
  );
}
