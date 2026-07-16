/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./admin.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Hue-matched to the Progma logo (a magenta-leaning purple, hue ~283°)
        // rather than Tailwind's default blue-leaning violet (hue ~250-263°).
        // Saturation/lightness per step mirrors Tailwind's own violet scale,
        // so contrast and usability stay identical — only the hue shifted.
        violet: {
          50: "#fcf3ff",
          100: "#f8e9fe",
          200: "#f3d6fe",
          300: "#e9b5fd",
          400: "#db8bfa",
          500: "#ca5cf6",
          600: "#ba3aed",
          700: "#a728d9",
          800: "#8c21b6",
          900: "#731d95",
          950: "#4d1065",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        jb: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "float-slow": "floatSlow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
