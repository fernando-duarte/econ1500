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
        primaryForeground: string;
        secondary: string;
        secondaryForeground: string;
        muted: string;
        mutedForeground: string;
        accent: string;
        accentForeground: string;
        border: string;
        // Additional variables
        card: string;
        cardForeground: string;
        input: string;
        ring: string;
        hover: string;
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
            background: 'hsl(0, 0%, 100%)',
            foreground: '#3e2723',
            primary: '#ffeb3b',
            primaryForeground: '#3e2723',
            secondary: '#8caa7e',
            secondaryForeground: '#ffffff',
            muted: '#e65100',
            mutedForeground: '#ffffff',
            accent: '#d32f2f',
            accentForeground: '#ffffff',
            border: '#ffb74d',
            card: '#ffffff',
            cardForeground: '#3e2723',
            input: '#ffb74d',
            ring: '#ffeb3b',
            hover: '#ffb74d',
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
            background: '#212121',
            foreground: '#fff8e1',
            primary: '#ffc107',
            primaryForeground: '#212121',
            secondary: '#8caa7e',
            secondaryForeground: '#212121',
            muted: '#37474f',
            mutedForeground: '#b0bec5',
            accent: '#d32f2f',
            accentForeground: '#fff8e1',
            border: '#616161',
            card: '#1e1e1e',
            cardForeground: '#fff8e1',
            input: '#616161',
            ring: '#ffc107',
            hover: '#424242',
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
            background: '#e3f2fd',
            foreground: '#0d47a1',
            primary: '#2196f3',
            primaryForeground: '#ffffff',
            secondary: '#90caf9',
            secondaryForeground: '#0d47a1',
            muted: '#bbdefb',
            mutedForeground: '#0d47a1',
            accent: '#1565c0',
            accentForeground: '#ffffff',
            border: '#64b5f6',
            card: '#ffffff',
            cardForeground: '#0d47a1',
            input: '#64b5f6',
            ring: '#2196f3',
            hover: '#bbdefb',
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
            background: '#e8f5e9',
            foreground: '#1b5e20',
            primary: '#4caf50',
            primaryForeground: '#ffffff',
            secondary: '#a5d6a7',
            secondaryForeground: '#1b5e20',
            muted: '#c8e6c9',
            mutedForeground: '#1b5e20',
            accent: '#2e7d32',
            accentForeground: '#ffffff',
            border: '#81c784',
            card: '#ffffff',
            cardForeground: '#1b5e20',
            input: '#81c784',
            ring: '#4caf50',
            hover: '#c8e6c9',
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
            background: '#f3e5f5',
            foreground: '#4a148c',
            primary: '#9c27b0',
            primaryForeground: '#ffffff',
            secondary: '#ce93d8',
            secondaryForeground: '#4a148c',
            muted: '#e1bee7',
            mutedForeground: '#4a148c',
            accent: '#7b1fa2',
            accentForeground: '#ffffff',
            border: '#ba68c8',
            card: '#ffffff',
            cardForeground: '#4a148c',
            input: '#ba68c8',
            ring: '#9c27b0',
            hover: '#e1bee7',
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