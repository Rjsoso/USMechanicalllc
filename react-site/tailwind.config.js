/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#0b21d6',
          orange: '#ff6b35',
          black: '#1a1a1a',
        },
        muted: '#6b7076',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xl': '1440px',
        '2xl': '1920px',
        '3xl': '2560px',
      },
    },
  },
  plugins: [],
}

