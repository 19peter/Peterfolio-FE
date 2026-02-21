import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // In-memory strictly per user constraints
    const [isAdmin, setIsAdmin] = useState(false);

    const login = async (username, password) => {
        try {
            const success = await authService.login(username, password);
            if (success) {
                setIsAdmin(true);
            }
            return success;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
