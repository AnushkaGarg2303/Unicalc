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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f8',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b84',
          900: '#0c3f6e',
          950: '#082849',
        },
        dark: {
          bg: '#0a0d14',
          surface: '#111726',
          card: '#161f33',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(56, 169, 248, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
        'btn-3d': '0 6px 0 #0f172a, 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'btn-3d-active': '0 2px 0 #0f172a, 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'btn-3d-brand': '0 6px 0 #0358a1, 0 10px 20px rgba(14, 140, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        'btn-3d-brand-active': '0 2px 0 #0358a1, 0 4px 8px rgba(14, 140, 233, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'btn-3d-orange': '0 6px 0 #c2410c, 0 10px 20px rgba(249, 115, 22, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'btn-3d-orange-active': '0 2px 0 #c2410c, 0 4px 8px rgba(249, 115, 22, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.5)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
