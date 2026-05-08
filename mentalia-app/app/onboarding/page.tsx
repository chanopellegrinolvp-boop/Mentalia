"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SPECIALTIES = [
  { value: "clinica", label: "Psicología clínica" },
  { value: "infanto_juvenil", label: "Infanto-juvenil" },
  { value: "pareja", label: "Terapia de pareja" },
  { value: "familia", label: "Terapia familiar" },
  { value: "laboral", label: "Psicología laboral" },
  { value: "neuropsicologia", label: "Neuropsicología" },
  { value: "otra", label: "Otra especialidad" },
];

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [specialty, setSpecialty] = useState("clinica");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("3");
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState("5000");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Buenos Aires");
  const [modality, setModality] = useState("online");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      supabase.from("profiles").select("role, onboarding_completed").eq("id", user.id).single().then(({ data }) => {
        if (data?.onboarding_completed) {
          router.push(data.role === "professional" ? "/dashboard/profesional" : "/dashboard/paciente");
          return;
        }
        setRole(data?.role ?? "patient");
      });
    });
  }, []);

  async function finishPro() {
    if (!userId) return;
    setLoading(true);
    await supabase.from("professionals").upsert({
      id: userId,
      specialty,
      license_number: license,
      years_experience: Number(experience),
      bio,
      session_price: Number(price),
      city,
      province,
      modality,
      is_available: true,
    });
    await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
    router.push("/dashboard/profesional");
  }

  async function finishPatient() {
    if (!userId) return;
    setLoading(true);
    await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
    router.push("/buscar");
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#2D6A4F" }} />
      </div>
    );
  }

  const totalSteps = role === "professional" ? 3 : 2;

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={160} height={42} className="mx-auto mb-5" />
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="h-1.5 w-10 rounded-full transition-all duration-300"
                style={{ background: i < step ? "#2D6A4F" : "#D8F3DC" }} />
            ))}
          </div>
          <p className="text-xs text-gris">Paso {step} de {totalSteps}</p>
        </div>

        {role === "professional" ? (
          <>
            {step === 1 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Bienvenido a Mentalia!</h2>
                <p className="text-gris text-sm mb-6">Completá tu perfil para que los pacientes puedan encontrarte</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidad</label>
                    <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white">
                      {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de matrícula</label>
                    <input value={license} onChange={e => setLicense(e.target.value)}
                      placeholder="MN 12345" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Años de experiencia</label>
                    <input type="number" value={experience} onChange={e => setExperience(e.target.value)}
                      min="0" max="50" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full mt-6 py-3.5 text-white font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{ background: "#2D6A4F" }}>
                  Continuar →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Tu presentación</h2>
                <p className="text-gris text-sm mb-6">Esto verán los pacientes en tu perfil público</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sobre vos (bio)</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                      placeholder="Contá brevemente tu enfoque terapéutico y experiencia..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none"
                      onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                      <input value={city} onChange={e => setCity(e.target.value)} placeholder="Buenos Aires"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                        onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Provincia</label>
                      <input value={province} onChange={e => setProvince(e.target.value)} placeholder="Buenos Aires"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                        onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">
                    ← Atrás
                  </button>
                  <button onClick={() => setStep(3)}
                    className="flex-1 py-3.5 text-white font-semibold rounded-xl hover:opacity-90"
                    style={{ background: "#2D6A4F" }}>
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Modalidad y precio</h2>
                <p className="text-gris text-sm mb-6">Configurá cómo trabajás y tu tarifa por sesión</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de atención</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ v: "online", l: "Online" }, { v: "presencial", l: "Presencial" }, { v: "hibrido", l: "Híbrido" }].map(({ v, l }) => (
                        <button key={v} type="button" onClick={() => setModality(v)}
                          className="py-3 rounded-xl text-sm font-medium border transition-all"
                          style={{ background: modality === v ? "#2D6A4F" : "white", color: modality === v ? "white" : "#374151", borderColor: modality === v ? "#2D6A4F" : "#e5e7eb" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio por sesión (ARS)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="5000" min="0" step="500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                      onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">
                    ← Atrás
                  </button>
                  <button onClick={finishPro} disabled={loading}
                    className="flex-1 py-3.5 text-white font-semibold rounded-xl disabled:opacity-60 hover:opacity-90"
                    style={{ background: "#2D6A4F" }}>
                    {loading ? "Guardando..." : "¡Listo! Ir al panel →"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {step === 1 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🧘</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido a Mentalia!</h2>
                  <p className="text-gris text-sm">Estamos acá para ayudarte a encontrar el profesional ideal para vos</p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { icon: "🔍", title: "Directorio curado", desc: "Todos los profesionales están verificados por nuestro equipo" },
                    { icon: "📅", title: "Reserva online", desc: "Sacá turnos directamente desde la plataforma sin llamadas" },
                    { icon: "💬", title: "Mensajes seguros", desc: "Comunicación privada y confidencial con tu terapeuta" },
                    { icon: "📓", title: "Diario emocional", desc: "Registrá tu estado de ánimo entre sesiones" },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#f8faf9" }}>
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{title}</p>
                        <p className="text-xs text-gris mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full py-3.5 text-white font-semibold rounded-xl hover:opacity-90"
                  style={{ background: "#2D6A4F" }}>
                  ¡Empezar a buscar! →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Tu cuenta está lista!</h2>
                <p className="text-gris text-sm mb-6">Ahora podés buscar profesionales de salud mental y reservar sesiones</p>
                <button onClick={finishPatient} disabled={loading}
                  className="w-full py-3.5 text-white font-semibold rounded-xl disabled:opacity-60 hover:opacity-90"
                  style={{ background: "#2D6A4F" }}>
                  {loading ? "..." : "Buscar profesionales →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
