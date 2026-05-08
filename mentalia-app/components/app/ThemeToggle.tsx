"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mentalia-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mentalia-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mentalia-theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
      style={{ color: "rgba(255,255,255,0.65)" }}
      onMouseEnter={e => (e.currentTarget.style.color = "white")}
      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
    >
      <span className="text-base">{dark ? "☀️" : "🌙"}</span>
      <span>{dark ? "Modo claro" : "Modo oscuro"}</span>
    </button>
  );
}
