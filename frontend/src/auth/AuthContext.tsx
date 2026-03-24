import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCurrentUser, loginUser, refreshAccessToken, registerUser } from '../api';
import type { AuthResponse, UserResponse, RegisterPayload, LoginPayload } from '../api';

interface AuthContextType {
    token: string | null;
    user: UserResponse | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

interface StoredSession {
    accessToken: string;
    refreshToken: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'auth_session';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function scheduleTokenRefresh(expiresIn: number): void {
        // Clear any existing timeout
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        // Refresh token 1 minute before expiry
        const refreshDelay = Math.max((expiresIn - 60) * 1000, 1000);
        refreshTimeoutRef.current = setTimeout(() => {
            attemptTokenRefresh();
        }, refreshDelay);
    }

    async function attemptTokenRefresh(): Promise<void> {
        if (!refreshToken) return;
        try {
            const result = await refreshAccessToken(refreshToken);
            setToken(result.access_token);
            setRefreshToken(result.refresh_token);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    accessToken: result.access_token,
                    refreshToken: result.refresh_token,
                } as StoredSession)
            );
            // Access tokens are 15 minutes by default
            scheduleTokenRefresh(900);
        } catch (error) {
            console.error('Token refresh failed, logging out:', error);
            logout();
        }
    }

    async function login(credentials: LoginPayload): Promise<void> {
        const result = await loginUser(credentials);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                accessToken: result.access_token,
                refreshToken: result.refresh_token,
            } as StoredSession)
        );
        setToken(result.access_token);
        setRefreshToken(result.refresh_token);
        const currentUser = await fetchCurrentUser(result.access_token);
        setUser(currentUser);
        scheduleTokenRefresh(900);
    }

    async function register(payload: RegisterPayload): Promise<void> {
        await registerUser(payload);
        await login({ email: payload.email, password: payload.password });
    }

    function logout(): void {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
    }

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            setLoading(false);
            return;
        }

        const session: StoredSession = JSON.parse(saved);
        setToken(session.accessToken);
        setRefreshToken(session.refreshToken);

        fetchCurrentUser(session.accessToken)
            .then((currentUser) => {
                setUser(currentUser);
                scheduleTokenRefresh(900);
            })
            .catch(() => {
                localStorage.removeItem(STORAGE_KEY);
                setToken(null);
                setRefreshToken(null);
                setUser(null);
            })
            .finally(() => setLoading(false));

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    const value: AuthContextType = useMemo(
        () => ({
            token,
            user,
            loading,
            isAuthenticated: Boolean(token && user),
            login,
            register,
            logout,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
