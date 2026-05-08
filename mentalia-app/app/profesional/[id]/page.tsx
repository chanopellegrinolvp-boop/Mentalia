import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import CalendlyEmbed from "@/components/app/CalendlyEmbed";
import PagarSesionButton from "@/components/app/PagarSesionButton";
import ReviewsSection from "@/components/app/ReviewsSection";

const specialtyLabel: Record<string, string> = {
  clinica: "Psicología clínica",
  infanto_juvenil: "Infanto-juvenil",
  pareja: "Terapia de pareja",
  familia: "Terapia familiar",
  laboral: "Psicología laboral",
  neuropsicologia: "Neuropsicología",
  otra: "Otra especialidad",
};

export default async function PerfilPublico({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professionals")
    .select("*, profiles!id(full_name, email)")
    .eq("id", params.id)
    .eq("is_available", true)
    .single();

  if (!pro) notFound();

  const profile = pro.profiles as any;
  const name = profile?.full_name ?? "Profesional";
  const initials = name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 60%, #FDFCFA 100%)" }}>
      {/* Nav */}
      <nav className="px-8 py-4 flex items-center justify-between border-b border-verde-claro/50" style={{ background: "rgba(216,243,220,0.8)", backdropFilter: "blur(12px)" }}>
        <Link href="/">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-verde-oscuro">Iniciar sesión</Link>
          <Link href="/registro" className="text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "#2D6A4F" }}>Registrarse</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Header verde */}
          <div className="px-8 py-8" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)" }}>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <p className="text-white/80 mt-0.5">{specialtyLabel[pro.specialty] ?? pro.specialty}</p>
                {pro.is_verified && (
                  <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                    ✓ Verificado por Mentalia
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-8 space-y-6">
            {pro.bio && (
              <div>
                <h2 className="text-sm font-bold text-gris uppercase tracking-wide mb-2">Sobre mí</h2>
                <p className="text-gray-700 leading-relaxed">{pro.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎓", label: "Experiencia", value: `${pro.years_experience} años` },
                { icon: "💻", label: "Modalidad", value: pro.modality === "online" ? "Online" : pro.modality === "presencial" ? "Presencial" : "Híbrido" },
                { icon: "📍", label: "Ubicación", value: [pro.city, pro.province].filter(Boolean).join(", ") || "Argentina" },
                { icon: "🏥", label: "Matrícula", value: pro.license_number || "—" },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-2xl" style={{ background: "#f8faf9" }}>
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gris">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA reserva */}
        {pro.calendly_url ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-4 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Reservar una sesión</h2>
              <p className="text-gris text-sm">
                Precio por sesión:{" "}
                <span className="font-bold text-lg" style={{ color: "#2D6A4F" }}>
                  ${Number(pro.session_price).toLocaleString("es-AR")} ARS
                </span>
              </p>
            </div>
            <CalendlyEmbed url={pro.calendly_url} professionalId={params.id} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="text-3xl mb-3">🗓️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Reservar una sesión</h2>
            <p className="text-gris text-sm mb-2">Precio por sesión</p>
            <p className="text-3xl font-bold mb-6" style={{ color: "#2D6A4F" }}>
              ${Number(pro.session_price).toLocaleString("es-AR")} ARS
            </p>
            <PagarSesionButton
              professionalId={params.id}
              professionalName={name}
              price={pro.session_price}
              specialty={pro.specialty}
            />
          </div>
        )}

        <ReviewsSection professionalId={params.id} userId={user?.id} />

        <div className="text-center mt-6">
          <Link href="/buscar" className="text-sm text-gris hover:text-gray-800 transition-colors">← Ver otros profesionales</Link>
        </div>
      </div>
    </div>
  );
}
