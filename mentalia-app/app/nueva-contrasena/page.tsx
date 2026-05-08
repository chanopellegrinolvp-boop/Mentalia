"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) { setError("Ingresá una contraseña."); return; }
    if (password.length < 6) { setError("Mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError("No se pudo actualizar la contraseña. Pedí un nuevo link."); setLoading(false); return; }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={180} height={48} className="mx-auto" /></a>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
              <p className="text-gris text-sm">Redirigiendo al login...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Nueva contraseña</h2>
              <p className="text-gris text-sm mb-6">Elegí una contraseña segura</p>
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Nueva contraseña", value: password, setter: setPassword },
                  { label: "Repetir contraseña", value: confirm, setter: setConfirm },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type="password" value={value} onChange={e => setter(e.target.value)} placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                  </div>
                ))}
                <button type="submit" disabled={loading} className="w-full py-3.5 text-white font-semibold rounded-xl disabled:opacity-60" style={{ background: "#2D6A4F" }}>
                  {loading ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
