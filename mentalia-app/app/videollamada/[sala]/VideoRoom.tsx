"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window { JitsiMeetExternalAPI: any; }
}

interface SavedNote { text: string; at: string }

export default function VideoRoom({
  sala,
  role,
  userId,
  appointmentId,
  patientId,
}: {
  sala: string;
  role: string;
  userId?: string | null;
  appointmentId?: string | null;
  patientId?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [nota, setNota] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [noteSaved, setNoteSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const localKey = `mentalia-nota-${sala}`;
  const supabase = createClient();

  useEffect(() => {
    // Load notes: Supabase first (if linked to appointment), else localStorage
    async function loadNotes() {
      if (appointmentId) {
        const { data } = await supabase
          .from("session_notes")
          .select("content")
          .eq("appointment_id", appointmentId)
          .maybeSingle();
        if (data?.content) {
          // Content stored as JSON array of SavedNote
          try {
            const parsed = JSON.parse(data.content);
            if (Array.isArray(parsed)) {
              setSavedNotes(parsed);
              return;
            }
          } catch { /* not JSON array — plain text from SesionRoom, don't override */ }
        }
      }
      try {
        setSavedNotes(JSON.parse(localStorage.getItem(localKey) ?? "[]"));
      } catch { /* ignore */ }
    }
    loadNotes();

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => initJitsi();
    document.head.appendChild(script);

    function initJitsi() {
      if (!containerRef.current || apiRef.current) return;
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: `mentalia-sesion-${sala}`,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        lang: "es",
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          enableNoisyMicDetection: false,
          prejoinPageEnabled: false,
          disableInviteFunctions: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: ["microphone", "camera", "chat", "desktop", "fullscreen", "hangup"],
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
      });
    }

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sala]);

  async function guardarNota() {
    if (!nota.trim()) return;
    setSaving(true);

    const newNote: SavedNote = {
      text: nota.trim(),
      at: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...savedNotes, newNote];
    setSavedNotes(updated);
    setNota("");

    // Always persist to localStorage
    localStorage.setItem(localKey, JSON.stringify(updated));

    // Persist to Supabase if linked to an appointment
    if (appointmentId && userId) {
      const { data: existing } = await supabase
        .from("session_notes")
        .select("id")
        .eq("appointment_id", appointmentId)
        .maybeSingle();

      const content = JSON.stringify(updated);
      if (existing?.id) {
        await supabase
          .from("session_notes")
          .update({ content, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("session_notes").insert({
          appointment_id: appointmentId,
          professional_id: userId,
          patient_id: patientId ?? null,
          session_date: new Date().toISOString().split("T")[0],
          content,
        });
      }
    }

    setSaving(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  const isProfessional = role === "professional";

  return (
    <div className="flex h-full">
      {/* Video */}
      <div ref={containerRef} style={{ flex: 1, minWidth: 0 }} />

      {/* Side panel — only for professionals */}
      {isProfessional && (
        <div
          className="w-72 flex-shrink-0 flex flex-col"
          style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Quick notes */}
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Notas de sesión</p>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              rows={5}
              placeholder="Observaciones, avances, temas a retomar..."
              className="w-full rounded-xl p-3 text-sm resize-none"
              style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) guardarNota(); }}
            />
            <button
              onClick={guardarNota}
              disabled={!nota.trim() || saving}
              className="w-full mt-2 py-2 text-sm font-semibold rounded-xl transition-all disabled:opacity-40"
              style={{ background: noteSaved ? "#22c55e" : "#40916C", color: "white" }}
            >
              {noteSaved ? "✓ Guardada" : saving ? "Guardando..." : "Guardar nota (Ctrl+Enter)"}
            </button>

            {/* Notes list */}
            {savedNotes.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-white/30 uppercase tracking-wider">Notas de esta sesión</p>
                {savedNotes.map((n, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <p className="text-xs text-white/30 mb-1">{n.at}</p>
                    <p className="text-xs text-white/80 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <a
              href="/dashboard/profesional/historia"
              className="block text-center py-2 text-xs rounded-xl transition-all"
              style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Ver historia clínica →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
