"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const especialidades = [
  { value: "clinica", label: "Psicología clínica" },
  { value: "infanto_juvenil", label: "Infanto-juvenil" },
  { value: "pareja", label: "Terapia de pareja" },
  { value: "familia", label: "Terapia familiar" },
  { value: "laboral", label: "Psicología laboral" },
  { value: "neuropsicologia", label: "Neuropsicología" },
  { value: "otra", label: "Otra" },
];

export default function PerfilProfesional() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    license_number: "",
    specialty: "clinica",
    bio: "",
    session_price: "",
    years_experience: "",
    modality: "online",
    city: "",
    province: "",
    calendly_url: "",
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const [{ data: profile }, { data: pro }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone").eq("id", user.id).single(),
        supabase.from("professionals").select("*").eq("id", user.id).single(),
      ]);

      setForm(prev => ({
        ...prev,
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        license_number: pro?.license_number ?? "",
        specialty: pro?.specialty ?? "clinica",
        bio: pro?.bio ?? "",
        session_price: pro?.session_price ? String(pro.session_price) : "",
        years_experience: pro?.years_experience ? String(pro.years_experience) : "",
        modality: pro?.modality ?? "online",
        city: pro?.city ?? "",
        province: pro?.province ?? "",
        calendly_url: pro?.calendly_url ?? "",
      }));
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await Promise.all([
      supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone }).eq("id", user.id),
      supabase.from("professionals").upsert({
        id: user.id,
        license_number: form.license_number,
        specialty: form.specialty,
        bio: form.bio,
        session_price: Number(form.session_price) || 0,
        years_experience: Number(form.years_experience) || 0,
        modality: form.modality,
        city: form.city,
        province: form.province,
        is_available: true,
        calendly_url: form.calendly_url || null,
      }),
    ]);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm transition-colors bg-white";

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#2D6A4F" }} />
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil profesional</h1>
        <p className="text-gris text-sm mt-1">Esta información aparece en el directorio de Mentalia</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Datos personales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-gris">Datos personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input value={form.full_name} onChange={set("full_name")} placeholder="Lic. María García" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={set("phone")} placeholder="+54 9 11 1234 5678" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
          </div>
        </div>

        {/* Datos profesionales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-gris">Datos profesionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Matrícula</label>
              <input value={form.license_number} onChange={set("license_number")} placeholder="MN-12345" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Años de experiencia</label>
              <input type="number" value={form.years_experience} onChange={set("years_experience")} placeholder="5" min="0" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidad</label>
            <select value={form.specialty} onChange={set("specialty")} className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")}>
              {especialidades.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio / Presentación</label>
            <textarea value={form.bio} onChange={set("bio")} rows={4} placeholder="Contá quién sos, tu enfoque terapéutico y a quiénes atendés..." className={inputClass} style={{ resize: "vertical" }} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
          </div>
        </div>

        {/* Calendly */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-gris">Agenda online (Calendly)</h2>
          <p className="text-xs text-gris">Pegá tu link de Calendly y los pacientes podrán reservar turno directo desde tu perfil.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu link de Calendly</label>
            <input
              value={form.calendly_url}
              onChange={set("calendly_url")}
              placeholder="https://calendly.com/tu-nombre"
              className={inputClass}
              onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
        </div>

        {/* Consulta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-gris">Modalidad y precio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio por sesión (ARS)</label>
              <input type="number" value={form.session_price} onChange={set("session_price")} placeholder="25000" min="0" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Modalidad</label>
              <select value={form.modality} onChange={set("modality")} className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")}>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido (ambas)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
              <input value={form.city} onChange={set("city")} placeholder="Buenos Aires" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Provincia</label>
              <input value={form.province} onChange={set("province")} placeholder="CABA" className={inputClass} onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="px-8 py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-60" style={{ background: "#2D6A4F" }}>
            {saving ? "Guardando..." : "Guardar perfil"}
          </button>
          {saved && <span className="text-sm font-medium" style={{ color: "#2D6A4F" }}>✓ Guardado correctamente</span>}
        </div>
      </form>
    </div>
  );
}
