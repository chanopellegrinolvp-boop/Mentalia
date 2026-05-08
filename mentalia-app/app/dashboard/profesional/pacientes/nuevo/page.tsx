"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoPacientePage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: prof } = await supabase
      .from("professionals")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!prof) { setError("No se encontró tu perfil profesional."); setLoading(false); return; }

    const { error: err } = await supabase.from("pacientes").insert({
      profesional_id: prof.id,
      nombre,
      email: email || null,
      telefono: telefono || null,
      motivo_consulta: motivo || null,
    });

    if (err) { setError("Error al guardar. Intentá de nuevo."); setLoading(false); return; }

    router.push("/dashboard/profesional/pacientes");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profesional/pacientes" className="text-sm text-gray-500 hover:text-[#2D6A4F]">
            ← Pacientes
          </Link>
          <span className="font-medium text-sm text-gray-700">Nuevo paciente</span>
          <div />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              placeholder="Juan Pérez"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="paciente@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="+54 11 1234-5678"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta <span className="text-gray-400 font-normal">(opcional)</span></label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ansiedad, dificultades en relaciones, duelo..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar paciente"}
          </button>
        </form>
      </main>
    </div>
  );
}
