/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand-primary)',
        'brand-sec': 'var(--color-brand-secondary)',
        'brand-accent': 'var(--color-brand-accent)',
        app: 'var(--color-bg-app)',
        surface: 'var(--color-bg-primary)',
        card: 'var(--color-bg-secondary)',
        'card-hover': 'var(--color-bg-hover)',
        main: 'var(--color-text-primary)',
        muted: 'var(--color-text-secondary)',
        heading: 'var(--color-text-heading)',
        border: 'var(--color-border-primary)',
        'border-subtle': 'var(--color-border-secondary)',
        'border-accent': 'var(--color-border-accent)',
      },
    },
  },
  plugins: [],
}
