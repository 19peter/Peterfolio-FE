import { fetchApi, setToken, clearToken } from './api';

export const authService = {
    /**
     * Authenticate an admin user and store the token in-memory
     */
    login: async (username, password) => {
        try {
            const response = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (data.token) {
                setToken(data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    /**
     * Clear the in-memory token
     */
    logout: () => {
        clearToken();
    }
};
