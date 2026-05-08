"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

// Professional SVG icons — stroke-based, consistent 40px viewBox
const IconAnsiedad = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="20" cy="20" r="14" />
    <path d="M13 23 q3.5-5 7 0 q3.5 5 7 0" />
    <circle cx="15.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="24.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconTristeza = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="20" cy="19" r="13" />
    <path d="M14 26 q3-3 6 0 q3 3 6 0" />
    <circle cx="15.5" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="24.5" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <path d="M20 32 L20 37" strokeDasharray="2 2.5" opacity="0.5" />
  </svg>
);

const IconRelaciones = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="14" cy="14" r="8" />
    <circle cx="26" cy="14" r="8" />
    <path d="M20 22 Q8 28 10 36" />
    <path d="M20 22 Q32 28 30 36" />
  </svg>
);

const IconTrabajo = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="6" y="16" width="28" height="19" rx="3" />
    <path d="M14 16 v-4 a2 2 0 0 1 2-2 h8 a2 2 0 0 1 2 2 v4" />
    <line x1="6" y1="26" x2="34" y2="26" />
    <line x1="18" y1="26" x2="22" y2="26" strokeWidth="2.5" />
  </svg>
);

const IconAutoestima = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="20" cy="13" r="7" />
    <path d="M8 36 C8 28 12 24 20 24 C28 24 32 28 32 36" />
    <path d="M28 6 L29.5 9.5 L33 10 L30.5 12.5 L31 16 L28 14 L25 16 L25.5 12.5 L23 10 L26.5 9.5 Z" fill="currentColor" stroke="none" opacity="0.8" transform="scale(0.7) translate(20, 0)" />
  </svg>
);

const IconOtro = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M6 8 h28 a2 2 0 0 1 2 2 v16 a2 2 0 0 1-2 2 H22 L14 34 v-6 H8 a2 2 0 0 1-2-2 V10 a2 2 0 0 1 2-2 z" />
    <circle cx="14" cy="18" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="26" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconOnline = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="5" y="7" width="30" height="20" rx="3" />
    <line x1="14" y1="33" x2="26" y2="33" />
    <line x1="20" y1="27" x2="20" y2="33" />
    <circle cx="20" cy="17" r="4" />
    <path d="M13 12 q3-3 7-1" opacity="0.5" />
  </svg>
);

const IconPresencial = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="20" cy="11" r="6" />
    <path d="M9 36 C9 27 14 23 20 23 C26 23 31 27 31 36" />
    <path d="M28 8 C28 8 34 14 28 20 C24 24 28 28 28 28" opacity="0.4" strokeWidth="1.4" />
  </svg>
);

const IconMeDaIgual = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="14" cy="13" r="5" />
    <path d="M6 30 C6 24 10 21 14 21 C18 21 22 24 22 30" />
    <rect x="21" y="9" width="16" height="11" rx="2" />
    <line x1="21" y1="20" x2="37" y2="20" />
    <line x1="29" y1="20" x2="29" y2="24" />
    <line x1="26" y1="24" x2="32" y2="24" />
  </svg>
);

const motivos = [
  { id: "ansiedad",   Icon: IconAnsiedad,   label: "Ansiedad o estrés" },
  { id: "depresion",  Icon: IconTristeza,   label: "Tristeza o depresión" },
  { id: "relaciones", Icon: IconRelaciones,  label: "Relaciones o pareja" },
  { id: "trabajo",    Icon: IconTrabajo,     label: "Estrés laboral" },
  { id: "autoestima", Icon: IconAutoestima,  label: "Autoestima o identidad" },
  { id: "otro",       Icon: IconOtro,        label: "Otro motivo" },
];

const modalidades = [
  { id: "online",     Icon: IconOnline,      label: "Online",     sub: "Por videollamada" },
  { id: "presencial", Icon: IconPresencial,  label: "Presencial", sub: "En consultorio" },
  { id: "hibrido",    Icon: IconMeDaIgual,   label: "Me da igual", sub: "Cualquier modalidad" },
];

const specialtyLabel: Record<string, string> = {
  clinica: "Psicología clínica",
  infanto_juvenil: "Infanto-juvenil",
  pareja: "Terapia de pareja",
  familia: "Terapia familiar",
  laboral: "Psicología laboral",
  neuropsicologia: "Neuropsicología",
  otra: "Otra especialidad",
};

type Professional = {
  id: string;
  specialty: string;
  session_price: number;
  modality: string;
  years_experience: number;
  bio: string;
  is_verified: boolean;
  profiles: { full_name: string | null; email: string } | null;
};

