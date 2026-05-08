"use client";

import { useState, useEffect } from "react";

export default function ReferidosClient({ referralCode, referrals, userName }: {
  referralCode: string;
  referrals: any[];
  userName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://mentalia.com.ar");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const referralUrl = `${origin}/registro?ref=${referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = `¡Te invito a Mentalia! La plataforma de salud mental para encontrar tu psicólogo ideal 🧠\n\nRegistrate gratis y empezá tu prueba de 10 días: ${referralUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Programa de referidos</h1>
        <p className="text-gris text-sm">Invitá colegas o conocidos y ayudá a hacer crecer la comunidad de Mentalia</p>
      </div>

      {/* Tarjeta con código */}
      <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)" }}>
        <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.75)" }}>Tu código de referido</p>
        <p className="text-4xl font-bold text-white tracking-widest mb-6">{referralCode.toUpperCase()}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={copyLink}
            className="px-5 py-2.5 bg-white text-sm font-semibold rounded-xl transition-all hover:shadow-md"
            style={{ color: "#2D6A4F" }}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar link"}
          </button>
          <button onClick={shareWhatsApp}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all">
            📲 Compartir por WhatsApp
          </button>
        </div>
      </div>

      {/* Link */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <p className="text-xs font-bold text-gris uppercase tracking-wide mb-2">Tu link de invitación</p>
        <p className="text-sm text-gray-700 break-all" style={{ fontFamily: "monospace" }}>{referralUrl}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{referrals.length}</div>
          <div className="text-sm text-gris">Personas invitadas</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <div className="text-lg font-bold mb-1" style={{ color: "#2D6A4F" }}>Próximamente</div>
          <div className="text-sm text-gris">Beneficios y descuentos</div>
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
        <div className="space-y-3">
          {[
            { step: "1", text: "Compartí tu link o código con colegas y conocidos" },
            { step: "2", text: "Ellos se registran en Mentalia usando tu código" },
            { step: "3", text: "Ambos obtienen beneficios exclusivos (próximamente)" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                {step}
              </div>
              <p className="text-sm text-gray-700 pt-0.5">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de referidos */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Personas que se unieron con tu código</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {referrals.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-6 py-3.5">
                <p className="text-sm font-medium text-gray-900">{(r.profiles as any)?.full_name ?? "Usuario"}</p>
                <p className="text-xs text-gris">{new Date(r.created_at).toLocaleDateString("es-AR")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
