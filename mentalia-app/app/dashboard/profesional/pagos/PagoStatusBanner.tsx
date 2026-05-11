"use client";

import { useSearchParams } from "next/navigation";

export default function PagoStatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  if (!status) return null;

  if (status === "success") {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
        ✓ ¡Pago aprobado! Tu plan <strong>{plan}</strong> está activo. Puede tardar unos minutos en reflejarse.
      </div>
    );
  }
  if (status === "failure") {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
        ✗ El pago no pudo procesarse. Podés intentarlo de nuevo desde los planes.
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
        ⏳ Tu pago está pendiente de confirmación. Te avisaremos por email cuando se apruebe.
      </div>
    );
  }
  return null;
}
