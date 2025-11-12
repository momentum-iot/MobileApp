import { AuthTokens } from "./AuthTokens";
import { User } from "./User";

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}