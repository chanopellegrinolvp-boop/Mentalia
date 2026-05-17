"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ASUNTOS = [
  "Consulta sobre planes",
  "Soporte técnico",
  "Quiero una demo",
  "Otro",
];

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setEnviando(false);

    if (!res.ok) {
      setError(data.error ?? "Ocurrió un error. Intentá de nuevo.");
    } else {
      setEnviado(true);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#FDFCFA" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ background: "#2D6A4F" }}
      >
        <Link href="/">
          <span
            className="text-xl font-bold italic text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Mentalia
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-white/70 hover:text-white transition"
        >
          ← Volver al inicio
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#111827" }}>
            Contactanos
          </h1>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            Estamos para ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Info lateral */}
          <div className="space-y-6">
            <div
              className="rounded-2xl p-6"
              style={{ background: "#f0faf5", border: "1px solid #D8F3DC" }}
            >
              <h2 className="font-semibold text-base mb-4" style={{ color: "#2D6A4F" }}>
                Información de contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#2D6A4F" }}>
                    Email
                  </p>
                  <span className="text-sm" style={{ color: "#374151" }}>
                    hola@mentaliasalud.online
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#2D6A4F" }}>
                    Sitio web
                  </p>
                  <a
                    href="https://mentaliasalud.online"
                    className="text-sm"
                    style={{ color: "#374151" }}
                  >
                    mentaliasalud.online
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#2D6A4F" }}>
                    Horario de atención
                  </p>
                  <p className="text-sm" style={{ color: "#374151" }}>
                    Lunes a viernes
                    <br />9:00 a 18:00 hs (ARG)
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                Respondemos todos los mensajes en menos de 24 horas hábiles.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-2">
            {enviado ? (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: "#f0faf5", border: "1px solid #D8F3DC" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#D8F3DC" }}
                >
                  <span className="text-3xl font-bold" style={{ color: "#2D6A4F" }}>✓</span>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: "#111827" }}>
                  ¡Mensaje enviado!
                </h2>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Te respondemos en menos de 24 horas.
                </p>
                <button
                  onClick={() => { setEnviado(false); setForm({ nombre: "", email: "", asunto: "", mensaje: "" }); }}
                  className="mt-6 text-sm font-medium underline"
                  style={{ color: "#2D6A4F" }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 space-y-5"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                      Nombre completo <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: "#e5e7eb" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                      Email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                      style={{ borderColor: "#e5e7eb" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                    Asunto <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    required
                    value={form.asunto}
                    onChange={(e) => setForm((f) => ({ ...f, asunto: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none bg-white transition-all"
                    style={{ borderColor: "#e5e7eb", color: form.asunto ? "#111827" : "#9ca3af" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  >
                    <option value="">Seleccioná un asunto</option>
                    {ASUNTOS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                    Mensaje <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    required
                    value={form.mensaje}
                    onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value.slice(0, 500) }))}
                    rows={5}
                    placeholder="Contanos en qué te podemos ayudar..."
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                    style={{ borderColor: "#e5e7eb", resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2D6A4F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <p className="text-xs text-right mt-1" style={{ color: "#9ca3af" }}>
                    {form.mensaje.length}/500
                  </p>
                </div>

                {error && (
                  <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60"
                  style={{ background: "#2D6A4F" }}
                >
                  {enviando ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer
        className="border-t py-6 mt-16"
        style={{ borderColor: "rgba(45,106,79,0.15)" }}
      >
        <p className="text-center text-xs" style={{ color: "#9ca3af" }}>
          © {new Date().getFullYear()} Mentalia · Plataforma de salud mental · Argentina
        </p>
      </footer>
    </div>
  );
}
