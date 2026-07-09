"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies_aceptadas")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 z-40 bg-[#2D6A4F] px-6 py-4 flex items-center justify-between gap-4">
      <p className="text-sm text-white">
        Usamos cookies para mejorar tu experiencia. Al continuar navegando aceptás nuestra{" "}
        <a href="/privacidad" className="underline text-[#D8F3DC]">política de privacidad</a>.
      </p>
      <button
        onClick={() => {
          localStorage.setItem("cookies_aceptadas", "true");
          setVisible(false);
        }}
        className="shrink-0 bg-[#D8F3DC] text-[#2D6A4F] text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition"
      >
        Aceptar
      </button>
    </div>
  );
}
