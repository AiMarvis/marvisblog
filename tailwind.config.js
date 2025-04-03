/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0B0E18',
        'space-navy': '#1A1F35',
        'space-purple': '#6B3FA0',
        'space-accent': '#8E4FFF',
        'space-glow': '#B39DDB',
        'space-light': '#E2E8F0',
      },
      backgroundImage: {
        'star-pattern': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '700': '700ms',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 