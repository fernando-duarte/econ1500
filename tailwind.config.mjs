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
        // These will be available as CSS variables
        // Define semantic color names to use throughout the app
        'hover-light': '#f2f2f2',
        'hover-dark': '#1a1a1a',
        'hover-primary-dark': '#383838',
        'hover-primary-light': '#ccc',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      spacing: {
        // Define consistent spacing values
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      opacity: {
        // Define consistent opacity values
        '08': '0.08',
        '145': '0.145',
      },
      letterSpacing: {
        tightest: '-.01em',
      },
    },
  },
  plugins: [],
}; 