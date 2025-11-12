import { authRepository } from "@/src/data/repositories/AuthRepository";
import { RegisterData } from "@/src/domain/entities/RegisterData";
import { User } from "@/src/domain/entities/User";
import { CheckSessionUseCase } from "@/src/domain/usecases/CheckSessionUseCase";
import { GetCurrentUserUseCase } from "@/src/domain/usecases/GetCurrentUserUseCase";
import { LoginUseCase } from "@/src/domain/usecases/LoginUseCase";
import { RegisterUseCase } from "@/src/domain/usecases/RegisterUseCase";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const loginUseCase = new LoginUseCase(authRepository)
const registerUseCase = new RegisterUseCase(authRepository)
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository)
const checkSessionUseCase = new CheckSessionUseCase(authRepository)

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    //logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const hasSession = await checkSessionUseCase.execute();

            if (hasSession) {
                const currentUser = await getCurrentUserUseCase.execute();
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Error checking session:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await loginUseCase.execute(email, password);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await registerUseCase.execute(data);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    /*const logout = async () => {
        try {
            await logoutUseCase.execute();
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
            setUser(null);
        }
    };*/

    const refreshUser = async () => {
        try {
            const currentUser = await getCurrentUserUseCase.execute();
            setUser(currentUser);
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                //logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}