import Link from "next/link";
import Image from "next/image";

export default function PagoFallo({ searchParams }: { searchParams: { pro?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        <div className="mb-6">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} className="mx-auto" />
        </div>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: "#fee2e2" }}>
          ❌
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">El pago no se procesó</h1>
        <p className="text-gris mb-6">Hubo un problema con tu pago. Podés intentarlo de nuevo o usar otro método.</p>
        <div className="space-y-3">
          {searchParams.pro && (
            <Link href={`/profesional/${searchParams.pro}`} className="block w-full py-3 font-semibold text-white rounded-xl" style={{ background: "#2D6A4F" }}>
              Intentar de nuevo
            </Link>
          )}
          <Link href="/buscar" className="block w-full py-3 font-semibold rounded-xl border border-gray-200 text-gray-700">
            Ver otros profesionales
          </Link>
        </div>
      </div>
    </div>
  );
}
