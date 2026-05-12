"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ESPECIALIDADES = [
  { value: "clinica", label: "Psicología clínica" },
  { value: "infanto_juvenil", label: "Infanto-juvenil" },
  { value: "pareja", label: "Pareja" },
  { value: "familia", label: "Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "neuropsicologia", label: "Neuropsicología" },
  { value: "otra", label: "Otra" },
];

export default function PerfilForm({ profile, pro }: { profile: any; pro: any }) {
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [bio, setBio] = useState(pro?.bio ?? "");
  const [specialty, setSpecialty] = useState(pro?.specialty ?? "clinica");
  const [license, setLicense] = useState(pro?.license_number ?? "");
  const [city, setCity] = useState(pro?.city ?? "");
  const [province, setProvince] = useState(pro?.province ?? "");
  const [years, setYears] = useState(String(pro?.years_experience ?? "0"));
  const [modality, setModality] = useState(pro?.modality ?? "online");
  const [price, setPrice] = useState(String(pro?.session_price ?? "0"));
  const [available, setAvailable] = useState(pro?.is_available ?? true);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const guardar = async () => {
    setGuardando(true);
    setOk(false);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setGuardando(false); return; }

    const { error: e1 } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    const { error: e2 } = await supabase.from("professionals").update({
      bio,
      specialty,
      license_number: license,
      city,
      province,
      years_experience: parseInt(years) || 0,
      modality,
      session_price: parseFloat(price) || 0,
      is_available: available,
    }).eq("id", user.id);

    setGuardando(false);
    if (e1 || e2) {
      setError("No se pudo guardar. Intentá de nuevo.");
    } else {
      setOk(true);
      setTimeout(() => setOk(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Datos personales */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h2 className="font-medium text-gray-800 text-sm">Datos personales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nombre completo</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Teléfono</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+54 9 11 ..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
        </div>
      </div>

      {/* Perfil profesional */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h2 className="font-medium text-gray-800 text-sm">Perfil profesional</h2>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Biografía (visible para pacientes)</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Contá tu enfoque terapéutico, experiencia y especialidades..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#40916C]/50" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Especialidad</label>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50">
              {ESPECIALIDADES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Matrícula</label>
            <input value={license} onChange={e => setLicense(e.target.value)} placeholder="MP 12345" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Ciudad</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Buenos Aires" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Provincia</label>
            <input value={province} onChange={e => setProvince(e.target.value)} placeholder="CABA" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Años de experiencia</label>
            <input type="number" min={0} value={years} onChange={e => setYears(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Precio por sesión (ARS)</label>
            <input type="number" min={0} value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Modalidad</label>
            <select value={modality} onChange={e => setModality(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#40916C]/50">
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="available" checked={available} onChange={e => setAvailable(e.target.checked)} className="accent-[#40916C] w-4 h-4" />
            <label htmlFor="available" className="text-sm text-gray-700">Disponible para nuevos pacientes</label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        onClick={guardar}
        disabled={guardando}
        className="w-full bg-[#40916C] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#235a41] transition disabled:opacity-60"
      >
        {guardando ? "Guardando..." : ok ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  );
}
