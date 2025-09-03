/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 70%, 50%)',
        accent: 'hsl(140, 60%, 45%)',
        bg: 'hsl(210, 36%, 96%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(210, 10%, 15%)',
        'text-secondary': 'hsl(210, 10%, 35%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 50%, 10%, 0.08)',
        'focus': '0 0 0 3px hsla(210, 70%, 50%, 0.5)',
      },
      animation: {
        'fast': 'all 100ms ease-out',
        'base': 'all 200ms ease-out',
        'slow': 'all 300ms ease-out',
      }
    },
  },
  plugins: [],
}