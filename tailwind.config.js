/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#d8dee6",
        surface: "#4f4c4a",
        "surface-muted": "#66615d",
        "surface-soft": "#cfd6de",
        "text-primary": "#474543",
        "text-secondary": "#686561",
        "border-subtle": "#6b6864",
        "glow-blue": "#9bc9ff",
        "glow-lilac": "#d7d0ff",
        "glow-amber": "#d7b28f",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
        "6xl": "3.25rem",
      },
    },
  },
  plugins: [],
};
