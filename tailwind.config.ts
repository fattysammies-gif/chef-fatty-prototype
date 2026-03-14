import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fffbf4",
        "cream-card": "#fff8ed",
        "cream-border": "#e8ddd0",
        orange: "#D4600E",
        "orange-light": "#f97316",
        charcoal: "#1a1a1a",
        muted: "#78716c",
        subtle: "#a8a29e",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
