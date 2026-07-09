"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricula, setMatricula] = useState("");
  const [rol, setRol] = useState<"professional" | "patient" | null>(null);
  const [terminos, setTerminos] = useState(false);
  const [consentDatos, setConsentDatos] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [codigoReferido, setCodigoReferido] = useState(searchParams.get("ref") ?? "");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!rol) {
      setError("Elegí si sos profesional o paciente.");
      return;
    }
    if (!terminos) {
      setError("Debés aceptar los términos y condiciones.");
      return;
    }
    if (!consentDatos) {
      setError("Necesitás prestar tu consentimiento para el tratamiento de datos de salud.");
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

    const perfilRes = await fetch("/api/auth/crear-perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.user.id,
        email,
        fullName: nombre,
        role: rol,
        matricula,
        referralCode: codigoReferido.trim().toUpperCase() || null,
        consent: consentDatos,
        consentVersion: "v1-2026-07",
      }),
    });

    if (!perfilRes.ok) {
      setError("Error al crear perfil.");
      setLoading(false);
      return;
    }

    // Sign in automático — el perfil ya está confirmado server-side
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Cuenta creada. Por favor iniciá sesión.");
      setLoading(false);
      router.push("/login");
      return;
    }

    fetch("/api/emails/bienvenida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, rol }),
    }).catch(() => {});

    if (planParam && rol === "professional") {
      router.push("/dashboard/profesional/pagos");
    } else {
      router.push(rol === "professional" ? "/dashboard/profesional" : "/dashboard/paciente");
    }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de referido <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={codigoReferido}
              onChange={e => setCodigoReferido(e.target.value.toUpperCase())}
              placeholder="Ej: MENTALIA8"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
            />
          </div>

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

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentDatos}
              onChange={e => setConsentDatos(e.target.checked)}
              className="mt-0.5 accent-[#40916C]"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              Presto mi consentimiento libre, expreso e informado para que Mentalia trate mis datos
              personales, incluidos <strong className="font-medium text-gray-600">datos de salud (datos sensibles)</strong>,
              con la finalidad de brindar el servicio de seguimiento y gestión clínica, conforme a la{" "}
              <strong className="font-medium text-gray-600">Ley 25.326</strong>. Entiendo que puedo ejercer mis derechos
              de acceso, rectificación y supresión escribiendo a{" "}
              <a href="mailto:hola@mentaliasalud.online" className="text-[#40916C] hover:underline">hola@mentaliasalud.online</a>.
            </span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !rol}
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
