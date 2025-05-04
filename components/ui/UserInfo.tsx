"use client";

import React from "react";

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
        <img
          src={user.image}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs uppercase text-gray-600">
          {user.name.charAt(0)}
        </div>
      )}
      <span className="text-sm font-medium">{user.name}</span>
    </div>
  );
}
