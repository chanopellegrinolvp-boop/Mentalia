import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BuscarClient from "./BuscarClient";

export default async function BuscarProfesional() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profesionales }, { data: pacienteProfile }] = await Promise.all([
    supabase
      .from("professionals")
      .select("id, specialty, bio, city, province, session_price, years_experience, modality, is_available, profiles(full_name, email)")
      .eq("is_available", true)
      .eq("verification_status", "verificado")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Buscar profesional</h1>
          <p className="text-xs text-gray-400 mt-0.5">{profesionales?.length ?? 0} profesionales disponibles</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!profesionales || profesionales.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay profesionales disponibles por el momento</p>
          </div>
        ) : (
          <BuscarClient
            profesionales={profesionales as any}
            userId={user.id}
            pacienteNombre={pacienteProfile?.full_name ?? "Paciente"}
          />
        )}
      </main>
    </div>
  );
}
