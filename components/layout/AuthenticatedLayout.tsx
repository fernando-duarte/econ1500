"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MainNavigation } from "@/components/ui/main-navigation";
import { UserInfo, User } from "@/components/ui/UserInfo";
import { Container } from "@/components/ui/container";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthenticatedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children, className, ...rest }: AuthenticatedLayoutProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lastUsername");
    if (stored) {
      setUsername(stored);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear localStorage
      localStorage.removeItem("lastUsername");
      localStorage.removeItem("tokenExpiry");

      // Clear all queries from the cache
      await queryClient.clear();

      // Navigate to home and refresh router cache
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router, queryClient]);

  if (!username) return null;

  const user: User = { name: username };

  return (
    <div className={className} {...rest}>
      <a
        href="#main-content"
        className="focus:ring-ring focus:bg-background focus:text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <MainNavigation />
          <div className="flex items-center gap-4">
            <UserInfo user={user} />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              data-testid="logout-button"
            >
              {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Logout
            </Button>
          </div>
        </div>
      </Container>
      <Container as="main" id="main-content" className="py-6">
        {children}
      </Container>
    </div>
  );
}
