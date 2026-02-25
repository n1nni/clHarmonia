/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0f1117',
        'surface': '#1a1d27',
        'amber-accent': '#f59e0b',
      },
      fontFamily: {
        'serif-display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'mono-code': ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
