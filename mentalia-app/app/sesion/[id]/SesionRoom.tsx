"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Sesion = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  video_room_url: string | null;
  paciente_id: string | null;
  patient_id: string | null;
  pacientes: { nombre: string; motivo_consulta: string | null } | null;
  session_notes: Array<{ id: string; content: string | null; ai_summary: string | null; temas_clave: string[]; nivel_riesgo: string | null }>;
};

export default function SesionRoom({
  sesion,
  historialPrevio,
  profesionalId,
}: {
  sesion: Sesion;
  historialPrevio: any[];
  profesionalId: string;
}) {
  const [notas, setNotas] = useState(sesion.session_notes?.[0]?.content ?? "");
  const [resumenIA, setResumenIA] = useState(sesion.session_notes?.[0]?.ai_summary ?? "");
  const [temasIA, setTemasIA] = useState<string[]>(sesion.session_notes?.[0]?.temas_clave ?? []);
  const [nivelRiesgo, setNivelRiesgo] = useState(sesion.session_notes?.[0]?.nivel_riesgo ?? "");
  const [generandoIA, setGenerandoIA] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(
    sesion.video_room_url?.startsWith("https://") ? sesion.video_room_url : null
  );
  const [iniciandoVideo, setIniciandoVideo] = useState(false);
  const [errorVideo, setErrorVideo] = useState<string | null>(null);
  const [fase, setFase] = useState<"pre" | "en-curso" | "notas" | "completada">(
    sesion.session_notes?.[0]?.ai_summary ? "completada" : "pre"
  );
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoGuardadoRef = useRef<ReturnType<typeof setTimeout>>();
  const supabase = createClient();
  const paciente = sesion.pacientes;
  const fecha = new Date(sesion.scheduled_at);

  useEffect(() => {
    setIsMobile(
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
    setMounted(true);
    if (sesion.video_room_url?.startsWith("https://") && fase === "pre") {
      setFase("en-curso");
    }
  }, []);

  // Auto-guardado de notas cada 30s
  useEffect(() => {
    if (fase !== "en-curso" && fase !== "notas") return;
    clearTimeout(autoGuardadoRef.current);
    autoGuardadoRef.current = setTimeout(() => guardarNotas(notas), 30000);
    return () => clearTimeout(autoGuardadoRef.current);
  }, [notas, fase]);

  async function iniciarVideo() {
    setErrorVideo(null);
    if (roomUrl) {
      setFase("en-curso");
      return;
    }
    setIniciandoVideo(true);
    try {
      const res = await fetch("/api/videollamada/crear-sala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sesionId: sesion.id }),
      });
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { /* respuesta no-JSON */ }
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}: ${text.slice(0, 200)}`);
      if (data.url) {
        setRoomUrl(data.url);
        setFase("en-curso");
      } else {
        throw new Error("La sala no devolvió una URL");
      }
    } catch (err: any) {
      console.error("[SesionRoom] Error iniciando video:", err);
      setErrorVideo(err.message ?? "No se pudo iniciar la videollamada");
    } finally {
      setIniciandoVideo(false);
    }
  }

  async function finalizarVideo() {
    setFase("notas");
    try {
      await fetch("/api/sesion/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sesionId: sesion.id }),
      });
    } catch (err) {
      console.error("[SesionRoom] Error finalizando sesión:", err);
    }
    if (notas.trim()) {
      generarResumenIA();
    }
  }

  async function guardarNotas(texto: string) {
    setGuardando(true);
    const noteId = sesion.session_notes?.[0]?.id;
    if (noteId) {
      await supabase.from("session_notes").update({ content: texto, updated_at: new Date().toISOString() }).eq("id", noteId);
    } else {
      await supabase.from("session_notes").insert({
        appointment_id: sesion.id,
        professional_id: profesionalId,
        patient_id: sesion.patient_id ?? null,
        session_date: new Date(sesion.scheduled_at).toISOString().split("T")[0],
        content: texto,
      });
    }
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  async function generarResumenIA() {
    if (!notas.trim()) return;
    setGenerandoIA(true);

    try {
      const contexto = historialPrevio
        ?.flatMap((s: any) => s.session_notes ?? [])
        .map((n: any) => n.ai_summary || n.content)
        .filter(Boolean)
        .slice(0, 3)
        .join("\n\n---\n\n");

      const res = await fetch("/api/ia/resumen-sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notas,
          pacienteNombre: paciente?.nombre,
          motivoConsulta: paciente?.motivo_consulta,
          historialPrevio: contexto,
        }),
      });

      if (!res.ok) throw new Error(`IA error: ${res.status}`);

      const data = await res.json();
      setResumenIA(data.resumen ?? "");
      setTemasIA(data.temas ?? []);
      setNivelRiesgo(data.nivelRiesgo ?? "bajo");
      setFase("completada");

      const noteId = sesion.session_notes?.[0]?.id;
      const payload = {
        ai_summary: data.resumen,
        temas_clave: data.temas ?? [],
        nivel_riesgo: data.nivelRiesgo ?? "bajo",
        content: notas,
      };
      if (noteId) {
        await supabase.from("session_notes").update(payload).eq("id", noteId);
      } else {
        await supabase.from("session_notes").insert({
          appointment_id: sesion.id,
          professional_id: profesionalId,
          patient_id: sesion.patient_id ?? sesion.paciente_id,
          session_date: new Date(sesion.scheduled_at).toISOString().split("T")[0],
          ...payload,
        });
      }
      await supabase.from("appointments").update({ status: "completed", ended_at: new Date().toISOString() }).eq("id", sesion.id);
    } catch (err) {
      console.error("[SesionRoom] Error generando resumen IA:", err);
    } finally {
      setGenerandoIA(false);
    }
  }

  const riesgoColor = { bajo: "text-green-600 bg-green-50", medio: "text-yellow-600 bg-yellow-50", alto: "text-red-600 bg-red-50" }[nivelRiesgo] ?? "text-gray-600 bg-gray-50";

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href={sesion.paciente_id && sesion.paciente_id !== "null" ? `/dashboard/profesional/pacientes/${sesion.paciente_id}` : "/dashboard/profesional/pacientes"}
            className="text-sm text-gray-500 hover:text-[#40916C]"
          >
            ← {paciente?.nombre ?? "Paciente"}
          </Link>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">{paciente?.nombre}</p>
            <p className="text-xs text-gray-400">
              {fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", timeZone: "America/Buenos_Aires" })} · {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Buenos_Aires" })}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {guardando ? "Guardando..." : guardado ? "✓ Guardado" : ""}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">

        {/* PRE-SESIÓN */}
        {fase === "pre" && (
          <div className="space-y-6">
            {historialPrevio && historialPrevio.length > 0 && (
              <section className="bg-[#D8F3DC]/30 border border-[#40916C]/20 rounded-xl p-5">
                <p className="text-xs font-semibold text-[#40916C] uppercase tracking-wide mb-3">Última sesión</p>
                {historialPrevio[0]?.session_notes?.[0]?.ai_summary ? (
                  <p className="text-sm text-gray-700 leading-relaxed">{historialPrevio[0].session_notes[0].ai_summary}</p>
                ) : (
                  <p className="text-sm text-gray-400">Sin notas previas.</p>
                )}
              </section>
            )}

            <div className="bg-white border border-gray-100 rounded-xl p-8 text-center space-y-4">
              <p className="text-gray-500 text-sm">Sesión programada con {paciente?.nombre}</p>
              <button
                onClick={iniciarVideo}
                disabled={iniciandoVideo}
                className="bg-[#40916C] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#235a41] transition disabled:opacity-60"
              >
                {iniciandoVideo ? "Preparando sala..." : "Iniciar videollamada"}
              </button>
              {errorVideo && (
                <p className="text-sm text-red-500">{errorVideo}</p>
              )}
              <p className="text-xs text-gray-400">O bien</p>
              <button
                onClick={() => setFase("notas")}
                className="text-sm text-[#40916C] hover:underline"
              >
                Registrar notas sin video
              </button>
            </div>
          </div>
        )}

        {/* EN CURSO — VIDEO */}
        {fase === "en-curso" && roomUrl && (
          <div className="space-y-3">
            {!mounted ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-[#40916C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isMobile ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center space-y-3">
                <button
                  onClick={() => window.open(roomUrl, "_blank")}
                  className="bg-[#40916C] text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#235a41] transition"
                >
                  Unirse a la videollamada
                </button>
                <p className="text-sm text-gray-400">La videollamada se abrirá en una nueva pestaña</p>
              </div>
            ) : (
              <iframe
                src={roomUrl}
                allow="camera *;microphone *;speaker *;autoplay *;display-capture *;fullscreen *"
                allowFullScreen
                className="w-full rounded-xl bg-black"
                style={{ height: "calc(100vh - 180px)", minHeight: "480px", border: "none", display: "block" }}
              />
            )}
            <button
              onClick={finalizarVideo}
              className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3 text-sm font-medium hover:bg-red-100 transition"
            >
              Finalizar sesión y tomar notas
            </button>
          </div>
        )}

        {/* NOTAS */}
        {(fase === "notas" || fase === "completada") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800">Notas de sesión</h2>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                rows={16}
                placeholder={`Escribe lo que observaste en la sesión con ${paciente?.nombre}...\n\nEstado emocional, temas tratados, avances, tareas para la próxima sesión.`}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#40916C] resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => guardarNotas(notas)}
                  disabled={guardando}
                  className="flex-1 border border-[#40916C] text-[#40916C] rounded-lg py-2 text-sm hover:bg-[#D8F3DC]/30 transition disabled:opacity-60"
                >
                  {guardando ? "Guardando..." : "Guardar notas"}
                </button>
                {fase !== "completada" && (
                  <button
                    onClick={generarResumenIA}
                    disabled={generandoIA || !notas.trim()}
                    className="flex-1 bg-[#40916C] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#235a41] transition disabled:opacity-60"
                  >
                    {generandoIA ? "Analizando..." : "Generar resumen IA →"}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800">Resumen IA</h2>

              {generandoIA && (
                <div className="bg-[#D8F3DC]/30 border border-[#40916C]/20 rounded-xl p-6 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-[#40916C] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-500">Analizando la sesión...</p>
                </div>
              )}

              {resumenIA && !generandoIA && (
                <div className="space-y-3">
                  <div className="bg-[#D8F3DC]/30 border border-[#40916C]/20 rounded-xl p-5">
                    <p className="text-sm text-gray-700 leading-relaxed">{resumenIA}</p>
                  </div>

                  {temasIA.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Temas identificados</p>
                      <div className="flex flex-wrap gap-2">
                        {temasIA.map(t => (
                          <span key={t} className="text-xs bg-[#40916C]/10 text-[#40916C] px-3 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {nivelRiesgo && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Nivel de riesgo</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${riesgoColor}`}>
                        {nivelRiesgo.charAt(0).toUpperCase() + nivelRiesgo.slice(1)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={generarResumenIA}
                      disabled={generandoIA}
                      className="text-xs text-gray-400 hover:text-[#40916C] transition"
                    >
                      Regenerar resumen
                    </button>
                    <Link
                      href="/dashboard/profesional"
                      className="text-xs bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#235a41] transition"
                    >
                      Volver al dashboard →
                    </Link>
                  </div>
                </div>
              )}

              {!resumenIA && !generandoIA && (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-400">El resumen aparecerá aquí después de generarlo</p>
                  <p className="text-xs text-gray-300 mt-2">Escribí las notas y presioná &quot;Generar resumen IA&quot;</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
