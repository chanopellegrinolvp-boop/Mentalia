import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "verde-oscuro": "#40916C",
        "verde-claro": "#D8F3DC",
        blanco: "#FDFCFA",
        gris: "#6B7280",
      },
      fontFamily: {
        georgia: ["Georgia", "serif"],
        arial: ["Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
