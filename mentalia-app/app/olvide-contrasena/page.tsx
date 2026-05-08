"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Ingresá tu email."); return; }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    });

    if (err) {
      setError("No encontramos una cuenta con ese email.");
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={180} height={48} className="mx-auto" /></a>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Revisá tu email</h2>
            <p className="text-gris text-sm mb-6">Te enviamos un link para restablecer tu contraseña a <strong>{email}</strong></p>
            <Link href="/login" className="inline-block px-6 py-3 text-white font-semibold rounded-xl" style={{ background: "#2D6A4F" }}>
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Olvidé mi contraseña</h2>
            <p className="text-gris text-sm mb-6">Te mandamos un link para crear una nueva</p>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 text-white font-semibold rounded-xl disabled:opacity-60" style={{ background: "#2D6A4F" }}>
                {loading ? "Enviando..." : "Enviar link de recuperación"}
              </button>
              <p className="text-center text-sm text-gris">
                <Link href="/login" className="font-semibold hover:underline" style={{ color: "#2D6A4F" }}>← Volver al login</Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
