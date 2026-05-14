import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Mentalia — Consultorio digital para psicólogos",
  description: "Plataforma de salud mental para psicólogos argentinos. Videollamadas, historia clínica digital, resumen clínico con IA y seguimiento del paciente. 10 días gratis, sin tarjeta.",
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
