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
        brand: {
          purple: "#5B6AFF",
          "purple-dark": "#3D4ADB",
          "purple-light": "#8B96FF",
          green: "#7EE8A2",
          black: "#1E2130",
          offwhite: "#E8EDF4",
          gray: "#D1D9E6",
          card: "#252836",
          sky: "#EDF1F7",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
}
