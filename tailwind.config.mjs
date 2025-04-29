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
      // Custom theme extensions can be added here
      colors: {
        // Define semantic color names to use throughout the app
        'hover-light': 'var(--hover-light)',
        'hover-dark': 'var(--hover-dark)',
        'hover-primary-dark': 'var(--hover-primary-dark)',
        'hover-primary-light': 'var(--hover-primary-light)',
        // System colors
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'primary': 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary': 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        'muted': 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        'accent': 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        'border': 'var(--border)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      // We don't need to define custom spacing utility names anymore
      // We'll use Tailwind's arbitrary values approach instead
      letterSpacing: {
        tightest: '-.01em',
      },
    },
  },
  plugins: [],
}; 