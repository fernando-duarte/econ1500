/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    // Exclude test files to improve build performance
    "!**/*.{spec,test,stories}.{js,ts,jsx,tsx}",
  ],
  // Enable class-based dark mode
  darkMode: 'class',
  // Safelist for dynamically generated classes - using patterns for better maintainability
  safelist: [
    {
      pattern: /^(bg|text)-(primary|secondary|accent)$/,
      variants: ['hover', 'focus'],
    }
  ],
  // Enable upcoming Tailwind features
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
  },
  // Disable unused core plugins to reduce bundle size
  corePlugins: {
    container: false, // Assuming you're not using container utilities
  },
  theme: {
    // Define explicit screen breakpoints
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'print': { 'raw': 'print' }, // Add print media query
    },
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
  plugins: [
    // Include official Tailwind plugins
    typography,
    forms,
    aspectRatio, // Added for responsive media content
  ],
}; 