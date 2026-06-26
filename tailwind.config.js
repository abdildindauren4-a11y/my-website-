/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // LinguaFast дизайн жүйесі (жоспардан)
        background: "#0D0D1A",
        surface: "#13132A",
        "surface-2": "#1A1A38",
        border: "#1E1E3F",
        // Акценттер
        "accent-blue": "#4F46E5",
        "accent-green": "#10B981",
        "accent-gold": "#F59E0B",
        "accent-red": "#EF4444",
        "accent-purple": "#8B5CF6",
        "accent-pink": "#EC4899",
        "accent-cyan": "#06B6D4",
        // Мәтін
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#475569",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(79, 70, 229, 0.3)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
      },
    },
  },
  plugins: [],
};
