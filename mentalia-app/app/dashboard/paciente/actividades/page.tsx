import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ActividadesClient from "./ActividadesClient";

export default async function ActividadesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: actividades } = await supabase
    .from("therapeutic_activities")
    .select("id, title, description, type, status, content, patient_response, completed_at, due_date")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  const total = actividades?.length ?? 0;
  const completadas = actividades?.filter(a => a.status === "completed").length ?? 0;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">Mis Actividades</h1>
            <p className="text-xs text-gray-400 mt-0.5">Ejercicios asignados por tu profesional</p>
          </div>
          {total > 0 && (
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: "#D8F3DC", color: "#2D6A4F" }}
            >
              {completadas}/{total} completadas
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <ActividadesClient actividades={actividades ?? []} />
      </main>
    </div>
  );
}
