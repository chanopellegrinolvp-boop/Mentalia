import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PerfilForm from "./PerfilForm";

export default async function MiPerfil() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, dni, birth_date")
    .eq("id", user.id)
    .single();

  const { data: pro } = await supabase
    .from("professionals")
    .select("bio, specialty, license_number, city, province, years_experience, modality, session_price, is_available, languages")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Mi Perfil</h1>
          <p className="text-xs text-gray-400 mt-0.5">Información visible para pacientes</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <PerfilForm profile={profile} pro={pro} />
      </main>
    </div>
  );
}
