"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

async function cancelarPlan(
  setCancelling: (v: boolean) => void,
  setPlanActivo: (v: string | null) => void
) {
  setCancelling(true);
  try {
    const res = await fetch("/api/pagos/cancelar-plan", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setPlanActivo(null);
      alert(data.mensaje);
    } else {
      alert(data.error || "Error al cancelar");
    }
  } catch {
    alert("Error de conexión. Intentá de nuevo.");
  } finally {
    setCancelling(false);
  }
}

const PLANES = [
  { nombre: "Starter", precioARS: 16500, montoAPI: 16500, precioUSD: 15, descripcion: "Hasta 15 pacientes activos" },
  { nombre: "Pro", precioARS: 45000, montoAPI: 45000, precioUSD: 40, descripcion: "Pacientes ilimitados · Recomendado", destacado: true },
  { nombre: "Clinica", precioARS: 85000, montoAPI: 85000, precioUSD: 75, descripcion: "Múltiples profesionales" },
];

export default function BotonesPlanes() {
  const [loading, setLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [planActivo, setPlanActivo] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("professionals")
        .select("plan")
        .eq("id", user.id)
        .single();
      setPlanActivo(data?.plan ?? null);
    });
  }, []);

  async function handlePago(plan: string, monto: number) {
    setLoading(plan);
    try {
      const res = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, monto }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 401) { router.push("/login"); return; }
        alert(err.error || "Error al procesar el pago");
        return;
      }

      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      {PLANES.map((plan) => (
        <div
          key={plan.nombre}
          className={`relative rounded-2xl border p-6 flex flex-col gap-4 bg-white ${
            plan.destacado
              ? "border-[#40916C] shadow-lg ring-2 ring-[#40916C]"
              : "border-gray-200"
          }`}
        >
          {plan.destacado && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#40916C] text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                Más elegido
              </span>
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-gray-900">{plan.nombre}</h3>
            <p className="text-xs text-gray-500 mt-1">{plan.descripcion}</p>
          </div>
          <div>
            <span className="text-3xl font-bold text-gray-900">
              ${plan.precioARS.toLocaleString("es-AR")}
            </span>
            <span className="text-sm text-gray-500">/mes ARS</span>
            <p className="text-xs text-gray-400 mt-0.5">≈ USD {plan.precioUSD}/mes</p>
          </div>
          <button
            onClick={() => handlePago(plan.nombre, plan.montoAPI)}
            disabled={loading !== null}
            className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
              plan.destacado
                ? "bg-[#40916C] text-white hover:bg-[#235a41] disabled:opacity-60"
                : "border border-[#40916C] text-[#40916C] hover:bg-[#D8F3DC] disabled:opacity-60"
            }`}
          >
            {loading === plan.nombre ? "Redirigiendo..." : "Pagar ahora"}
          </button>
          {planActivo && (
            <button
              onClick={() => cancelarPlan(setCancelling, setPlanActivo)}
              disabled={cancelling || loading !== null}
              className="w-full py-2 rounded-xl text-sm font-medium border border-red-300 text-red-500 bg-transparent hover:bg-red-50 transition disabled:opacity-60"
            >
              {cancelling ? "Cancelando..." : "Cancelar plan"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
