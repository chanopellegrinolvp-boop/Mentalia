import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PagoStatusBanner from "./PagoStatusBanner";
import BotonesPlanes from "@/components/app/BotonesPlanes";
import DescargaPDF from "./DescargaPDF";

export default async function CobrosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const { data: pagos } = await supabase
    .from("payments")
    .select("id, amount, currency, status, method, created_at, paid_at, patient_id, profiles(full_name, email)")
    .eq("professional_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const statusColor: Record<string, string> = {
    paid: "bg-green-50 text-green-600",
    approved: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    failed: "bg-red-50 text-red-500",
    refunded: "bg-gray-50 text-gray-500",
  };
  const statusLabel: Record<string, string> = {
    paid: "Cobrado",
    approved: "Aprobado",
    pending: "Pendiente",
    failed: "Fallido",
    refunded: "Reembolsado",
  };

  const totalMes = pagos
    ?.filter(p => (p.status === "paid" || p.status === "approved") && p.paid_at && p.paid_at >= inicioMes)
    .reduce((acc, p) => acc + Number(p.amount), 0) ?? 0;
  const totalHistorico = pagos
    ?.filter(p => p.status === "paid" || p.status === "approved")
    .reduce((acc, p) => acc + Number(p.amount), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-semibold text-gray-900">Cobros y suscripción</h1>
          <p className="text-xs text-gray-400 mt-0.5">Historial de pagos y gestión de tu plan</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Banner de estado MercadoPago (success / failure / pending) */}
        <Suspense fallback={null}>
          <PagoStatusBanner />
        </Suspense>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400">Este mes</p>
            <p className="text-2xl font-bold text-[#40916C] mt-1">
              {totalMes.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400">Total histórico</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {totalHistorico.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Planes */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Tu plan</h2>
          <BotonesPlanes />
        </section>

        {/* Exportar */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Exportar</h2>
          <DescargaPDF />
        </section>

        {/* Historial */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Historial de pagos</h2>
          {!pagos || pagos.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-sm">No hay cobros registrados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pagos.map((p: any) => {
                const paciente = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
                return (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {paciente?.full_name ?? paciente?.email ?? "Paciente"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(p.paid_at ?? p.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                        {" · "}{p.method === "mercado_pago" ? "MercadoPago" : (p.method ?? "MercadoPago")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-sm text-gray-800">
                        {Number(p.amount).toLocaleString("es-AR", { style: "currency", currency: p.currency ?? "ARS", maximumFractionDigits: 0 })}
                      </p>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[p.status] ?? "bg-gray-50 text-gray-500"}`}>
                        {statusLabel[p.status] ?? p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
