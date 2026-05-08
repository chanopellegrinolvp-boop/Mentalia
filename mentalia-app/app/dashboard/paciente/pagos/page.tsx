import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PagosPacientePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const total = payments?.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        <p className="text-gris text-sm mt-1">Historial de pagos de tus sesiones</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="text-2xl mb-1">💳</div>
        <div className="text-2xl font-bold text-gray-900">${total.toLocaleString("es-AR")} ARS</div>
        <div className="text-xs text-gris mt-1">Total abonado</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Historial</h2>
        </div>
        {!payments || payments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">💳</div>
            <p className="font-semibold text-gray-800 mb-1">Sin pagos todavía</p>
            <Link href="/buscar" className="text-sm font-semibold" style={{ color: "#2D6A4F" }}>Reservar una sesión →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">${Number(p.amount).toLocaleString("es-AR")} ARS</p>
                  <p className="text-xs text-gris">{new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: p.status === "paid" ? "#D8F3DC" : "#fef3c7", color: p.status === "paid" ? "#2D6A4F" : "#d97706" }}>
                  {p.status === "paid" ? "Pagado" : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
