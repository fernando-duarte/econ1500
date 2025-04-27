/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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