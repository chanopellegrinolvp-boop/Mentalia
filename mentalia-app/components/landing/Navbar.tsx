"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "nav-scrolled" : ""}`}
      style={{
        top: 32,
        background: "rgba(216,243,220,0.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(45,106,79,0.13)",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between" style={{ height: 66 }}>
        {/* Logo */}
        <a href="#" className="flex items-center flex-shrink-0">
          <Image src="/logo_mentalia.svg" alt="Mentalia" width={180} height={48} priority />
        </a>

        {/* Links centro */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "#funciones", label: "Funciones" },
            { href: "#precios", label: "Precios" },
            { href: "/registro?tipo=profesional", label: "Para profesionales" },
            { href: "/buscar", label: "Buscar psicólogo" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg transition-all hover:text-verde-oscuro"
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(45,106,79,0.08)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Derecha */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-sm font-medium text-gray-600 hover:text-verde-oscuro transition-colors px-3 py-2">
            Iniciar sesión
          </a>
          <div style={{ width: 1, height: 20, background: "rgba(45,106,79,0.2)" }}></div>
          <a
            href="/registro"
            className="flex items-center gap-1.5 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
            style={{ background: "#2D6A4F" }}
          >
            Empezar gratis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#2D6A4F" }}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
