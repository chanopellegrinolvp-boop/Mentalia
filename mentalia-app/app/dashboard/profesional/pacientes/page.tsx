import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EliminarPaciente from "./EliminarPaciente";

export default async function PacientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nombre, email, motivo_consulta, created_at")
    .eq("profesional_id", user.id)
    .eq("activo", true)
    .order("nombre");

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/profesional" className="text-sm text-gray-500 hover:text-[#40916C]">
            ← Inicio
          </Link>
          <span className="font-medium text-sm text-gray-700">Pacientes</span>
          <Link
            href="/dashboard/profesional/pacientes/nuevo"
            className="text-sm bg-[#40916C] text-white px-4 py-1.5 rounded-lg hover:bg-[#235a41] transition"
          >
            + Nuevo
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!pacientes || pacientes.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">Aún no tenés pacientes cargados</p>
            <Link
              href="/dashboard/profesional/pacientes/nuevo"
              className="inline-block mt-4 bg-[#40916C] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#235a41] transition"
            >
              Agregar primer paciente
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {pacientes.map((p: any) => (
              <div
                key={p.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-[#40916C]/30 transition"
              >
                <div className="flex items-center justify-between">
                  <Link href={`/dashboard/profesional/pacientes/${p.id}`} className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{p.nombre}</p>
                    {p.motivo_consulta && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{p.motivo_consulta}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <Link href={`/dashboard/profesional/pacientes/${p.id}`} className="text-xs text-gray-300">→</Link>
                    <EliminarPaciente id={p.id} nombre={p.nombre} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
