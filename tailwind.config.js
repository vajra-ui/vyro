/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vyro: {
          dark: '#080c14',
          panel: '#0d131f',
          card: '#131b2c',
          border: '#1f2b44',
          accent: '#0ea5e9',
          critical: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          rescuer: '#3b82f6',
          medical: '#14b8a6',
          shelter: '#8b5cf6',
          hazard: '#dc2626'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
