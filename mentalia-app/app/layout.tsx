import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Mentalia — La plataforma que organiza tu consultorio",
  description: "Gestión clínica, cobros automatizados, videoconsultas e inteligencia artificial integrados en una sola plataforma para profesionales de la salud mental.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mentalia",
  },
  formatDetection: { telephone: false },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mentalia" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('mentalia-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}` }} />
        <script defer src="/_vercel/insights/script.js" />
      </head>
      <body className="bg-blanco text-gray-800 antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
