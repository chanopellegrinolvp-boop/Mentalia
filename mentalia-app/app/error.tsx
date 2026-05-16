"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-[#40916C]" style={{ fontFamily: "Georgia, serif" }}>Error</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Algo salió mal
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Ocurrió un error inesperado. Podés intentar recargar la página o volver al inicio.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-block bg-[#40916C] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#235a41] transition"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-block border border-[#40916C] text-[#40916C] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#D8F3DC] transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
