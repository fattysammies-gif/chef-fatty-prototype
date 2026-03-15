import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        "cream-card": "#F3EEE6",
        "cream-border": "#E8E0D0",
        orange: "#D4600E",
        "orange-hover": "#B85209",
        "orange-light": "#F5EAE0",
        charcoal: "#1C1917",
        muted: "#6B6560",
        "muted-light": "#A09890",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
