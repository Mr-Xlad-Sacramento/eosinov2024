/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
        display: ['Epilogue', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#f28d33',
          green: '#59f566',
          magenta: '#b44aa0',
          accent: '#7f5bff',
        },
        premium: {
          bg: '#07090f',
          elevated: '#111524',
          surface: '#1a1f31',
          text: '#edf2ff',
          muted: '#97a3bf',
        },
      },
      borderRadius: {
        premium: '20px',
        capsule: '999px',
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
        premium: '0 22px 60px rgba(0, 0, 0, 0.45)',
      },
      transitionDuration: {
        180: '180ms',
        320: '320ms',
        550: '550ms',
      },
    },
  },
  plugins: [],
}
