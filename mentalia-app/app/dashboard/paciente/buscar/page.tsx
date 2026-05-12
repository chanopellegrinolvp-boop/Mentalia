import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ESPECIALIDADES: Record<string, string> = {
  clinica: "Psicología clínica",
  infanto_juvenil: "Infanto-juvenil",
  pareja: "Pareja",
  familia: "Familia",
  laboral: "Laboral",
  neuropsicologia: "Neuropsicología",
  otra: "Otra",
};

export default async function BuscarProfesional() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profesionales } = await supabase
    .from("professionals")
    .select("id, specialty, bio, city, province, session_price, years_experience, modality, is_available, profiles(full_name, email)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(30);

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
          <div className="space-y-3">
            {profesionales.map((p: any) => {
              const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              return (
                <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-5 py-5 hover:border-[#40916C]/30 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900">{profile?.full_name ?? "Profesional"}</p>
                        {p.is_available && (
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Disponible</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {p.specialty && (
                          <span className="text-xs text-[#40916C] bg-[#D8F3DC] px-2 py-0.5 rounded-full">
                            {ESPECIALIDADES[p.specialty] ?? p.specialty}
                          </span>
                        )}
                        {p.city && <span className="text-xs text-gray-400">{p.city}{p.province ? `, ${p.province}` : ""}</span>}
                        {p.modality && (
                          <span className="text-xs text-gray-400 capitalize">{p.modality === "online" ? "Online" : p.modality === "presencial" ? "Presencial" : "Online y presencial"}</span>
                        )}
                      </div>
                      {p.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.bio}</p>}
                      <div className="flex items-center gap-4 mt-3">
                        {p.years_experience > 0 && (
                          <span className="text-xs text-gray-500">{p.years_experience} años de experiencia</span>
                        )}
                        {p.session_price > 0 && (
                          <span className="text-xs font-medium text-gray-700">
                            ${Number(p.session_price).toLocaleString("es-AR")} / sesión
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`mailto:${profile?.email}`}
                      className="text-sm bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition"
                    >
                      Contactar
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
