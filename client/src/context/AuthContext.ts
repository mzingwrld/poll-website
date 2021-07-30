import { createContext } from 'react';

interface IAuthContext {
    token: string | null,
    userId: string | null,
    isAuthenticated: boolean,
}

export const AuthContext = createContext<IAuthContext>({
    token: null,
    userId: null,
    isAuthenticated: false,
});
