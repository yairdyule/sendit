/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        display: ["Helvetica"],
      },
      colors: {
        dark: {
          1000: "#1c1c1c",
          border: "#343434",
        },
        card: {
          dark: "#232323",
          lighter: "#282828",
        },
      },
    },
  },
  plugins: [],
};
