"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useTheme } from "@/lib/theme-system";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const { setTheme } = useTheme();

  const toggleTheme = () => {
    if (nextTheme === "dark") {
      setNextTheme("light");
      setTheme("default");
    } else {
      setNextTheme("dark");
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
