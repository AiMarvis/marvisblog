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
        'space-dark': '#0f1119',
        'space-navy': '#1a1e2e',
        'space-light': '#eef1ff',
        'space-accent': '#7c66dc',
        'space-glow': '#6652da',
        'space-purple': '#9d71e8',
        'cyber-dark': '#0d0d0d',
        'cyber-primary': '#f706cf',
        'cyber-secondary': '#04d9ff',
        'cyber-accent': '#fbff00',
        'minimal-bg': 'var(--theme-bg, #ffffff)',
        'minimal-text': 'var(--theme-text, #1f2937)',
        'minimal-primary': 'var(--theme-accent, #111827)',
        'minimal-accent': 'var(--theme-accent, #111827)',
      },
      backgroundImage: {
        'star-pattern': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        'cyber-grid': "url(\"data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 0v100H0V0h100zM10 10v80h80V10H10z' fill='%23f706cf' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        'cyber-glow': "radial-gradient(ellipse at center, rgba(247, 6, 207, 0.15) 0%, rgba(247, 6, 207, 0) 50%)"
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(247, 6, 207, 0.5), 0 0 20px rgba(247, 6, 207, 0.4)' },
          '100%': { textShadow: '0 0 20px rgba(247, 6, 207, 0.7), 0 0 30px rgba(247, 6, 207, 0.6), 0 0 40px rgba(247, 6, 207, 0.3)' }
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' }
        },
      },
      transitionDuration: {
        '700': '700ms',
        '2000': '2000ms',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cyber: ['"Orbitron"', 'sans-serif'],
        minimal: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  safelist: [
    'bg-space-dark',
    'bg-space-navy',
    'text-space-light',
    'text-space-accent',
    'text-white',
    'bg-space-accent',
    'bg-space-glow',
    'bg-black',
    'bg-gray-900',
    'text-pink-500',
    'text-blue-100',
    'text-yellow-400',
    'bg-pink-600',
    'bg-pink-500',
    'bg-white',
    'bg-gray-100',
    'text-gray-900',
    'text-gray-800',
    'text-black',
    'bg-gray-800',
    'bg-gray-700',
    'dark',
    'border-space-light',
    'border-gray-800'
  ],
  plugins: [],
} 