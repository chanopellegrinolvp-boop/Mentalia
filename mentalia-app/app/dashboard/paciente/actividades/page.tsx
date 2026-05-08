import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

export default async function MisActividades() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-semibold text-gray-900">Mis Actividades</h1>
          <p className="text-xs text-gray-400 mt-0.5">Ejercicios terapéuticos para practicar entre sesiones</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {ACTIVIDADES.map((cat) => (
          <section key={cat.categoria}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{cat.categoria}</h2>
            <div className="space-y-2">
              {cat.items.map((act) => (
                <div key={act.titulo} className="bg-white border border-gray-100 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{act.titulo}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{act.descripcion}</p>
                    </div>
                    <span className="text-xs bg-[#D8F3DC] text-[#2D6A4F] px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">{act.duracion}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
