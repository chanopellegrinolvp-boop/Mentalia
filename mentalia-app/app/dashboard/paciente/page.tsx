import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PacienteHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: proxima } = await supabase
    .from("appointments")
    .select("id, scheduled_at, duration_minutes, status, daily_room_name, started_at")
    .eq("patient_id", user.id)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: ultimoDiario } = await supabase
    .from("emotional_diary")
    .select("mood, date")
    .eq("patient_id", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: totalSesiones } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user.id)
    .eq("status", "completed");

  const nombre = profile?.full_name?.split(" ")[0] ?? "Paciente";

  const moodEmoji = (m: number) => {
    if (m >= 8) return "😊";
    if (m >= 6) return "🙂";
    if (m >= 4) return "😐";
    if (m >= 2) return "😔";
    return "😢";
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Hola, {nombre}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalSesiones ?? 0} sesiones completadas</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Próxima sesión */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Próxima sesión</h2>
          {proxima ? (
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {new Date(proxima.scheduled_at).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(proxima.scheduled_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}{proxima.duration_minutes ?? 55} min
                </p>
              </div>
              {proxima.started_at ? (
                <Link href="/dashboard/paciente/videollamada" className="text-sm bg-[#40916C] text-white px-4 py-1.5 rounded-lg hover:bg-[#235a41] transition">
                  Unirse
                </Link>
              ) : (
                <span className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-600">Programada</span>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm">No tenés sesiones próximas</p>
              <Link href="/dashboard/paciente/buscar" className="inline-block mt-2 text-sm text-[#40916C] font-medium hover:underline">
                Buscar profesional
              </Link>
            </div>
          )}
        </section>

        {/* Estado emocional hoy */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Estado emocional</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              {ultimoDiario ? (
                <>
                  <p className="text-3xl">{moodEmoji(ultimoDiario.mood)}</p>
                  <p className="text-sm font-medium text-gray-800 mt-2">Estado: {ultimoDiario.mood}/10</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(ultimoDiario.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl">📝</p>
                  <p className="text-sm text-gray-500 mt-2">Aún no registraste tu estado</p>
                </>
              )}
            </div>
            <Link href="/dashboard/paciente/diario" className="bg-[#40916C] rounded-xl p-5 flex flex-col justify-between hover:bg-[#235a41] transition">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-sm font-medium text-white mt-3">Registrar estado de hoy</p>
            </Link>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/paciente/sesiones" className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#40916C]/30 transition">
              <p className="font-medium text-sm text-gray-800">Mis sesiones</p>
              <p className="text-xs text-gray-400 mt-1">Historial de consultas</p>
            </Link>
            <Link href="/dashboard/paciente/progreso" className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#40916C]/30 transition">
              <p className="font-medium text-sm text-gray-800">Mi progreso</p>
              <p className="text-xs text-gray-400 mt-1">Ver evolución</p>
            </Link>
            <Link href="/dashboard/paciente/actividades" className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#40916C]/30 transition">
              <p className="font-medium text-sm text-gray-800">Actividades</p>
              <p className="text-xs text-gray-400 mt-1">Ejercicios terapéuticos</p>
            </Link>
            <Link href="/dashboard/mensajes" className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#40916C]/30 transition">
              <p className="font-medium text-sm text-gray-800">Mensajes</p>
              <p className="text-xs text-gray-400 mt-1">Contactar al profesional</p>
            </Link>
            <Link href="/dashboard/paciente/pagos" className="bg-white border border-gray-100 rounded-xl p-4 hover:border-[#40916C]/30 transition">
              <p className="font-medium text-sm text-gray-800">Pagar ahora</p>
              <p className="text-xs text-gray-400 mt-1">Gestionar suscripción</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
