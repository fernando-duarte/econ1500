"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

// Define all available themes
export type ThemeName = 'default' | 'blue' | 'green' | 'purple' | 'dark';

// Complete theme configuration interface
export interface ThemeConfig {
    name: ThemeName;
    label: string;
    fonts: {
        primary: string;
        secondary: string;
        weights: number[];
        urls?: string[]; // Optional CDN URLs for custom fonts
    };
    colors: {
        background: string;
        foreground: string;
        primary: string;
        'primary-foreground': string;
        secondary: string;
        'secondary-foreground': string;
        muted: string;
        'muted-foreground': string;
        accent: string;
        'accent-foreground': string;
        border: string;
        // Additional variables
        card: string;
        'card-foreground': string;
        input: string;
        ring: string;
        hover: string;
        destructive: string;
        'destructive-foreground': string;
        popover: string;
        'popover-foreground': string;
    };
    borderRadius: string;
    fontSizes: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
}

// Predefined complete themes
export const themes: Record<ThemeName, ThemeConfig> = {
    default: {
        name: 'default',
        label: 'Default',
        fonts: {
            primary: 'var(--font-geist-sans)',
            secondary: 'var(--font-geist-mono)',
            weights: [400, 500, 600, 700],
        },
        colors: {
            background: 'oklch(1 0 0)',
            foreground: 'oklch(0.13 0.03 30)',
            primary: 'oklch(0.89 0.15 90)',
            'primary-foreground': 'oklch(0.13 0.03 30)',
            secondary: 'oklch(0.75 0.05 140)',
            'secondary-foreground': 'oklch(1 0 0)',
            muted: 'oklch(0.57 0.16 48)',
            'muted-foreground': 'oklch(1 0 0)',
            accent: 'oklch(0.57 0.28 30)',
            'accent-foreground': 'oklch(1 0 0)',
            border: 'oklch(0.84 0.10 80)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.13 0.03 30)',
            input: 'oklch(0.84 0.10 80)',
            ring: 'oklch(0.89 0.15 90)',
            hover: 'oklch(0.84 0.15 80)',
            destructive: 'oklch(0.58 0.25 27)',
            'destructive-foreground': 'oklch(1 0 0)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.13 0.03 30)',
        },
        borderRadius: '0.75rem',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
    },
    dark: {
        name: 'dark',
        label: 'Dark',
        fonts: {
            primary: 'var(--font-geist-sans)',
            secondary: 'var(--font-geist-mono)',
            weights: [400, 500, 600, 700],
        },
        colors: {
            background: 'oklch(0.13 0.03 30)',
            foreground: 'oklch(0.97 0.01 90)',
            primary: 'oklch(0.82 0.15 85)',
            'primary-foreground': 'oklch(0.13 0.03 30)',
            secondary: 'oklch(0.75 0.05 140)',
            'secondary-foreground': 'oklch(0.13 0.03 30)',
            muted: 'oklch(0.28 0.03 260)',
            'muted-foreground': 'oklch(0.70 0.03 260)',
            accent: 'oklch(0.57 0.28 30)',
            'accent-foreground': 'oklch(0.97 0.01 90)',
            border: 'oklch(0.28 0.03 260)',
            card: 'oklch(0.10 0.01 30)',
            'card-foreground': 'oklch(0.97 0.01 90)',
            input: 'oklch(0.28 0.03 260)',
            ring: 'oklch(0.82 0.15 85)',
            hover: 'oklch(0.25 0.03 30)',
            destructive: 'oklch(0.70 0.19 22)',
            'destructive-foreground': 'oklch(0.97 0.01 90)',
            popover: 'oklch(0.10 0.01 30)',
            'popover-foreground': 'oklch(0.97 0.01 90)',
        },
        borderRadius: '0.75rem',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
    },
    blue: {
        name: 'blue',
        label: 'Blue',
        fonts: {
            primary: 'Inter, sans-serif',
            secondary: 'Roboto Mono, monospace',
            weights: [400, 500, 600, 700],
            urls: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap'
            ]
        },
        colors: {
            background: 'oklch(0.96 0.02 240)',
            foreground: 'oklch(0.20 0.08 260)',
            primary: 'oklch(0.60 0.18 250)',
            'primary-foreground': 'oklch(1 0 0)',
            secondary: 'oklch(0.78 0.10 250)',
            'secondary-foreground': 'oklch(0.20 0.08 260)',
            muted: 'oklch(0.85 0.05 250)',
            'muted-foreground': 'oklch(0.20 0.08 260)',
            accent: 'oklch(0.50 0.15 260)',
            'accent-foreground': 'oklch(1 0 0)',
            border: 'oklch(0.70 0.10 250)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.20 0.08 260)',
            input: 'oklch(0.70 0.10 250)',
            ring: 'oklch(0.60 0.18 250)',
            hover: 'oklch(0.85 0.05 250)',
            destructive: 'oklch(0.58 0.25 27)',
            'destructive-foreground': 'oklch(1 0 0)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.20 0.08 260)',
        },
        borderRadius: '0.5rem',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
    },
    green: {
        name: 'green',
        label: 'Green',
        fonts: {
            primary: 'Poppins, sans-serif',
            secondary: 'Space Mono, monospace',
            weights: [400, 500, 600, 700],
            urls: [
                'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap'
            ]
        },
        colors: {
            background: 'oklch(0.97 0.03 140)',
            foreground: 'oklch(0.30 0.10 140)',
            primary: 'oklch(0.65 0.15 140)',
            'primary-foreground': 'oklch(1 0 0)',
            secondary: 'oklch(0.78 0.10 140)',
            'secondary-foreground': 'oklch(0.30 0.10 140)',
            muted: 'oklch(0.85 0.05 140)',
            'muted-foreground': 'oklch(0.30 0.10 140)',
            accent: 'oklch(0.55 0.12 140)',
            'accent-foreground': 'oklch(1 0 0)',
            border: 'oklch(0.70 0.10 140)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.30 0.10 140)',
            input: 'oklch(0.70 0.10 140)',
            ring: 'oklch(0.65 0.15 140)',
            hover: 'oklch(0.85 0.05 140)',
            destructive: 'oklch(0.58 0.25 27)',
            'destructive-foreground': 'oklch(1 0 0)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.30 0.10 140)',
        },
        borderRadius: '1rem',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
    },
    purple: {
        name: 'purple',
        label: 'Purple',
        fonts: {
            primary: 'Raleway, sans-serif',
            secondary: 'Fira Code, monospace',
            weights: [400, 500, 600, 700],
            urls: [
                'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap'
            ]
        },
        colors: {
            background: 'oklch(0.96 0.03 310)',
            foreground: 'oklch(0.30 0.15 290)',
            primary: 'oklch(0.65 0.25 300)',
            'primary-foreground': 'oklch(1 0 0)',
            secondary: 'oklch(0.83 0.15 300)',
            'secondary-foreground': 'oklch(0.30 0.15 290)',
            muted: 'oklch(0.88 0.10 300)',
            'muted-foreground': 'oklch(0.30 0.15 290)',
            accent: 'oklch(0.60 0.20 300)',
            'accent-foreground': 'oklch(1 0 0)',
            border: 'oklch(0.75 0.15 300)',
            card: 'oklch(1 0 0)',
            'card-foreground': 'oklch(0.30 0.15 290)',
            input: 'oklch(0.75 0.15 300)',
            ring: 'oklch(0.65 0.25 300)',
            hover: 'oklch(0.88 0.10 300)',
            destructive: 'oklch(0.58 0.25 27)',
            'destructive-foreground': 'oklch(1 0 0)',
            popover: 'oklch(1 0 0)',
            'popover-foreground': 'oklch(0.30 0.15 290)',
        },
        borderRadius: '0.25rem',
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
    },
};

