import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PacientesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("patient_id, patient:patient_id(full_name, email), status, scheduled_at")
    .eq("professional_id", user.id)
    .neq("status", "cancelled")
    .order("scheduled_at", { ascending: false });

  const uniqueMap = new Map<string, any>();
  appointments?.forEach((a: any) => {
    if (!uniqueMap.has(a.patient_id)) uniqueMap.set(a.patient_id, a.patient);
  });
  const patients = Array.from(uniqueMap.values());

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
        <p className="text-gris text-sm mt-1">{patients.length} paciente{patients.length !== 1 ? "s" : ""} con sesiones</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {patients.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold text-gray-800">Sin pacientes todavía</p>
            <p className="text-sm text-gris mt-1">Tus pacientes aparecerán aquí cuando reserven un turno</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {patients.map((p: any, i: number) => {
              const initials = (p?.full_name ?? "?").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p?.full_name ?? "Paciente"}</p>
                    <p className="text-xs text-gris truncate">{p?.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
