import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MisSesiones() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sesiones } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status, started_at, ended_at")
    .eq("patient_id", user.id)
    .order("scheduled_at", { ascending: false })
    .limit(50);

  const statusLabel: Record<string, { label: string; color: string }> = {
    completed: { label: "Completada", color: "bg-green-50 text-green-600" },
    confirmed: { label: "Confirmada", color: "bg-blue-50 text-blue-600" },
    pending: { label: "Pendiente", color: "bg-yellow-50 text-yellow-600" },
    scheduled: { label: "Programada", color: "bg-gray-50 text-gray-500" },
    cancelled: { label: "Cancelada", color: "bg-red-50 text-red-400" },
    no_show: { label: "No se presentó", color: "bg-orange-50 text-orange-500" },
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Mis Sesiones</h1>
          <p className="text-xs text-gray-400 mt-0.5">{sesiones?.length ?? 0} sesiones en total</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!sesiones || sesiones.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No tenés sesiones registradas</p>
            <Link href="/dashboard/paciente/buscar" className="inline-block mt-3 text-sm text-[#2D6A4F] font-medium hover:underline">
              Buscar profesional
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sesiones.map((s: any) => {
              const fecha = new Date(s.scheduled_at);
              const esProxima = fecha > new Date();
              const st = statusLabel[s.status] ?? { label: s.status, color: "bg-gray-50 text-gray-500" };
              return (
                <div key={s.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      {" · "}{s.duration_minutes ?? 55} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    {esProxima && (
                      <Link href={`/sesion/${s.id}`} className="text-xs bg-[#2D6A4F] text-white px-3 py-1 rounded-lg hover:bg-[#235a41] transition">
                        Ver
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
