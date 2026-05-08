import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sesiones } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status, paciente_id, pacientes(nombre)")
    .eq("professional_id", user.id)
    .order("scheduled_at", { ascending: true })
    .limit(30);

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profesional" className="text-sm text-gray-500 hover:text-[#2D6A4F]">
            ← Dashboard
          </Link>
          <span className="font-medium text-sm text-gray-700">Agenda</span>
          <div />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!sesiones || sesiones.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay sesiones programadas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sesiones.map((s: any) => {
              const fecha = new Date(s.scheduled_at);
              return (
                <Link
                  key={s.id}
                  href={`/sesion/${s.id}`}
                  className="block bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-[#2D6A4F]/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{s.pacientes?.nombre ?? "Paciente"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                        {" · "}
                        {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${s.status === "completed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                      {s.status === "completed" ? "Completada" : s.status === "confirmed" ? "Confirmada" : "Programada"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
