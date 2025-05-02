'use client';

import { type ThemeProviderProps, ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            {...props}
            themes={['light', 'dark', 'system', 'theme-blue', 'theme-warm', 'theme-china']}
        >
            {children}
        </NextThemesProvider>
    );
} 