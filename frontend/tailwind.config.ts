/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
primary: {
  50:  '#f9f4eb',
  100: '#f3e5c9',
  200: '#edd195',
  300: '#e7bc61',
  400: '#e0aa3a',
  500: '#d7a659', // base
  600: '#c2954f',
  700: '#a77d42',
  800: '#866637',
  900: '#594426',
  950: '#332615',
},


     secondary: {
  50:  '#f9efed',
  100: '#f2d9d3',
  200: '#e6b2a7',
  300: '#da8b7a',
  400: '#ce6751',
  500: '#b8543e', // base
  600: '#9c4635',
  700: '#803a2e',
  800: '#662f26',
  900: '#3d1b16',
  950: '#1f0d0b',
},

      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
