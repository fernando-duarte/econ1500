"use client";

import { useEffect, useState } from "react";

export function UserInfo() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("lastUsername");

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // As a fallback, try to get it from the cookie in client-side code
      const cookies = document.cookie.split(";");
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("session-token="));

      if (sessionCookie) {
        // Simple decode for demo purposes
        const cookieParts = sessionCookie.split("=");
        if (cookieParts.length > 1 && cookieParts[1]) {
          const value = decodeURIComponent(cookieParts[1]);
          setUsername(value);
        }
      }
    }
  }, []);

  if (!username) return null;

  return (
    <div data-testid="user-info" className="flex items-center gap-2 text-sm font-medium">
      Logged in as: <span className="font-bold">{username}</span>
    </div>
  );
}
