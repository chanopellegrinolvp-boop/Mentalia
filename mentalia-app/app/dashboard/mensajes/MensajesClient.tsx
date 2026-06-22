"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Mensaje = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

type Contacto = {
  id: string;
  full_name: string | null;
  email: string;
  lastMsg?: string;
};

export default function MensajesClient({ userId }: { userId: string }) {
  const supabase = useRef(createClient()).current;
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contactoActivo, setContactoActivo] = useState<Contacto | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevo, setNuevo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [offline, setOffline] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    cargarContactos();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const cargarContactos = async () => {
    const { data } = await supabase
      .from("messages")
      .select("sender_id, receiver_id, content, created_at")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (!data) return;

    const idsSet = new Set<string>();
    data.forEach(m => {
      if (m.sender_id !== userId) idsSet.add(m.sender_id);
      if (m.receiver_id !== userId) idsSet.add(m.receiver_id);
    });

    const ids = Array.from(idsSet);
    if (ids.length === 0) return;

    const { data: perfiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", ids);

    const contactosList: Contacto[] = (perfiles ?? []).map(p => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      lastMsg: data.find(m => m.sender_id === p.id || m.receiver_id === p.id)?.content,
    }));

    setContactos(contactosList);
    if (contactosList.length > 0) {
      setContactoActivo(prev => prev ?? contactosList[0]);
    }
  };

  const suscribir = useCallback((otroId: string) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel("mensajes-" + otroId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Mensaje;
          const esConversacion =
            (msg.sender_id === userId && msg.receiver_id === otroId) ||
            (msg.sender_id === otroId && msg.receiver_id === userId);
          if (esConversacion && msg.sender_id !== userId) {
            setMensajes(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [userId]);

  useEffect(() => {
    if (!contactoActivo) return;
    cargarMensajes(contactoActivo.id);
    suscribir(contactoActivo.id);

    const handleOnline = () => {
      setOffline(false);
      suscribir(contactoActivo.id);
      cargarMensajes(contactoActivo.id);
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [contactoActivo, suscribir]);

  const cargarMensajes = async (otroId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otroId}),and(sender_id.eq.${otroId},receiver_id.eq.${userId})`)
      .order("created_at", { ascending: true });
    setMensajes(data ?? []);
  };

  const borrarConversacion = async () => {
    if (!contactoActivo) return;
    if (!window.confirm("¿Borrar esta conversación? No se puede deshacer.")) return;
    const contactoBorrado = contactoActivo;
    setMensajes([]);
    setContactoActivo(null);
    setContactos(prev => prev.filter(c => c.id !== contactoBorrado.id));
    await supabase
      .from("messages")
      .delete()
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactoBorrado.id}),and(sender_id.eq.${contactoBorrado.id},receiver_id.eq.${userId})`);
  };

  const enviar = async () => {
    if (!nuevo.trim() || !contactoActivo) return;
    setEnviando(true);
    const { data: insertado, error } = await supabase
      .from("messages")
      .insert({ sender_id: userId, receiver_id: contactoActivo.id, content: nuevo.trim() })
      .select()
      .single();
    if (!error && insertado) {
      setNuevo("");
      setMensajes(prev => [...prev, insertado]);
    }
    setEnviando(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-semibold text-gray-900">Mensajes</h1>
        </div>
      </header>

      {offline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2 text-center text-xs text-yellow-700">
          Sin conexión — reconectando cuando vuelva la red...
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white border border-gray-100 rounded-xl flex overflow-hidden" style={{ height: "70vh" }}>
          {/* Contactos */}
          <div className="w-64 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Conversaciones</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contactos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8 px-4">No tenés conversaciones aún</p>
              ) : (
                contactos.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setContactoActivo(c)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 transition ${contactoActivo?.id === c.id ? "bg-[#D8F3DC]" : "hover:bg-gray-50"}`}
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">{c.full_name ?? c.email}</p>
                    {c.lastMsg && <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMsg}</p>}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            {contactoActivo ? (
              <>
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-800">{contactoActivo.full_name ?? contactoActivo.email}</p>
                  <button
                    onClick={borrarConversacion}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Borrar conversación
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                  {mensajes.map(m => {
                    const esMio = m.sender_id === userId;
                    return (
                      <div key={m.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${esMio ? "bg-[#40916C] text-white" : "bg-gray-100 text-gray-800"}`}>
                          {m.content}
                          <p className={`text-xs mt-1 ${esMio ? "text-white/60" : "text-gray-400"}`}>
                            {new Date(m.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={nuevo}
                    onChange={e => setNuevo(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviar()}
                    placeholder="Escribí un mensaje..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#40916C]/50"
                  />
                  <button
                    onClick={enviar}
                    disabled={enviando || !nuevo.trim()}
                    className="bg-[#40916C] text-white px-4 py-2.5 rounded-xl text-sm hover:bg-[#235a41] transition disabled:opacity-50"
                  >
                    Enviar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400">Seleccioná una conversación</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
