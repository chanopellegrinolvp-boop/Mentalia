"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EliminarPaciente({ id, nombre }: { id: string; nombre: string }) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const eliminar = async () => {
    setLoading(true);
    await supabase.from("pacientes").delete().eq("id", id);
    setModal(false);
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModal(true); }}
        className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded"
      >
        Eliminar
      </button>

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Eliminar paciente</h3>
            <p className="text-sm text-gray-500 mb-6">
              Vas a eliminar a <strong>{nombre}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={eliminar}
                disabled={loading}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
