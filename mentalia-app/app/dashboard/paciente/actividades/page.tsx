"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CATEGORY_ICONS: Record<string, string> = {
  "Respiración": "🌬️",
  "Mindfulness": "🧘",
  "Registro cognitivo": "📝",
  "Regulación emocional": "💛",
  "Movimiento y cuerpo": "🚶",
};

const ACTIVIDADES = [
  {
    categoria: "Respiración",
    items: [
      { titulo: "Respiración 4-7-8", descripcion: "Inhalá 4 seg, retenés 7 seg, exhalás 8 seg. Repetí 4 veces. Ideal para reducir ansiedad rápidamente.", duracion: "5 min" },
      { titulo: "Respiración diafragmática", descripcion: "Mano en el pecho, mano en el abdomen. Respirá lento activando solo el abdomen. Calma el sistema nervioso.", duracion: "10 min" },
    ],
  },
  {
    categoria: "Mindfulness",
    items: [
      { titulo: "Técnica 5-4-3-2-1", descripcion: "Nombrá 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que gustás. Ancla al presente.", duracion: "5 min" },
      { titulo: "Escaneo corporal", descripcion: "Cerrá los ojos y recorré mentalmente tu cuerpo de pies a cabeza. Notá tensiones sin juzgar.", duracion: "15 min" },
      { titulo: "Observación consciente", descripcion: "Elegí un objeto y enfocate en él 2 minutos notando todos sus detalles. Entrena la atención.", duracion: "2 min" },
    ],
  },
  {
    categoria: "Registro cognitivo",
    items: [
      { titulo: "Diario de pensamientos", descripcion: "Anotá: situación → pensamiento automático → emoción → ¿qué evidencia hay? → pensamiento alternativo.", duracion: "15 min" },
      { titulo: "Tres cosas buenas", descripcion: "Cada noche escribí 3 cosas positivas que pasaron hoy y por qué ocurrieron. Construye resiliencia.", duracion: "5 min" },
    ],
  },
  {
    categoria: "Regulación emocional",
    items: [
      { titulo: "Relajación muscular progresiva", descripcion: "Tensá y relajá cada grupo muscular desde los pies hasta el cuello. Reduce tensión física y emocional.", duracion: "20 min" },
      { titulo: "Activa el nervio vago", descripcion: "Cantá, tararéa o hacé gárgaras por 2 minutos. Activa el nervio vago y calma el sistema nervioso.", duracion: "2 min" },
      { titulo: "Escritura expresiva", descripcion: "Escribí sin filtro durante 10 minutos sobre algo que te preocupa. No importa la gramática ni el orden.", duracion: "10 min" },
    ],
  },
  {
    categoria: "Movimiento y cuerpo",
    items: [
      { titulo: "Caminata consciente", descripcion: "Caminá 10 minutos enfocándote en cada paso, el contacto con el suelo, los sonidos, la temperatura.", duracion: "10 min" },
      { titulo: "Estiramiento matutino", descripcion: "5 estiramientos simples al levantarte. Cuello, hombros, espalda, piernas. Prepara el cuerpo y la mente.", duracion: "7 min" },
    ],
  },
];

const HOY = new Date().toISOString().split("T")[0];
const STORAGE_KEY = `mentalia-actividades-${HOY}`;

export default function MisActividades() {
  const router = useRouter();
  const [completadas, setCompletadas] = useState<Set<string>>(new Set());
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
      else setAuthed(true);
    });
  }, [router]);

  useEffect(() => {
    if (!authed) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setCompletadas(new Set(saved));
    } catch { /* ignore */ }
  }, [authed]);

  function toggleCompletada(titulo: string) {
    setCompletadas(prev => {
      const next = new Set(prev);
      if (next.has(titulo)) next.delete(titulo);
      else next.add(titulo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }

  const totalCompletadas = completadas.size;
  const totalActividades = ACTIVIDADES.reduce((acc, cat) => acc + cat.items.length, 0);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">Mis Actividades</h1>
            <p className="text-xs text-gray-400 mt-0.5">Ejercicios terapéuticos para practicar entre sesiones</p>
          </div>
          {totalCompletadas > 0 && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
              {totalCompletadas}/{totalActividades} hoy
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {ACTIVIDADES.map((cat) => (
          <section key={cat.categoria}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{CATEGORY_ICONS[cat.categoria]}</span>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{cat.categoria}</h2>
            </div>
            <div className="space-y-2">
              {cat.items.map((act) => {
                const done = completadas.has(act.titulo);
                return (
                  <div
                    key={act.titulo}
                    className="bg-white border rounded-xl px-5 py-4 transition-all"
                    style={{ borderColor: done ? "#40916C" : "#f3f4f6", opacity: done ? 0.75 : 1 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${done ? "line-through text-gray-400" : "text-gray-900"}`}>{act.titulo}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{act.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs bg-[#D8F3DC] text-[#40916C] px-2.5 py-1 rounded-full whitespace-nowrap">{act.duracion}</span>
                        <button
                          onClick={() => toggleCompletada(act.titulo)}
                          className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                          style={{
                            borderColor: done ? "#40916C" : "#d1d5db",
                            background: done ? "#40916C" : "transparent",
                          }}
                          aria-label={done ? "Marcar como pendiente" : "Marcar como completada"}
                        >
                          {done && (
                            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
