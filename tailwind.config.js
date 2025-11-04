/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "#3b82f6",
          purple: "#a855f7",
          green: "#22c55e",
          orange: "#f97316"
        }
      }
    },
  },
  plugins: [],
}