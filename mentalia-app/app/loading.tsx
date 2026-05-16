export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-4 border-[#D8F3DC] animate-spin"
          style={{ borderTopColor: "#40916C" }}
        />
        <span className="text-sm text-gray-400">Cargando...</span>
      </div>
    </div>
  );
}
