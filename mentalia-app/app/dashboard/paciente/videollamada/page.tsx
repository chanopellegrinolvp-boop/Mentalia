import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Videollamada() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ahora = new Date();
  const hace2h = new Date(ahora.getTime() - 2 * 60 * 60 * 1000);

  // Sesión activa (iniciada en las últimas 2h)
  const { data: activa } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, started_at, daily_room_name, video_room_url")
    .eq("patient_id", user.id)
    .not("started_at", "is", null)
    .is("ended_at", null)
    .gte("started_at", hace2h.toISOString())
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Próxima sesión
  const { data: proxima } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status")
    .eq("patient_id", user.id)
    .gte("scheduled_at", ahora.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Videollamada</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {activa ? (
          <div className="bg-white border border-[#40916C]/30 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[#40916C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Sesión en curso</p>
              <p className="text-sm text-gray-500 mt-1">Tu profesional ya inició la sesión</p>
            </div>
            {activa.daily_room_name ? (
              <Link
                href={`/videollamada/${activa.daily_room_name}`}
                className="inline-block bg-[#40916C] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#235a41] transition"
              >
                Unirse a la sesión
              </Link>
            ) : (
              <p className="text-sm text-gray-400">El enlace estará disponible en instantes. Recargá la página.</p>
            )}
          </div>
        ) : proxima ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Próxima sesión</p>
              <p className="text-lg font-medium text-[#40916C] mt-2">
                {new Date(proxima.scheduled_at).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(proxima.scheduled_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                {" · "}{proxima.duration_minutes ?? 55} min
              </p>
            </div>
            <p className="text-xs text-gray-400">El enlace de videollamada estará disponible cuando el profesional inicie la sesión</p>
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <p className="text-gray-400 text-sm">No tenés sesiones programadas</p>
            <Link href="/dashboard/paciente/buscar" className="inline-block mt-3 text-sm text-[#40916C] font-medium hover:underline">
              Buscar un profesional
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
