"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Ingresá tu email."); return; }
    if (!password) { setError("Ingresá tu contraseña."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      router.push(profile?.role === "professional" ? "/dashboard/profesional" : "/dashboard/paciente");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-4">
            <Image src="/logo_mentalia.svg" alt="Mentalia" width={180} height={48} />
          </a>
          <p className="text-gris text-sm">Iniciá sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none transition-colors"
                style={{ outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none transition-colors"
                onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: "#2D6A4F" }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/olvide-contrasena" className="text-sm hover:underline" style={{ color: "#2D6A4F" }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-gris">
            ¿No tenés cuenta?{" "}
            <Link href="/registro" className="font-semibold hover:underline" style={{ color: "#2D6A4F" }}>
              Registrate gratis
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gris mt-6">
          <a href="/" className="hover:underline">← Volver al inicio</a>
        </p>
      </div>
    </div>
  );
}
