"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Contact = { id: string; full_name: string; role: string };
type Message = { id: string; sender_id: string; receiver_id: string; content: string; created_at: string; read: boolean };

export default function MensajesClient({ userId, userName, contacts }: { userId: string; userName: string; contacts: Contact[] }) {
  const [selected, setSelected] = useState<Contact | null>(contacts[0] ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected.id);

    const channel = supabase.channel(`chat-${userId}-${selected.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if ((msg.sender_id === userId && msg.receiver_id === selected.id) ||
            (msg.sender_id === selected.id && msg.receiver_id === userId)) {
          setMessages(prev => [...prev, msg]);
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadMessages(contactId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
      .order("created_at");
    setMessages((data as Message[]) ?? []);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !selected || sending) return;
    setSending(true);
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: selected.id, content: text.trim() });
    setText("");
    setSending(false);
  }

  const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex h-screen" style={{ maxHeight: "calc(100vh - 0px)" }}>
      {/* Sidebar contactos */}
      <aside className="w-72 border-r border-gray-100 flex flex-col" style={{ background: "#f8faf9" }}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="font-bold text-gray-900">Mensajes</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <p className="text-sm text-gris text-center p-6">Sin contactos todavía</p>
          ) : (
            contacts.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-white"
                style={{ background: selected?.id === c.id ? "white" : "transparent", borderRight: selected?.id === c.id ? "2px solid #2D6A4F" : "2px solid transparent" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "#2D6A4F" }}>
                  {initials(c.full_name)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.full_name}</p>
                  <p className="text-xs text-gris capitalize">{c.role === "professional" ? "Profesional" : "Paciente"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center"><div className="text-4xl mb-3">💬</div><p className="text-gris">Seleccioná un contacto</p></div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#2D6A4F" }}>
                {initials(selected.full_name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{selected.full_name}</p>
                <p className="text-xs text-gris capitalize">{selected.role === "professional" ? "Profesional" : "Paciente"}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gris text-sm">Empezá la conversación</div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === userId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm" style={{
                      background: isMe ? "#2D6A4F" : "white",
                      color: isMe ? "white" : "#1f2937",
                      border: isMe ? "none" : "1px solid #f3f4f6",
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}>
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-60">{new Date(msg.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Escribí un mensaje..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm"
                onFocus={e => (e.target.style.borderColor = "#2D6A4F")} onBlur={e => (e.target.style.borderColor = "#e5e7eb")} />
              <button type="submit" disabled={!text.trim() || sending}
                className="px-5 py-3 text-white font-semibold rounded-xl disabled:opacity-40 transition-all"
                style={{ background: "#2D6A4F" }}>
                Enviar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
