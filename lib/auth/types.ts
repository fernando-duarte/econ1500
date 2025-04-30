export interface User {
    id: string;
    name: string;
    email?: string;
    role: 'student' | 'instructor';
    section?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
} 