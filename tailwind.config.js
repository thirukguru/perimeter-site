/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
          bg: '#0a0f1a',
          surface: '#0f1525',
          'surface-alt': '#141b2d',
          border: '#1e2a42',
          cyan: '#06d6d6',
          'cyan-dim': '#06b6d4',
          amber: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
          'text-primary': '#e2e8f0',
          'text-muted': '#64748b',
      },
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
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
