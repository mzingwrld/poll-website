import { useEffect, useState } from 'react';
import { get } from '../api/fetch';
import { useMessage } from './useMessage';

const LOCAL_STORAGE_USER_ID = 'USER_ID';
const LOCAL_STORAGE_TOKEN = 'TOKEN';

interface IWithResponse<T> {
    data: T | null;
    message: string;
}

interface IAuthData {
    userId: string;
    token: string;
}

export const useAuth = () => {
    const message = useMessage();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    /**
     * If user was authenticated previously,
     * we're not requesting new token
     */
    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            try {
                const response = await get<IWithResponse<IAuthData>>('/api/auth');
                const { data } = response;
                if (data) {
                    const { userId: userIdReceived, token: tokenReceived } = data;

                    window.localStorage.setItem(LOCAL_STORAGE_TOKEN, tokenReceived);
                    window.localStorage.setItem(LOCAL_STORAGE_USER_ID, userIdReceived);
                    setToken(tokenReceived);
                    setUserId(userIdReceived);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                if (e instanceof Error) {
                    message(e.message);
                }
            }
        };

        const tokenInternal = window.localStorage.getItem(LOCAL_STORAGE_TOKEN);
        const userIdInternal = window.localStorage.getItem(LOCAL_STORAGE_USER_ID);

        if (tokenInternal && userIdInternal) {
            setToken(tokenInternal);
            setUserId(userIdInternal);
            setIsAuthenticated(true);
        } else {
            authenticate();
        }
    }, []);

    return [isAuthenticated, token, userId] as const;
}
