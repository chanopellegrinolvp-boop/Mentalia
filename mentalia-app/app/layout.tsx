import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentalia",
  description: "El copiloto de IA para psicólogos latinoamericanos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#FDFCFA] text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
