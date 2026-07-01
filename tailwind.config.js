/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Динамикалық құрылатын accent-класстарды сақтау (JIT purge-тен қорғау)
  safelist: [
    {
      pattern: /(bg|text|border|from|to)-accent-(green|blue|purple|gold|pink|cyan|red)(\/(5|10|15|20|30|40))?/,
      variants: ["hover", "group-hover"],
    },
  ],
  theme: {
    extend: {
      colors: {
        // ── Жаңа жұмсақ ашық тақырып ──
        // Фон: жұмсақ кремді ақ (көзге жайлы, таза ақ емес)
        background: "#F7F9F7",      // негізгі фон (жұмсақ жасылдау-ақ)
        surface: "#FFFFFF",          // карталар (таза ақ)
        "surface-2": "#F0F4F1",      // екінші деңгей (жұмсақ жасылдау)
        border: "#E2E8E3",           // жиектер (жұмсақ)
        // ── Екпін: жасыл (табиғи, тыныш) ──
        "accent-green": "#16A34A",   // негізгі — табиғи жасыл
        "accent-blue": "#0EA5E9",    // көмекші — аспан көк
        "accent-gold": "#F59E0B",    // алтын (мадақтау)
        "accent-red": "#EF4444",     // қызыл (қате)
        "accent-purple": "#8B5CF6",  // күлгін (екпін)
        "accent-pink": "#EC4899",    // қызғылт (кино)
        "accent-cyan": "#06B6D4",    // көгілдір
        // ── Мәтін: жұмсақ қара (таза қара емес) ──
        "text-primary": "#1A2E22",   // негізгі (жұмсақ қою жасылдау-қара)
        "text-secondary": "#5B6B61", // көмекші (жұмсақ сұр-жасыл)
        "text-muted": "#94A39A",     // бәсең
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "16px",   // жұмсақ, дөңгелек
        btn: "10px",
      },
      boxShadow: {
        // Жұмсақ, табиғи көлеңкелер (glow емес)
        soft: "0 1px 3px rgba(26, 46, 34, 0.06), 0 1px 2px rgba(26, 46, 34, 0.04)",
        card: "0 2px 8px rgba(26, 46, 34, 0.06)",
        "card-hover": "0 4px 16px rgba(26, 46, 34, 0.1)",
        glow: "0 2px 8px rgba(22, 163, 74, 0.15)",
      },
    },
  },
  plugins: [],
};
