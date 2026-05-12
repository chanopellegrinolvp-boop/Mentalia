"use client";
import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-white p-1 -mr-1"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 z-50 border-t"
          style={{ background: "#2D6A4F", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col px-6 py-5 gap-4">
            <a href="#funciones" onClick={() => setOpen(false)} className="text-sm font-medium text-green-100/80 hover:text-white transition">Funciones</a>
            <a href="#precios" onClick={() => setOpen(false)} className="text-sm font-medium text-green-100/80 hover:text-white transition">Precios</a>
            <a href="#quienes" onClick={() => setOpen(false)} className="text-sm font-medium text-green-100/80 hover:text-white transition">Para quién</a>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-green-100/80 hover:text-white transition">
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold px-4 py-2.5 rounded-lg text-center transition hover:opacity-90"
              style={{ background: "#D8F3DC", color: "#2D6A4F" }}
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
