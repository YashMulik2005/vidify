/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        bg_white: "#fafaff",
        light_black: "#1f1f1f",
        dark_black: "#050505",
        medium_black: "#121212",
        text: "#E5E7EBCC"
      }
    },
  },
  plugins: [require("daisyui")],
  darkMode: "class",
}