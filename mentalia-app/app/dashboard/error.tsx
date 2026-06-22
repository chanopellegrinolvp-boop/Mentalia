"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <p className="text-gray-800 font-medium">Algo salió mal</p>
        <p className="text-sm text-gray-400">{error.message || "Error inesperado"}</p>
        <button
          onClick={reset}
          className="text-sm bg-[#40916C] text-white px-5 py-2 rounded-lg hover:bg-[#235a41] transition"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
