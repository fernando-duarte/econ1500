export interface User {
    id: string;
    name: string;
    role: 'student' | 'instructor';
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
} 