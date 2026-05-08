import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MisPagos() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pagos } = await supabase
    .from("payments")
    .select("id, amount, currency, status, method, created_at, paid_at, appointment_id")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const statusColor: Record<string, string> = {
    paid: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    failed: "bg-red-50 text-red-500",
    refunded: "bg-gray-50 text-gray-500",
  };

  const statusLabel: Record<string, string> = {
    paid: "Pagado",
    pending: "Pendiente",
    failed: "Fallido",
    refunded: "Reembolsado",
  };

  const total = pagos?.filter(p => p.status === "paid").reduce((acc, p) => acc + Number(p.amount), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">Mis Pagos</h1>
            <p className="text-xs text-gray-400 mt-0.5">{pagos?.length ?? 0} transacciones</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total abonado</p>
            <p className="font-semibold text-[#2D6A4F]">
              {total.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!pagos || pagos.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No tenés pagos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pagos.map((p: any) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {Number(p.amount).toLocaleString("es-AR", { style: "currency", currency: p.currency ?? "ARS", maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}{p.method === "mercado_pago" ? "MercadoPago" : p.method}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[p.status] ?? "bg-gray-50 text-gray-500"}`}>
                  {statusLabel[p.status] ?? p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
