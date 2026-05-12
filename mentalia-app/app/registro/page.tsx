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
  const [rol, setRol] = useState<"professional" | "patient">("professional");
  const [terminos, setTerminos] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!terminos) {
      setError("Debés aceptar los términos y condiciones.");
      return;
    }
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

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: nombre,
      role: rol,
    });

    if (profileError) {
      setError("Error al crear perfil.");
      setLoading(false);
      return;
    }

    if (rol === "professional") {
      await supabase.from("professionals").upsert({
        id: data.user.id,
        license_number: matricula || null,
      });
    }

    fetch("/api/emails/bienvenida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, rol }),
    }).catch(() => {});

    router.push(rol === "professional" ? "/dashboard/profesional" : "/dashboard/paciente");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FDFCFA] px-4 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.04 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_mentalia.svg" alt="" className="w-[600px]" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#40916C] transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
        <div className="text-center mb-8">
          <span className="font-serif italic text-2xl font-bold text-[#40916C]">Mentalia</span>
          <p className="text-sm text-gray-500 mt-1">Creá tu consultorio digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Soy</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRol("professional")}
                className={`py-2.5 text-sm font-medium rounded-lg border transition ${rol === "professional" ? "border-[#40916C] bg-[#40916C] text-white" : "border-gray-200 text-gray-600 hover:border-[#40916C]/40"}`}
              >
                Profesional
              </button>
              <button
                type="button"
                onClick={() => setRol("patient")}
                className={`py-2.5 text-sm font-medium rounded-lg border transition ${rol === "patient" ? "border-[#40916C] bg-[#40916C] text-white" : "border-gray-200 text-gray-600 hover:border-[#40916C]/40"}`}
              >
                Paciente
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              placeholder="Lic. María García"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
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
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
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
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
            />
          </div>
          {rol === "professional" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                placeholder="MP 12345"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
              />
            </div>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={terminos}
              onChange={e => setTerminos(e.target.checked)}
              className="mt-0.5 accent-[#40916C]"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              Acepto los{" "}
              <a href="/terminos" target="_blank" className="text-[#40916C] hover:underline">términos y condiciones</a>
              {" "}y la{" "}
              <a href="/privacidad" target="_blank" className="text-[#40916C] hover:underline">política de privacidad</a>
            </span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#40916C] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : rol === "professional" ? "Empezar gratis — 10 días sin tarjeta" : "Crear mi cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#40916C] font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
