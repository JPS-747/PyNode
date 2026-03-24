interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type?: string;
}

interface UserResponse {
    id: number;
    email: string;
    full_name: string;
    telegram_bot_token?: string;
    telegram_chat_id?: string;
}

interface RegisterPayload {
    email: string;
    full_name: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RefreshTokenPayload {
    refresh_token: string;
}

interface TelegramSettingsPayload {
    telegram_bot_token: string;
    telegram_chat_id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function parseResponse<T>(response: Response): Promise<T> {
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
        throw new Error((data.detail as string) || (data.message as string) || 'Request failed');
    }

    return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseResponse<UserResponse>(response);
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseResponse<AuthResponse>(response);
}

export async function fetchCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseResponse<UserResponse>(response);
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken } as RefreshTokenPayload),
    });

    return parseResponse<AuthResponse>(response);
}

export async function setTelegramSettings(
    token: string,
    payload: TelegramSettingsPayload
): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    return parseResponse<UserResponse>(response);
}

export async function checkTelegramSettings(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseResponse<{ message: string }>(response);
}

export async function sendTestTelegramMessage(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/telegram/test`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseResponse<{ message: string }>(response);
}

export type { AuthResponse, UserResponse, RegisterPayload, LoginPayload, TelegramSettingsPayload };
