/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'primary': 'var(--primary)',
        'primary-foreground': 'var(--primaryForeground)',
        'secondary': 'var(--secondary)',
        'secondary-foreground': 'var(--secondaryForeground)',
        'muted': 'var(--muted)',
        'muted-foreground': 'var(--mutedForeground)',
        'accent': 'var(--accent)',
        'accent-foreground': 'var(--accentForeground)',
        'border': 'var(--border)',
        'card': 'var(--card)',
        'card-foreground': 'var(--cardForeground)',
        'input': 'var(--input)',
        'ring': 'var(--ring)',
        'hover': 'var(--hover)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 0.25rem)',
        sm: 'calc(var(--radius) - 0.5rem)',
      },
      fontFamily: {
        sans: ['var(--primary-font)'],
        mono: ['var(--secondary-font)'],
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
      },
    },
  },
  plugins: [],
}; 