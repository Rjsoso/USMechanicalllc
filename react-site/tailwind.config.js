/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '6.5': '26px',
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '10.5': '42px',
        '11.5': '46px',
        '12.5': '50px',
        '13.5': '54px',
        '14.5': '58px',
        '15.5': '62px',
      },
      colors: {
        primary: {
          blue: '#0b21d6',
          orange: '#ff6b35',
          red: '#DC2626',
          black: '#1a1a1a',
        },
        muted: '#6b7076',
      },
      fontFamily: {
        sans: ['Fjalla One', 'sans-serif'],
        display: ['Rubik', 'sans-serif'], // For titles
      },
      screens: {
        'xl': '1440px',
        '2xl': '1920px',
        '3xl': '2560px',
      },
      keyframes: {
        scrollLeft: {
          'from': { 
            '-webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)' 
          },
          'to': { 
            '-webkit-transform': 'translateX(-50%)',
            'transform': 'translateX(-50%)' 
          },
        },
        scrollRight: {
          'from': { 
            '-webkit-transform': 'translateX(-50%)',
            'transform': 'translateX(-50%)' 
          },
          'to': { 
            '-webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)' 
          },
        },
      },
      animation: {
        'scroll-left': 'scrollLeft 15s linear infinite',
        'scroll-right': 'scrollRight 15s linear infinite',
      },
    },
  },
  plugins: [],
}

