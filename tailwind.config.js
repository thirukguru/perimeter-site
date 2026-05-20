/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
          bg: '#1E1B4B',
          surface: '#29245F',
          'surface-alt': '#312B6B',
          border: 'rgba(6, 182, 212, 0.18)',
          cyan: '#06B6D4',
          'cyan-dim': '#0891B2',
          amber: '#f59e0b',
          red: '#ef4444',
          purple: '#1E1B4B',
          'text-primary': '#F8FAFC',
          'text-muted': 'rgba(248, 250, 252, 0.68)',
      },
      fontFamily: {
          sans: ['Sora', 'Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
          'fade-up': {
              '0%': { opacity: '0', transform: 'translateY(24px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
          },
      },
      animation: {
          'fade-up': 'fade-up 0.7s ease-out forwards',
      },
  },
  },
  plugins: [],
}
