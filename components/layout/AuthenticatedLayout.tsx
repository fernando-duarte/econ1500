"use client";

import React, { useState, useEffect } from "react";
import { MainNavigation } from "@/components/ui/main-navigation";
import { UserInfo, User } from "@/components/ui/UserInfo";
import { Container } from "@/components/ui/container";

interface AuthenticatedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children, className, ...rest }: AuthenticatedLayoutProps) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastUsername");
    if (stored) {
      setUsername(stored);
    }
  }, []);

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
          <UserInfo user={user} />
        </div>
      </Container>
      <Container as="main" id="main-content" className="py-6">
        {children}
      </Container>
    </div>
  );
}
