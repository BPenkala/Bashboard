/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   '#88A2F2', // Cornflower Blue
        secondary: '#D0F2D3', // Mint Green
        accent:    '#ACBEF2', // Sky Blue
        canvas:    '#F2F2F2', // Light Grey
        surface:   '#FFFFFF',
        ink: {
          DEFAULT: '#1D1F26',
          muted:   '#6B7280',
        }
      },
      borderRadius: {
        'bento': '28px',
        'inner': '16px',
      }
    },
  },
  plugins: [],
}