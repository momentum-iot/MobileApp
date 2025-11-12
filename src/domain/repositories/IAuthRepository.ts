import { AuthResponse } from "../entities/AuthResponse";
import { AuthTokens } from "../entities/AuthTokens";
import { RegisterData } from "../entities/RegisterData";
import { User } from "../entities/User";

export interface IAuthRepository {

    login(email: string, password: string): Promise<AuthResponse>

    register(data: RegisterData): Promise<AuthResponse>

    //logout():Promise<void>;

    refreshToken(refreshToken: string): Promise<AuthTokens>

    getCurrentUser(): Promise<User|null>

    saveTokens(tokens: AuthTokens): Promise<void>

    getStoredTokens(): Promise<AuthTokens| null>

    clearTokens(): Promise<void>

    hasActiveSession(): Promise<boolean>
}