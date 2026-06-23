"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SavedNote { text: string; at: string }

export default function VideoRoom({
  sala,
  role,
  userId,
  appointmentId,
  patientId,
  roomUrl,
}: {
  sala: string;
  role: string;
  userId?: string | null;
  appointmentId?: string | null;
  patientId?: string | null;
  roomUrl?: string | null;
}) {
  const [nota, setNota] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [noteSaved, setNoteSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentRoomUrl, setCurrentRoomUrl] = useState(roomUrl ?? null);
  const [joinedMobile, setJoinedMobile] = useState(false);
  const [pollingTimeout, setPollingTimeout] = useState(false);
  const attemptsRef = useRef(0);

  const localKey = `mentalia-nota-${sala}`;
  const supabase = createClient();

  useEffect(() => {
    setIsMobile(
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentRoomUrl || !appointmentId) return;
    attemptsRef.current = 0;
    const interval = setInterval(async () => {
      attemptsRef.current += 1;
      if (attemptsRef.current > 120) {
        clearInterval(interval);
        setPollingTimeout(true);
        return;
      }
      const { data } = await supabase
        .from("appointments")
        .select("video_room_url")
        .eq("id", appointmentId)
        .maybeSingle();
      const url = data?.video_room_url;
      if (url?.startsWith("https://")) {
        setCurrentRoomUrl(url);
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [appointmentId, currentRoomUrl]);

  useEffect(() => {
    async function loadNotes() {
      if (appointmentId) {
        const { data } = await supabase
          .from("session_notes")
          .select("content")
          .eq("appointment_id", appointmentId)
          .maybeSingle();
        if (data?.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (Array.isArray(parsed)) { setSavedNotes(parsed); return; }
          } catch (e) { console.error("Error parsing notes response:", e); }
          const lines = data.content.split("\n").filter((l: string) => l.trim());
          const notes = lines.map((line: string) => {
            const m = line.match(/^\[(\d{2}:\d{2})\] (.+)$/);
            return m ? { at: m[1], text: m[2] } : { at: "", text: line };
          });
          if (notes.length > 0) { setSavedNotes(notes); return; }
        }
      }
      try {
        setSavedNotes(JSON.parse(localStorage.getItem(localKey) ?? "[]"));
      } catch { /* ignore */ }
    }
    loadNotes();
  }, [appointmentId]);

  async function guardarNota() {
    if (!nota.trim()) return;
    setSaving(true);

    const newNote: SavedNote = {
      text: nota.trim(),
      at: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Buenos_Aires" }),
    };
    const updated = [...savedNotes, newNote];
    setSavedNotes(updated);
    setNota("");

    localStorage.setItem(localKey, JSON.stringify(updated));

    if (appointmentId && userId) {
      const { data: existing } = await supabase
        .from("session_notes")
        .select("id")
        .eq("appointment_id", appointmentId)
        .maybeSingle();

      const content = updated.map(n => `[${n.at}] ${n.text}`).join("\n");
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
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }}>
      {/* Video */}
      {!mounted ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#40916C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : !currentRoomUrl ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "32px", textAlign: "center" }}>
          {pollingTimeout ? (
            <>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", margin: 0 }}>Tu profesional aún no ha iniciado la sesión.</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Podés refrescar la página para reintentar.</p>
              <button
                onClick={() => window.location.reload()}
                style={{ marginTop: "8px", background: "#40916C", color: "white", padding: "10px 28px", borderRadius: "10px", fontSize: "14px", border: "none", cursor: "pointer" }}
              >
                Refrescar
              </button>
            </>
          ) : (
            <>
              <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#40916C", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 8 }} />
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", margin: 0 }}>Esperando que el profesional inicie la sesión...</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>La sala se abrirá automáticamente</p>
            </>
          )}
        </div>
      ) : isMobile ? (
        joinedMobile ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "32px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "20px", fontWeight: 600, margin: 0 }}>Tu videollamada está en curso en otra pestaña</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>Cuando termines, cerrá esa pestaña y volvé aquí</p>
            <button
              onClick={() => window.open(currentRoomUrl!, "_blank")}
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", padding: "12px 28px", borderRadius: "12px", fontSize: "15px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
            >
              Volver a unirse
            </button>
            <a
              href={role === "professional" ? "/dashboard/profesional" : "/dashboard/paciente"}
              style={{ background: "#40916C", color: "white", padding: "14px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, textDecoration: "none", display: "inline-block" }}
            >
              Volver al inicio
            </a>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <button
              onClick={() => { window.open(currentRoomUrl!, "_blank"); setJoinedMobile(true); }}
              style={{ background: "#40916C", color: "white", padding: "16px 40px", borderRadius: "12px", fontSize: "18px", fontWeight: "bold", border: "none", cursor: "pointer" }}
            >
              Unirse a la videollamada
            </button>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>La videollamada se abrirá en una nueva pestaña</p>
          </div>
        )
      ) : (
        <iframe
          src={currentRoomUrl}
          allow="camera *;microphone *;speaker *;autoplay *;display-capture *;fullscreen *"
          allowFullScreen
          style={{ flex: 1, minWidth: 0, border: "none", height: "100%" }}
        />
      )}

      {/* Side panel — only for professionals */}
      {isProfessional && (
        <div
          className="w-72 flex-shrink-0 flex flex-col"
          style={{ background: "#111827", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        >
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
