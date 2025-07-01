import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import {router, useSegments} from "expo-router";
import api from "@/services/api";
import {AuthContextType, RegisterRequest, User} from "@/types/auth";
import {ROUTES} from "@/routes";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();

    const loadSession = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('accessToken');
            if (!storedToken) {
                console.log("Kein gespeichertes Token, vermutlich noch nicht eingeloggt.")
                await logout();
                return;
            }

            setToken(storedToken);
            const res = await api.get('/user/profile');
            setUser(res.data);
        } catch (err: any) {
            console.log("Session-Check fehlgeschlagen", err.message);
            await logout()
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSession();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const inAuthGroup = segments[0]?.startsWith("(auth)");
            if (!token && !inAuthGroup) {
                router.replace(ROUTES.LOGIN);
            } else if (token && inAuthGroup) {
                router.replace(ROUTES.DASHBOARD);
            }
        }
    }, [token, segments, isLoading]);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', {email, password});
            const {accessToken, refreshToken} = res.data;

            await Promise.all([
                SecureStore.setItemAsync('refreshToken', refreshToken),
                SecureStore.setItemAsync('accessToken', accessToken),
            ]);

            await loadSession();
        } catch (error: any) {
            console.log("Login fehlgeschlagen:", error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const res = await api.post('/auth/register', data);
            const {accessToken, refreshToken} = res.data;

            await Promise.all([
                SecureStore.setItemAsync('accessToken', accessToken),
                SecureStore.setItemAsync('refreshToken', refreshToken),
            ]);

            await loadSession();
            router.replace(ROUTES.DASHBOARD);
        } catch (error: any) {
            console.log("Registrierung fehlgeschlagen:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setToken(null);
        setUser(null);
        router.replace(ROUTES.LOGIN);
    };

    const contextValue = useMemo(() => ({
        user,
        userId: user?.id ?? null,
        token,
        login,
        register,
        logout,
        isLoading
    }), [user, token, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};