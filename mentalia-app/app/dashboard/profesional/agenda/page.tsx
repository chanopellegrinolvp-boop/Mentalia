import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CalendlyEmbed from "@/components/app/CalendlyEmbed";

export default async function AgendaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pro } = await supabase
    .from("professionals")
    .select("calendly_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Agenda</h1>
        <p className="text-gris text-sm mt-1">Gestioná tus turnos y disponibilidad desde Calendly</p>
      </div>

      {pro?.calendly_url ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Tu calendario de turnos</h2>
            <a
              href={pro.calendly_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
              style={{ background: "#2D6A4F" }}
            >
              Abrir en Calendly →
            </a>
          </div>
          <CalendlyEmbed url={pro.calendly_url} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🗓️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Conectá tu Calendly</h2>
          <p className="text-gris text-sm mb-6 max-w-sm mx-auto">
            Pegá tu link de Calendly en tu perfil y los pacientes podrán reservar turnos directo desde tu página.
          </p>
          <Link
            href="/dashboard/profesional/perfil"
            className="inline-block px-6 py-3 text-white font-semibold rounded-xl"
            style={{ background: "#2D6A4F" }}
          >
            Configurar mi Calendly →
          </Link>
        </div>
      )}
    </div>
  );
}
