"use client";

import { useState } from "react";

type Props = {
  professionalId: string;
  professionalName: string;
  price: number;
  specialty: string;
};

export default function PagarSesionButton({ professionalId, professionalName, price, specialty }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePagar() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pagos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalId, professionalName, price, specialty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el pago");
      window.location.href = data.init_point;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePagar}
        disabled={loading}
        className="block w-full py-4 text-white font-bold text-lg rounded-2xl hover:shadow-lg transition-all disabled:opacity-60"
        style={{ background: "#2D6A4F" }}
      >
        {loading ? "Redirigiendo a MercadoPago..." : `Pagar sesión $${Number(price).toLocaleString("es-AR")} ARS`}
      </button>
      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
      <p className="text-xs text-gris mt-3 text-center">Pagás con MercadoPago · 100% seguro</p>
    </div>
  );
}
