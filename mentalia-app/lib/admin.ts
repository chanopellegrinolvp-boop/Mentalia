// Gate de admin por env. Poné tu(s) uid(s) en ADMIN_USER_IDS (separados por coma) en Vercel.
// Ej: ADMIN_USER_IDS="uuid-de-lucho,otro-uuid"
export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const ids = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(userId);
}
