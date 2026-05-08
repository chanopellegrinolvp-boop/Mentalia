"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Role = "patient" | "professional";

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}><div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#2D6A4F" }} /></div>}>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [refCode, setRefCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref);
    const tipo = searchParams.get("tipo");
    if (tipo === "profesional") { setRole("professional"); setStep(2); }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Ingresá tu nombre completo."); return; }
    if (!email.trim()) { setError("Ingresá tu email."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("El formato del email no es válido."); return; }
    if (!password) { setError("Ingresá una contraseña."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }

    setLoading(true);

    // 1. Crear usuario ya confirmado vía admin API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, refCode: refCode || undefined }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Error al crear la cuenta");
      setLoading(false);
      return;
    }

    // 2. Login automático con las credenciales recién creadas
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Cuenta creada. Iniciá sesión manualmente.");
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
        <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Revisá tu email!</h2>
          <p className="text-gris mb-6">
            Te enviamos un link de confirmación a{" "}
            <strong className="text-gray-800">{email}</strong>.<br />
            Hacé click en el link para activar tu cuenta.
          </p>
          <Link href="/login" className="inline-block px-6 py-3 text-white font-semibold rounded-xl" style={{ background: "#2D6A4F" }}>
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-4">
            <Image src="/logo_mentalia.svg" alt="Mentalia" width={180} height={48} />
          </a>
          <p className="text-gris text-sm">Creá tu cuenta gratuita · 10 días sin tarjeta</p>
        </div>

        {step === 1 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">¿Cómo vas a usar Mentalia?</h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {[
                { r: "patient" as Role, icon: "🧘", title: "Soy paciente", desc: "Busco un profesional de salud mental" },
                { r: "professional" as Role, icon: "🩺", title: "Soy profesional", desc: "Psicólogo/a, terapeuta o counselor" },
              ].map(({ r, icon, title, desc }) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setStep(2); }}
                  className="p-6 bg-white border-2 border-gray-200 rounded-2xl text-left hover:shadow-md transition-all group"
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#2D6A4F"; e.currentTarget.style.background = "#f0faf3"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "white"; }}
                >
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="font-bold text-gray-900">{title}</div>
                  <div className="text-sm text-gris mt-1">{desc}</div>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gris">
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: "#2D6A4F" }}>
                Iniciá sesión
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-gris hover:text-gray-800 mb-6 transition-colors"
            >
              ← Cambiar tipo de cuenta
            </button>

            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl" style={{ background: "#D8F3DC40" }}>
              <span className="text-xl">{role === "patient" ? "🧘" : "🩺"}</span>
              <span className="text-sm font-medium" style={{ color: "#2D6A4F" }}>
                {role === "patient" ? "Cuenta de paciente" : "Cuenta de profesional"}
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {[
                { label: "Nombre completo", value: name, setter: setName, type: "text", placeholder: "María García" },
                { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "tu@email.com" },
                { label: "Contraseña", value: password, setter: setPassword, type: "password", placeholder: "Mínimo 6 caracteres" },
              ].map(({ label, value, setter, type, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm transition-colors"
                    style={{ outline: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-white font-semibold rounded-xl transition-all disabled:opacity-60 mt-2"
                style={{ background: "#2D6A4F" }}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
              </button>

              <p className="text-xs text-gris text-center">
                Al registrarte aceptás los{" "}
                <a href="#" className="hover:underline" style={{ color: "#2D6A4F" }}>Términos</a>{" "}
                y la{" "}
                <a href="#" className="hover:underline" style={{ color: "#2D6A4F" }}>Política de Privacidad</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
