import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        charcoal: "#0e1118",
        slateDark: "#151b26",
        surface: {
          DEFAULT: "rgba(16, 22, 34, 0.7)",
          hover: "rgba(22, 30, 48, 0.8)",
          subtle: "rgba(255, 255, 255, 0.03)",
        },
        gold: {
          50: "#fdf8ee",
          100: "#f9eed4",
          200: "#f3dbaa",
          300: "#ecc377",
          400: "#dfb76c",
          500: "#c89b3c", // Primary Antique Gold
          600: "#ac7c2e",
          700: "#8e6c23",
          800: "#734e20",
          900: "#60411d",
        },
        realm: {
          stark: "#8a9ba8",
          targaryen: "#9e2a2b",
          baratheon: "#d4a373",
          lannister: "#c99700",
          greyjoy: "#64748b",
          martell: "#c85a17",
          tyrell: "#2d6a4f",
          arryn: "#3a86ff",
          tully: "#1d4ed8",
          nightswatch: "#212529",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-gold": "0 8px 32px 0 rgba(200, 155, 60, 0.12)",
        "subtle-glow": "0 0 15px rgba(200, 155, 60, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
