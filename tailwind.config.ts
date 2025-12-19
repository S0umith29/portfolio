import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#ffffff",
        border: "#1a1a1a",
        input: "#1a1a1a",
        ring: "#39ff14",
        primary: {
          DEFAULT: "#39ff14",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#00ffff",
          foreground: "#0a0a0a",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#a8a8a8",
        },
        accent: {
          DEFAULT: "#4dabf7",
          foreground: "#0a0a0a",
        },
        destructive: {
          DEFAULT: "#f92672",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #39ff14, 0 0 10px #39ff14" },
          "100%": { boxShadow: "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

