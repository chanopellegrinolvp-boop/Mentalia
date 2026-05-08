"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricula, setMatricula] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nombre } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Error al registrarse.");
      setLoading(false);
      return;
    }

    // Crear profile con rol profesional
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: nombre,
      role: "professional",
    });

    if (profileError) {
      setError("Error al crear perfil.");
      setLoading(false);
      return;
    }

    // Crear registro en professionals
    await supabase.from("professionals").upsert({
      id: data.user.id,
      license_number: matricula || null,
    });

    router.push("/dashboard/profesional");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFA] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-serif italic text-2xl font-bold text-[#2D6A4F]">Mentalia</span>
          <p className="text-sm text-gray-500 mt-1">Creá tu consultorio digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              placeholder="Lic. María García"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email profesional</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="vos@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              placeholder="MP 12345"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Empezar gratis — 10 días sin tarjeta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#2D6A4F] font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
