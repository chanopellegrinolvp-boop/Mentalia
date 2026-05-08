"use client";

import { useRouter, usePathname } from "next/navigation";

const rootPaths = [
  "/dashboard/paciente",
  "/dashboard/profesional",
];

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Only show on sub-pages, not on the main dashboard roots
  const isRoot = rootPaths.includes(pathname);
  if (isRoot) return null;

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm font-medium transition-colors mb-1"
      style={{ color: "rgba(255,255,255,0.55)" }}
      onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
      onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12L6 8l4-4" />
      </svg>
      Volver
    </button>
  );
}
