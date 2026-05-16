import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-[#40916C] font-serif" style={{ fontFamily: "Georgia, serif" }}>404</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          La dirección que buscás no existe o fue movida.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-[#40916C] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#235a41] transition"
          >
            Ir al inicio
          </Link>
          <Link
            href="/dashboard/profesional"
            className="inline-block border border-[#40916C] text-[#40916C] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#D8F3DC] transition"
          >
            Mi dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
