import Link from "next/link";
import Image from "next/image";

export default function PagoPendiente({ searchParams }: { searchParams: { pro?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}>
      <div className="w-full max-w-md text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        <div className="mb-6">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={150} height={40} className="mx-auto" />
        </div>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: "#fef3c7" }}>
          ⏳
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago pendiente</h1>
        <p className="text-gris mb-6">Tu pago está siendo procesado. Te avisamos por email cuando se acredite (puede tardar hasta 2 días hábiles).</p>
        <Link href="/dashboard/paciente" className="block w-full py-3 font-semibold text-white rounded-xl" style={{ background: "#2D6A4F" }}>
          Ir a mi dashboard
        </Link>
      </div>
    </div>
  );
}
