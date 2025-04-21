import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#818cf8",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
};

export default config;
