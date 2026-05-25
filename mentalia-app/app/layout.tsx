import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mentalia — Plataforma de Salud Mental para Psicólogos",
  description: "Plataforma digital de salud mental para psicólogos y pacientes. Gestioná tu consultorio online: agenda, videollamadas, historia clínica e inteligencia artificial.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mentaliasalud.online"),
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  keywords: [
    "psicólogo online",
    "salud mental digital",
    "consultorio virtual psicólogo",
    "videollamadas psicología",
    "agenda psicólogo",
    "historia clínica digital",
    "terapia online Argentina",
    "plataforma psicólogos",
    "gestión consultorio psicológico",
    "salud mental app",
  ],
  authors: [{ name: "Mentalia" }],
  creator: "Mentalia",
  publisher: "Mentalia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://mentaliasalud.online",
    title: "Mentalia — Plataforma de Salud Mental para Psicólogos",
    description: "Gestioná tu consultorio digital: agenda, videollamadas, historia clínica e IA. Para psicólogos y pacientes.",
    siteName: "Mentalia",
    images: [
      {
        url: "https://mentaliasalud.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mentalia — Plataforma de Salud Mental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentalia — Plataforma de Salud Mental",
    description: "Gestioná tu consultorio digital con videollamadas, agenda e historia clínica.",
    images: ["https://mentaliasalud.online/og-image.png"],
  },
  alternates: {
    canonical: "https://mentaliasalud.online",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={playfair.variable}>
      <body className="bg-[#FDFCFA] text-gray-800 antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
