/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#3b82f6',
        'brand-gray': '#6b7280',
      }
    },
  },
  plugins: [],
}
