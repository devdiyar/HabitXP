export type User = {
    id: string;
    email: string;
    username: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export type AuthContextType = {
    user: User | null;
    userId: string | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
};