// Create context to manage theme
type ThemeContextType = {
    theme: ThemeConfig;
    setTheme: (_theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: themes.default,
    setTheme: () => { },
});

// Theme provider component
export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeConfig>(themes.default);
    const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

    // Function to set theme and apply it to document
    const setTheme = useCallback((themeName: ThemeName) => {
        const newTheme = themes[themeName];
        setThemeState(newTheme);

        // Sync with next-themes if we're switching to/from dark mode
        if (themeName === 'dark' && nextTheme !== 'dark') {
            setNextTheme('dark');
        } else if (themeName !== 'dark' && nextTheme === 'dark') {
            setNextTheme('light');
        }

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', themeName);

        // Apply CSS variables
        const root = document.documentElement;

        // Colors
        Object.entries(newTheme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        // Border radius
        root.style.setProperty('--radius', newTheme.borderRadius);

        // Font sizes
        Object.entries(newTheme.fontSizes).forEach(([key, value]) => {
            root.style.setProperty(`--font-size-${key}`, value);
        });

        // Set primary and secondary fonts
        root.style.setProperty('--primary-font', newTheme.fonts.primary);
        root.style.setProperty('--secondary-font', newTheme.fonts.secondary);

        // Save theme preference
        localStorage.setItem('theme', themeName);

        // Handle font loading if URLs are provided
        if (newTheme.fonts.urls) {
            loadFonts(newTheme.fonts.urls);
        }
    }, [nextTheme, setNextTheme]);

    // Function to load font stylesheets
    const loadFonts = (urls: string[]) => {
        // Remove any existing font stylesheets
        document.querySelectorAll('link[data-font]').forEach(_el => _el.remove());

        // Add new font stylesheets
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.setAttribute('data-font', 'true');
            document.head.appendChild(link);
        });
    };

    // Listen for next-themes dark mode changes
    useEffect(() => {
        if (nextTheme === 'dark' && theme.name !== 'dark') {
            setThemeState(themes.dark);
        } else if (nextTheme === 'light' && theme.name === 'dark') {
            setThemeState(themes.default);
        }
    }, [nextTheme, theme.name]);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeName;
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        }
    }, [setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook to use theme
export function useTheme() {
    return useContext(ThemeContext);
} 