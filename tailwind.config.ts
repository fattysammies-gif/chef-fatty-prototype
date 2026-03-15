import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy aliases — keep RecipePage.tsx rendering correctly
        cream: {
          DEFAULT: "#FDFAF5",
          card: "#F7F2EA",
          border: "#E2D9CC",
        },
        orange: {
          DEFAULT: "#C85C0A",
          light: "#F5E8DC",
        },
        muted: {
          DEFAULT: "#6B6258",
          light: "#A09890",
        },
        // Current palette
        ivory: {
          DEFAULT: "#FDFAF5",
          card: "#F7F2EA",
          deep: "#EFE9DF",
          border: "#E2D9CC",
        },
        sienna: {
          DEFAULT: "#C85C0A",
          hover: "#A84A08",
          light: "#F5E8DC",
          faint: "#FBF2EC",
        },
        charcoal: {
          DEFAULT: "#1A1714",
          soft: "#2D2926",
        },
        stone: {
          DEFAULT: "#6B6258",
          light: "#A09890",
          faint: "#C8C0B8",
        },
        gold: {
          DEFAULT: "#C4975A",
          light: "#F5EAD8",
          faint: "#FBF5EE",
        },
      },
      fontFamily: {
        serif: ["Georgia", '"Times New Roman"', "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.12em",
        wider: "0.08em",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 20px rgba(26, 23, 20, 0.06)",
        "card-hover": "0 8px 40px rgba(26, 23, 20, 0.12)",
        nav: "0 -1px 0 rgba(226, 217, 204, 0.8), 0 -8px 24px rgba(26, 23, 20, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
