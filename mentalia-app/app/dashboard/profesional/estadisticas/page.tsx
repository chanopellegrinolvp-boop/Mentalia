import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EstadisticasPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [{ data: thisMonth }, { data: lastMonth }, { data: allAppts }, { data: payments }] = await Promise.all([
    supabase.from("appointments").select("id").eq("professional_id", user.id).gte("scheduled_at", startOfMonth),
    supabase.from("appointments").select("id").eq("professional_id", user.id).gte("scheduled_at", startOfLastMonth).lt("scheduled_at", startOfMonth),
    supabase.from("appointments").select("patient_id, status").eq("professional_id", user.id),
    supabase.from("payments").select("amount").eq("professional_id", user.id).eq("status", "paid"),
  ]);

  const uniquePatients = new Set(allAppts?.map(a => a.patient_id) ?? []).size;
  const completed = allAppts?.filter(a => a.status === "completed").length ?? 0;
  const totalRevenue = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const thisMo = thisMonth?.length ?? 0;
  const lastMo = lastMonth?.length ?? 0;
  const diff = thisMo - lastMo;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-gris text-sm mt-1">Resumen de tu actividad en Mentalia</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "🗓️", label: "Sesiones este mes", value: thisMo, sub: diff >= 0 ? `+${diff} vs mes anterior` : `${diff} vs mes anterior` },
          { icon: "✅", label: "Sesiones completadas", value: completed, sub: "Total histórico" },
          { icon: "👥", label: "Pacientes totales", value: uniquePatients, sub: "Con al menos 1 sesión" },
          { icon: "💳", label: "Ingresos totales", value: `$${totalRevenue.toLocaleString("es-AR")}`, sub: "ARS cobrado" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gris mt-0.5">{s.label}</div>
            <div className="text-xs mt-1" style={{ color: "#2D6A4F" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-semibold text-gray-800 mb-1">Estadísticas detalladas</p>
        <p className="text-sm text-gris">Próximamente: gráficos de sesiones, retención de pacientes y más</p>
      </div>
    </div>
  );
}
