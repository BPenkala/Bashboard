/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cobalt: '#3D74B6',   // Hero / Anchor
          cream: '#FBF5DE',    // Canvas Background
          sand: '#EAC8A6',     // Utility
          cinnabar: '#DC3C22', // High Priority
          midnight: '#1B3352', // Deep Text
        }
      },
      borderRadius: {
        'squircle': '32px',    // Heritage Tech Curvature
      },
      fontFamily: {
        'poppins-reg': ['Poppins_400Regular'],
        'poppins-med': ['Poppins_500Medium'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-black': ['Poppins_900Black'],
      },
    },
  },
  plugins: [],
}