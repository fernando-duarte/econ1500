"use client";

import { useState } from "react";
import { useTheme, themes } from "@/lib/theme-system";
import { Button } from "@/components/ui/button";

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
                variant="outline"
            >
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                />
                <span>{theme.label}</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 p-2 bg-card border border-border rounded-lg shadow-lg w-48 z-50">
                    {Object.values(themes).map((t) => (
                        <button
                            key={t.name}
                            onClick={() => {
                                setTheme(t.name);
                                setIsOpen(false);
                            }}
                            className="flex items-center w-full px-3 py-2 gap-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: t.colors.primary }}
                            />
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 