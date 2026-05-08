"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function AdminClient({ professionals, recentUsers, stats }: any) {
  const [pros, setPros] = useState(professionals);
  const [tab, setTab] = useState<"profesionales" | "usuarios">("profesionales");
  const supabase = createClient();

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from("professionals").update({ is_verified: !current }).eq("id", id);
    setPros((prev: any[]) => prev.map((p: any) => p.id === id ? { ...p, is_verified: !current } : p));
  }

  return (
    <div className="min-h-screen" style={{ background: "#f0f7f2" }}>
      <nav className="px-8 py-4 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm">
        <Link href="/"><Image src="/logo_mentalia.svg" alt="Mentalia" width={140} height={36} /></Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: "#2D6A4F" }}>Panel Admin</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Usuarios totales", value: stats.totalUsers, icon: "👥" },
            { label: "Profesionales", value: stats.totalPros, icon: "🩺" },
            { label: "Verificados", value: stats.verifiedPros, icon: "✅" },
            { label: "Turnos totales", value: stats.totalAppointments, icon: "🗓️" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gris mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["profesionales", "usuarios"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
              style={{ background: tab === t ? "#2D6A4F" : "white", color: tab === t ? "white" : "#6B7280", border: "1px solid", borderColor: tab === t ? "#2D6A4F" : "#e5e7eb" }}>
              {t === "profesionales" ? "Profesionales" : "Usuarios recientes"}
            </button>
          ))}
        </div>

        {tab === "profesionales" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Profesionales registrados</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {pros.map((pro: any) => {
                const profile = pro.profiles as any;
                return (
                  <div key={pro.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                      {(profile?.full_name ?? "?").split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{profile?.full_name ?? "Sin nombre"}</p>
                      <p className="text-xs text-gris truncate">{profile?.email} · Mat: {pro.license_number || "—"} · {pro.specialty}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={`/profesional/${pro.id}`} target="_blank" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Ver perfil</a>
                      <button onClick={() => toggleVerified(pro.id, pro.is_verified)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                        style={{ background: pro.is_verified ? "#fee2e2" : "#D8F3DC", color: pro.is_verified ? "#ef4444" : "#2D6A4F" }}>
                        {pro.is_verified ? "Quitar verificación" : "✓ Verificar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "usuarios" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Usuarios recientes</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentUsers.map((u: any) => (
                <div key={u.email} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{u.full_name ?? "Sin nombre"}</p>
                    <p className="text-xs text-gris">{u.email}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: u.role === "professional" ? "#D8F3DC" : "#f3f4f6", color: u.role === "professional" ? "#2D6A4F" : "#6B7280" }}>
                    {u.role === "professional" ? "Profesional" : "Paciente"}
                  </span>
                  <span className="text-xs text-gris">{new Date(u.created_at).toLocaleDateString("es-AR")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
