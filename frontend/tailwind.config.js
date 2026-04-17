/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#76b900",
        primaryDark: "#68a500",
        bgMain: "#0b0f0e",
        card: "rgba(255,255,255,0.05)",
        borderGlow: "rgba(118,185,0,0.3)",
      },
    },
  },
  plugins: [],
}