/**
 * Base API Configuration
 * 
 * Sets the base URL for the backend and manages the in-memory JWT token.
 * We store the token in-memory here for enhanced security (as requested by user)
 * over storing it in localStorage, with no refresh token logic.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let inMemoryToken = null;

export const setToken = (token) => {
    inMemoryToken = token;
};

export const getToken = () => {
    return inMemoryToken;
};

export const clearToken = () => {
    inMemoryToken = null;
};

/**
 * Custom fetch wrapper for public, unauthenticated calls.
 */
export const fetchApi = async (endpoint, options = {}) => {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response;
};

/**
 * Custom fetch wrapper that strictly injects the Authorization header
 * if an in-memory token exists. Use this ONLY for protected routes.
 */
export const authFetchApi = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (inMemoryToken) {
        headers['Authorization'] = `Bearer ${inMemoryToken}`;
    } else {
        console.warn('Attempted an authorized call without a token in memory!');
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response;
};
