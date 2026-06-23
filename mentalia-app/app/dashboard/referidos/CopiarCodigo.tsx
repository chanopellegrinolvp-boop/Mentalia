"use client";

import { useState } from "react";

export default function CopiarCodigo({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      onClick={copiar}
      className="text-sm bg-[#D8F3DC] text-[#40916C] px-5 py-2 rounded-lg font-medium hover:bg-[#c5eacb] transition"
    >
      {copiado ? "¡Copiado!" : "Copiar link de invitación"}
    </button>
  );
}
