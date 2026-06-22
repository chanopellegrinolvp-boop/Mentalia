import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SolicitudesPanel from "./SolicitudesPanel";
import AgendaList from "./AgendaList";

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [{ data: activas }, { data: recientes }, { data: profile }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, scheduled_at, duration_minutes, status, paciente_id, patient_id, pacientes(nombre), profiles!patient_id(full_name, email)")
      .eq("professional_id", user.id)
      .in("status", ["scheduled", "confirmed", "pending"])
      .order("scheduled_at", { ascending: true })
      .limit(30),
    supabase
      .from("appointments")
      .select("id, scheduled_at, duration_minutes, status, paciente_id, patient_id, pacientes(nombre), profiles!patient_id(full_name, email)")
      .eq("professional_id", user.id)
      .not("status", "in", '("scheduled","confirmed","pending")')
      .gte("scheduled_at", cutoff)
      .order("scheduled_at", { ascending: true })
      .limit(10),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),
  ]);

  const sesiones = [...(activas ?? []), ...(recientes ?? [])].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profesional" className="text-sm text-gray-500 hover:text-[#40916C]">
            ← Inicio
          </Link>
          <span className="font-medium text-sm text-gray-700">Agenda</span>
          <div />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <SolicitudesPanel
          professionalId={user.id}
          professionalName={profile?.full_name ?? ""}
        />

        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-semibold text-gray-800">Sesiones programadas</h2>
        </div>

        <AgendaList sesiones={(sesiones ?? []) as any} />
      </main>
    </div>
  );
}
