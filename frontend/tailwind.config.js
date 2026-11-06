/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdbff',
          300: '#8ec3ff',
          400: '#58a0fe',
          500: '#327cf6',
          600: '#1f5ee9',
          700: '#1748d6',
          800: '#193bac',
          900: '#193488',
          950: '#132153',
        }
      }
    },
  },
  plugins: [],
}
