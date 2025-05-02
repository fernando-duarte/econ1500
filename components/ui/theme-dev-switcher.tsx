'use client'

import { useTheme } from 'next-themes'
import { Button } from './button'
import { useState, useEffect } from 'react'

export function ThemeDevSwitcher() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Only render after client-side hydration to prevent hydration errors
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed bottom-4 right-4 bg-card p-3 rounded-lg shadow-lg border z-50">
            <div className="flex flex-col gap-2">
                <div className="text-xs font-medium text-muted-foreground mb-1">Theme Dev Tools</div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                    >
                        Light
                    </Button>
                    <Button
                        size="sm"
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                    >
                        Dark
                    </Button>
                    <Button
                        size="sm"
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                    >
                        System
                    </Button>
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-1 mb-1">Experimental</div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        size="sm"
                        variant={theme === 'theme-blue' ? 'default' : 'outline'}
                        onClick={() => setTheme('theme-blue')}
                    >
                        Regal Jade
                    </Button>
                    <Button
                        size="sm"
                        variant={theme === 'theme-warm' ? 'default' : 'outline'}
                        onClick={() => setTheme('theme-warm')}
                    >
                        Warm Ember
                    </Button>
                    <Button
                        size="sm"
                        variant={theme === 'theme-china' ? 'default' : 'outline'}
                        onClick={() => setTheme('theme-china')}
                        className={theme === 'theme-china'
                            ? "bg-[#DE2910] text-white hover:bg-[#DE2910]/90 border-[#DE2910]"
                            : "bg-[#FFAFA3] text-[#8B0000] hover:bg-[#FFAFA3]/90 border-[#FFAFA3]"
                        }
                    >
                        China
                    </Button>
                </div>
            </div>
        </div>
    )
} 