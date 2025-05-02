'use client';

import { useEffect, useState } from 'react';

export function UserInfo() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Get username from localStorage or cookie
        const storedUsername = localStorage.getItem('lastUsername');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    if (!username) return null;

    return (
        <div data-testid="user-info" className="flex items-center gap-2 text-sm font-medium">
            Logged in as: <span className="font-bold">{username}</span>
        </div>
    );
} 