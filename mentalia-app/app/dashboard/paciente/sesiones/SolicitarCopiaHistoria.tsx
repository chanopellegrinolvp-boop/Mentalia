"use client";

import { useState } from "react";

export default function SolicitarCopiaHistoria() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function solicitar() {
    setEstado("enviando");
    try {
      const res = await fetch("/api/historia/solicitar-copia", { method: "POST" });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  }

  return (
    <section>
      <h2 className="font-semibold text-gray-800 mb-3">Mi historia clínica</h2>
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4">
        <p className="text-sm text-gray-600">
          Tenés derecho a acceder a una copia de tu historia clínica (Ley 26.529). Al solicitarla,
          coordinamos con tu profesional el envío a tu email.
        </p>
        {estado === "ok" ? (
          <p className="text-sm mt-3 font-medium" style={{ color: "#40916C" }}>
            Solicitud enviada. Te vamos a contactar por email para coordinar el envío.
          </p>
        ) : (
          <>
            <button
              onClick={solicitar}
              disabled={estado === "enviando"}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-60"
              style={{ background: "#40916C" }}
            >
              {estado === "enviando" ? "Enviando..." : "Solicitar copia de mi historia clínica"}
            </button>
            {estado === "error" && (
              <p className="text-sm mt-2 text-red-500">No se pudo enviar. Intentá de nuevo en unos minutos.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
