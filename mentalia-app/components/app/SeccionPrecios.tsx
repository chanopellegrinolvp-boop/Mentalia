"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PRECIOS = {
  Starter: 16500,
  Pro: 45000,
  Clinica: 85000,
};

export default function SeccionPrecios() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handlePago(plan: string, monto: number) {
    setLoading(plan);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/registro?plan=${plan.toLowerCase()}`);
        return;
      }
      const res = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, monto }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error al procesar el pago");
        return;
      }
      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch {
      alert("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="precios" className="relative overflow-hidden py-20 border-t border-gray-100" style={{ background: "#f7faf8" }}>

      {/* Logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.04 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_mentalia.svg" alt="" className="w-[700px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#40916C" }}>
            Invertí menos que una sesión
          </h2>
          <p className="text-sm max-w-md mx-auto mb-5" style={{ color: "#6B7280" }}>
            Una consulta presencial cuesta $50–$80 USD. Con Mentalia gestionás toda tu práctica por menos.
          </p>
          <div className="inline-flex items-center gap-5 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs" style={{ color: "#6B7280" }}>
            <span>✓ 10 días gratis</span>
            <span className="w-px h-3 bg-gray-200" />
            <span>✓ Sin tarjeta</span>
            <span className="w-px h-3 bg-gray-200" />
            <span>✓ Cancelás cuando querés</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 items-end">

          {/* Starter */}
          <div className="rounded-2xl flex flex-col bg-white" style={{ border: "1px solid #e5e7eb" }}>
            <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Starter</p>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>Para empezar</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>Ideal para psicólogos que se inician en la atención online</p>
            </div>
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-4xl font-bold" style={{ color: "#40916C" }}>$15</span>
                <span className="text-sm mb-1" style={{ color: "#9CA3AF" }}>USD/mes</span>
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>$ 16.500 ARS/mes</p>
            </div>
            <ul className="px-6 py-5 space-y-3 flex-1">
              {["Hasta 15 pacientes activos", "Videollamadas ilimitadas", "Historia clínica digital", "5 resúmenes con IA / mes", "Agenda y gestión de cobros"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "#4B5563" }}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="7.5" cy="7.5" r="7.5" fill="#D8F3DC"/>
                    <path d="M4.5 7.5l2 2 4-4" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
              <li className="flex items-center gap-2.5 text-xs" style={{ color: "#D1D5DB" }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                  <circle cx="7.5" cy="7.5" r="7.5" fill="#F3F4F6"/>
                  <path d="M5 10l5-5M10 10L5 5" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                IA ilimitada (disponible en Pro)
              </li>
            </ul>
            <div className="px-6 pb-6 flex flex-col gap-2">
              <Link href="/registro" className="block text-center py-2.5 rounded-xl font-semibold text-xs transition hover:opacity-80 border border-gray-200" style={{ color: "#40916C" }}>
                Empezar gratis
              </Link>
              <button
                onClick={() => handlePago("Starter", PRECIOS.Starter)}
                disabled={loading !== null}
                className="w-full py-2.5 rounded-xl font-semibold text-xs transition disabled:opacity-60"
                style={{ border: "1px solid #2D6A4F", color: "#2D6A4F", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D8F3DC")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {loading === "Starter" ? "Redirigiendo..." : "Pagar ahora"}
              </button>
            </div>
          </div>

          {/* PRO */}
          <div className="rounded-2xl flex flex-col relative overflow-hidden" style={{ background: "#40916C", boxShadow: "0 24px 72px rgba(45,106,79,0.4)", transform: "translateY(-20px)" }}>
            <div className="flex items-center justify-between px-7 py-3.5" style={{ background: "rgba(0,0,0,0.15)" }}>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#D8F3DC", color: "#40916C" }}>★ Más elegido</span>
              <span className="text-xs font-medium" style={{ color: "rgba(216,243,220,0.6)" }}>78% elige Pro</span>
            </div>
            <div className="px-7 pt-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "rgba(216,243,220,0.5)" }}>Pro</p>
              <h3 className="text-lg font-bold mb-1 text-white">Práctica completa</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(216,243,220,0.6)" }}>Para profesionales con práctica activa y en crecimiento</p>
            </div>
            <div className="px-7 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-white">$40</span>
                <span className="text-sm mb-1" style={{ color: "rgba(216,243,220,0.5)" }}>USD/mes</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(216,243,220,0.5)" }}>$ 45.000 ARS/mes · ≈ $3 por sesión</p>
            </div>
            <ul className="px-7 py-5 space-y-3 flex-1">
              {["Pacientes ilimitados", "Videollamadas ilimitadas", "Historia clínica completa", "Resúmenes IA ilimitados", "Estadísticas avanzadas", "Soporte prioritario"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(216,243,220,0.9)" }}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="7.5" cy="7.5" r="7.5" fill="rgba(216,243,220,0.2)"/>
                    <path d="M4.5 7.5l2 2 4-4" stroke="#D8F3DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="px-7 pb-7 flex flex-col gap-2">
              <Link href="/registro" className="block text-center py-3 rounded-xl font-bold text-sm transition hover:opacity-90" style={{ background: "#D8F3DC", color: "#40916C" }}>
                Empezar 10 días gratis →
              </Link>
              <button
                onClick={() => handlePago("Pro", PRECIOS.Pro)}
                disabled={loading !== null}
                className="w-full py-2.5 rounded-xl font-semibold text-xs transition disabled:opacity-60"
                style={{ border: "1px solid #2D6A4F", color: "#2D6A4F", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D8F3DC")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {loading === "Pro" ? "Redirigiendo..." : "Pagar ahora"}
              </button>
              <p className="text-center text-xs" style={{ color: "rgba(216,243,220,0.35)" }}>Sin tarjeta de crédito requerida</p>
            </div>
          </div>

          {/* Clínica */}
          <div className="rounded-2xl flex flex-col bg-white" style={{ border: "1px solid #e5e7eb" }}>
            <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Clínica</p>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>Para equipos</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>Equipos, clínicas y centros de salud mental</p>
            </div>
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-4xl font-bold" style={{ color: "#40916C" }}>$75</span>
                <span className="text-sm mb-1" style={{ color: "#9CA3AF" }}>USD/mes</span>
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>$ 85.000 ARS/mes · hasta 3 profesionales</p>
            </div>
            <ul className="px-6 py-5 space-y-3 flex-1">
              {["Todo lo de Pro incluido", "Hasta 3 profesionales", "Panel de administración", "Reportes del equipo", "Integración MercadoPago", "Onboarding dedicado"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-xs" style={{ color: "#4B5563" }}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                    <circle cx="7.5" cy="7.5" r="7.5" fill="#D8F3DC"/>
                    <path d="M4.5 7.5l2 2 4-4" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 flex flex-col gap-2">
              <Link href="/registro" className="block text-center py-2.5 rounded-xl font-semibold text-xs transition hover:opacity-90" style={{ background: "#40916C", color: "white" }}>
                Hablar con ventas
              </Link>
              <button
                onClick={() => handlePago("Clinica", PRECIOS.Clinica)}
                disabled={loading !== null}
                className="w-full py-2.5 rounded-xl font-semibold text-xs transition disabled:opacity-60"
                style={{ border: "1px solid #2D6A4F", color: "#2D6A4F", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D8F3DC")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {loading === "Clinica" ? "Redirigiendo..." : "Pagar ahora"}
              </button>
            </div>
          </div>

        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-xs" style={{ color: "#9CA3AF" }}>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Datos protegidos bajo ley 25.326
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Cobro en ARS vía MercadoPago
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Soporte en español · mismo huso horario
          </div>
        </div>

      </div>
    </section>
  );
}
