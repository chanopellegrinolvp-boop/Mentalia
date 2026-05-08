"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DemoPage() {
  useEffect(() => {
    // Ir directo al buscador — es página pública, no necesita login
    window.location.replace("/buscar");
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #FDFCFA 0%, #D8F3DC 100%)" }}
    >
      <div className="text-center max-w-sm">
        <div className="mb-8">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={200} height={54} className="mx-auto" />
        </div>
        <div
          className="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin mx-auto mb-6"
          style={{ borderTopColor: "#2D6A4F" }}
        />
        <p className="text-sm text-gray-500">Cargando demo...</p>
        <p className="text-xs text-gray-400 mt-4">
          Si no redirige,{" "}
          <Link href="/buscar" style={{ color: "#2D6A4F" }} className="underline">
            hacé clic aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
