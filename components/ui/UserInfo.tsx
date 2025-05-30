"use client";

import React from "react";
import Image from "next/image";

/**
 * Props for UserInfo component
 */
export interface User {
  name: string;
  image?: string;
}

/**
 * Displays the user's avatar and name.
 */
export function UserInfo({ user }: { user: User }) {
  if (!user?.name) return null;

  return (
    <div
      id="user-info"
      data-testid="user-info"
      className="user-info flex items-center gap-2"
      aria-label="User information"
    >
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 uppercase">
          {user.name.charAt(0)}
        </div>
      )}
      <span className="text-sm font-medium">{user.name}</span>
    </div>
  );
}
