import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Mentalia — Consultorio digital para psicólogos",
  description: "Espacio digital de salud mental que conecta profesionales con quienes cuidan su bienestar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentaliasalud.online"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Mentalia — Consultorio digital para psicólogos",
    description: "Gestión completa del consultorio: agenda, historia clínica, videollamadas y resumen clínico con IA. Argentina.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentaliasalud.online",
    siteName: "Mentalia",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentalia — Consultorio digital para psicólogos",
    description: "Gestión completa del consultorio: agenda, historia clínica, videollamadas y resumen clínico con IA.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#FDFCFA] text-gray-800 antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
