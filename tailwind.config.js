/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)'
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        accent: 'var(--text-accent)'
      },
      backgroundColor: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        surface: 'var(--surface)'
      },
      borderColor: {
        theme: 'var(--border)'
      }
    },
  },
  plugins: [],
}