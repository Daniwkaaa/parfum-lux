/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0a0908', 900: '#0a0908', 800: '#12100e', 700: '#1a1613', 600: '#241e19' },
        ivory: { DEFAULT: '#f3ece0', 200: '#e9dfcf', 400: '#cfc3ae' },
        champagne: { DEFAULT: '#c9a96e', light: '#e3cc9a', dark: '#9c7c45' },
        cocoa: { DEFAULT: '#3b2a1e', light: '#5a4230' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.32em', wide2: '0.18em' },
      transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
}