export default function BuscarPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [motivo, setMotivo] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [precioMax, setPrecioMax] = useState(200000);
  const [provincia, setProvincia] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  async function buscarProfesionales(mod?: string) {
    setLoading(true);
    setStep(3);
    const supabase = createClient();
    const modalidadFinal = mod ?? modalidad;

    let query = supabase
      .from("professionals")
      .select("*, profiles!id(full_name, email)")
      .eq("is_available", true)
      .lte("session_price", precioMax);

    if (modalidadFinal && modalidadFinal !== "hibrido") {
      query = query.or(`modality.eq.${modalidadFinal},modality.eq.hibrido`);
    }
    if (provincia) query = query.ilike("province", `%${provincia}%`);
    if (especialidad) query = query.eq("specialty", especialidad);

    const { data } = await query;
    setProfessionals((data as unknown as Professional[]) ?? []);
    setLoading(false);
  }

  const initials = (name: string | null) =>
    (name ?? "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 60%, #FDFCFA 100%)" }}>
      {/* Nav */}
      <nav className="px-8 py-4 flex items-center justify-between border-b border-verde-claro/50" style={{ background: "rgba(216,243,220,0.7)", backdropFilter: "blur(12px)" }}>
        <Link href="/">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-verde-oscuro">Iniciar sesión</Link>
          <Link href="/registro" className="text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "#2D6A4F" }}>
            Registrarse
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* PASO 1: Motivo */}
        {step === 1 && (
          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
                Paso 1 de 2
              </div>
              <h1 className="font-georgia italic text-4xl md:text-5xl font-bold mb-3" style={{ color: "#2D6A4F" }}>
                ¿Qué te trae por aquí?
              </h1>
              <p className="text-gris text-base">Contanos brevemente y encontramos al profesional ideal para vos</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {motivos.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMotivo(m.id); setStep(2); }}
                  className="group p-7 bg-white rounded-2xl border-2 border-gray-100 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 transform"
                  style={{ borderColor: "#f3f4f6" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#2D6A4F"; e.currentTarget.style.background = "#f0faf5"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.background = "white"; }}
                >
                  <div className="flex justify-center mb-4 text-verde-oscuro" style={{ color: "#2D6A4F" }}>
                    <m.Icon />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 leading-snug">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: Modalidad */}
        {step === 2 && (
          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
                Paso 2 de 2
              </div>
              <h1 className="font-georgia italic text-4xl md:text-5xl font-bold mb-3" style={{ color: "#2D6A4F" }}>
                ¿Cómo preferís las sesiones?
              </h1>
              <p className="text-gris text-base">Podés cambiar esto más adelante sin problema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {modalidades.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setModalidad(m.id); buscarProfesionales(m.id); }}
                  className="p-8 bg-white rounded-2xl border-2 border-gray-100 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 transform"
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#2D6A4F"; e.currentTarget.style.background = "#f0faf5"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.background = "white"; }}
                >
                  <div className="flex justify-center mb-4" style={{ color: "#2D6A4F" }}>
                    <m.Icon />
                  </div>
                  <div className="text-sm font-bold text-gray-800 mb-1">{m.label}</div>
                  <div className="text-xs text-gris">{m.sub}</div>
                </button>
              ))}
            </div>

            {/* Filtros */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-700">Filtros opcionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gris mb-1">Precio máximo: ${precioMax.toLocaleString("es-AR")} ARS</label>
                  <input type="range" min="5000" max="200000" step="5000" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{ accentColor: "#2D6A4F" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gris mb-1">Provincia</label>
                  <input value={provincia} onChange={e => setProvincia(e.target.value)} placeholder="ej. CABA, Córdoba..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gris mb-1">Especialidad</label>
                  <select value={especialidad} onChange={e => setEspecialidad(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm">
                    <option value="">Todas</option>
                    <option value="clinica">Psicología clínica</option>
                    <option value="infanto_juvenil">Infanto-juvenil</option>
                    <option value="pareja">Terapia de pareja</option>
                    <option value="familia">Terapia familiar</option>
                    <option value="laboral">Psicología laboral</option>
                    <option value="neuropsicologia">Neuropsicología</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="text-sm text-gris hover:text-gray-800 transition-colors mt-5 block">
              ← Volver
            </button>
          </div>
        )}

        {/* PASO 3: Resultados */}
        {step === 3 && (
          <div>
            <div className="text-center mb-10">
              <h1 className="font-georgia italic text-3xl md:text-4xl font-bold mb-2" style={{ color: "#2D6A4F" }}>
                {loading ? "Buscando profesionales..." : `${professionals.length} profesional${professionals.length !== 1 ? "es" : ""} disponible${professionals.length !== 1 ? "s" : ""}`}
              </h1>
              <p className="text-gris text-sm">Todos verificados · Disponibles en Mentalia</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: "#2D6A4F" }} />
              </div>
            ) : (
              <div className="space-y-4">
                {professionals.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-semibold text-gray-800">Sin resultados por ahora</p>
                    <p className="text-sm text-gris mt-1 mb-4">Probá con otra modalidad o expandí los filtros</p>
                    <button onClick={() => setStep(1)} className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white" style={{ background: "#2D6A4F" }}>
                      Cambiar búsqueda
                    </button>
                  </div>
                ) : (
                  professionals.map((pro) => {
                    const name = pro.profiles?.full_name ?? "Profesional";
                    return (
                      <div key={pro.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-5 hover:shadow-md transition-all">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                          {initials(name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900">{name}</h3>
                            {pro.is_verified && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>✓ Verificado</span>
                            )}
                          </div>
                          <p className="text-sm text-gris mb-1">
                            {specialtyLabel[pro.specialty] ?? pro.specialty} · {pro.years_experience} años de experiencia
                          </p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pro.bio}</p>
                          <div className="flex items-center gap-4 text-xs text-gris flex-wrap">
                            <span>{pro.modality === "online" ? "Online" : pro.modality === "presencial" ? "Presencial" : "Híbrido"}</span>
                            <span>·</span>
                            <span>${Number(pro.session_price).toLocaleString("es-AR")} ARS / sesión</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Link href={`/profesional/${pro.id}`} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl text-center" style={{ background: "#2D6A4F" }}>
                            Reservar turno
                          </Link>
                          <Link href={`/profesional/${pro.id}`} className="px-5 py-2 text-sm font-medium rounded-xl border-2 text-center" style={{ borderColor: "#2D6A4F", color: "#2D6A4F" }}>
                            Ver perfil
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {!loading && (
              <div className="flex items-center justify-between mt-8">
                <button onClick={() => setStep(1)} className="text-sm text-gris hover:text-gray-800 transition-colors">
                  ← Cambiar preferencias
                </button>
                <button onClick={() => buscarProfesionales()} className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
                  Aplicar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
