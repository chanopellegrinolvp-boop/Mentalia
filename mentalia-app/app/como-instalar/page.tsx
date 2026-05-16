import Link from "next/link";

export const metadata = {
  title: "Cómo instalar Mentalia — Guía paso a paso",
  description: "Instalá Mentalia en tu celular en menos de 30 segundos. Guía para iPhone y Android.",
};

function Paso({ numero, texto }: { numero: number; texto: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
        style={{ background: "#2D6A4F" }}
      >
        {numero}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{texto}</p>
    </div>
  );
}

export default function ComoInstalarPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#2D6A4F" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold italic text-white" style={{ fontFamily: "Georgia, serif" }}>
            Mentalia
          </Link>
          <Link href="/login" className="text-xs font-medium text-white/70 hover:text-white transition">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: "#D8F3DC" }}
          >
            <span className="text-3xl">📲</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#111827", fontFamily: "Georgia, serif" }}>
            Instalá Mentalia en tu celular
          </h1>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            En menos de 30 segundos, gratis
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">

          {/* iPhone */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "white", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🍎</span>
              <h2 className="text-lg font-bold" style={{ color: "#111827" }}>En iPhone</h2>
            </div>
            <div className="space-y-4">
              <Paso numero={1} texto="Abrí Safari y entrá a mentaliasalud.online" />
              <Paso numero={2} texto='Tocá el botón compartir ↑ (abajo de la pantalla)' />
              <Paso numero={3} texto='"Agregar a pantalla de inicio"' />
              <Paso numero={4} texto='Tocá "Agregar" — ¡listo!' />
            </div>
            <p className="text-xs mt-5 pt-4 border-t border-gray-100" style={{ color: "#9CA3AF" }}>
              Solo funciona desde Safari, no Chrome
            </p>
          </div>

          {/* Android */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "white", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🤖</span>
              <h2 className="text-lg font-bold" style={{ color: "#111827" }}>En Android</h2>
            </div>
            <div className="space-y-4">
              <Paso numero={1} texto="Abrí Chrome y entrá a mentaliasalud.online" />
              <Paso numero={2} texto='"Agregar a pantalla de inicio" — tocá el banner que aparece abajo' />
              <Paso numero={3} texto="Si no aparece el banner: tocá los 3 puntos ⋮ arriba" />
              <Paso numero={4} texto='"Instalar aplicación" — ¡listo!' />
            </div>
            <p className="text-xs mt-5 pt-4 border-t border-gray-100" style={{ color: "#9CA3AF" }}>
              También disponible en Google Play Store
            </p>
          </div>
        </div>

        {/* Botón final */}
        <div className="text-center mb-8">
          <a
            href="https://mentaliasalud.online"
            className="inline-block px-10 py-4 rounded-2xl text-white text-base font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#2D6A4F" }}
          >
            Abrir Mentalia →
          </a>
        </div>

        {/* Ayuda */}
        <p className="text-center text-sm" style={{ color: "#9CA3AF" }}>
          ¿Necesitás ayuda? Escribinos a{" "}
          <a
            href="mailto:hola@mentaliasalud.online"
            className="hover:text-[#2D6A4F] transition"
            style={{ color: "#6B7280" }}
          >
            hola@mentaliasalud.online
          </a>
        </p>

      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8" style={{ borderColor: "rgba(45,106,79,0.15)" }}>
        <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
          © {new Date().getFullYear()} Mentalia · Plataforma de salud mental · Argentina
        </p>
      </footer>

    </div>
  );
}
