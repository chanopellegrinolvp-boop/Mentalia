"use client";

import { useState, useEffect } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: { full_name: string } | null;
};

function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className="text-xl transition-transform disabled:cursor-default"
          style={{ color: n <= (hover || rating) ? "#f59e0b" : "#d1d5db", lineHeight: 1 }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ professionalId, userId }: { professionalId: string; userId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    const r = await fetch(`/api/reviews?professional_id=${professionalId}`);
    setReviews(await r.json());
    setLoading(false);
  }

  useEffect(() => { loadReviews(); }, [professionalId]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || sent) return;
    setSending(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professional_id: professionalId, rating, comment }),
    });
    setSent(true);
    setSending(false);
    loadReviews();
  }

  const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Reseñas</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avg)} />
            <span className="font-bold text-gray-900">{avg.toFixed(1)}</span>
            <span className="text-sm text-gris">({reviews.length})</span>
          </div>
        )}
      </div>

      {userId && !sent && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl" style={{ background: "#f8faf9" }}>
          <p className="text-sm font-semibold text-gray-900 mb-3">Dejá tu reseña</p>
          <div className="mb-3">
            <Stars rating={rating} interactive onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Contá tu experiencia (opcional)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none"
            onFocus={e => (e.target.style.borderColor = "#2D6A4F")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />
          <button
            type="submit"
            disabled={sending}
            className="mt-3 px-5 py-2.5 text-sm text-white font-semibold rounded-xl disabled:opacity-60"
            style={{ background: "#2D6A4F" }}
          >
            {sending ? "Enviando..." : "Publicar reseña"}
          </button>
        </form>
      )}

      {sent && (
        <div className="mb-6 p-4 rounded-xl text-sm text-center font-semibold" style={{ background: "#D8F3DC", color: "#2D6A4F" }}>
          ¡Gracias por tu reseña!
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gris text-center py-4">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gris text-center py-8">Sin reseñas todavía · Sé el primero en opinar</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "#2D6A4F" }}
                  >
                    {initials(r.reviewer?.full_name ?? "?")}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{r.reviewer?.full_name ?? "Paciente"}</span>
                </div>
                <Stars rating={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-gray-700 leading-relaxed mt-2">{r.comment}</p>}
              <p className="text-xs text-gris mt-2">
                {new Date(r.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
