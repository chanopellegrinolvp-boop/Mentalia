"use client";

import { useEffect, useState } from "react";

export default function CalendlyEmbed({ url, professionalId }: { url: string; professionalId?: string }) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.event !== "calendly.event_scheduled") return;

      setBooked(true);

      // Registrar el turno en Supabase si tenemos el professional_id
      if (professionalId) {
        const eventUri: string = e.data.payload?.event?.uri ?? "";
        const inviteeUri: string = e.data.payload?.invitee?.uri ?? "";
        fetch("/api/calendly/booked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionalId, eventUri, inviteeUri }),
        }).catch(console.error);
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      document.head.removeChild(script);
      window.removeEventListener("message", onMessage);
    };
  }, [professionalId]);

  if (booked) {
    return (
      <div className="py-16 px-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Turno reservado!</h3>
        <p className="text-gris text-sm">Vas a recibir un email de confirmación con los detalles de la sesión.</p>
        <button
          onClick={() => setBooked(false)}
          className="mt-6 text-sm font-semibold hover:underline"
          style={{ color: "#2D6A4F" }}
        >
          Reservar otro turno
        </button>
      </div>
    );
  }

  return (
    <div
      className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
      data-url={url}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
