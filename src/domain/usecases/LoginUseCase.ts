import { AuthResponse } from "../entities/AuthResponse";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class LoginUseCase {

    constructor(private authRepository: IAuthRepository) { }

    async execute(email: string, password: string): Promise<AuthResponse> {
        if (!email || !password) {
            throw new Error("Email y contraseña son requeridos")
        }

        if (!this.isValidEmail(email)) {
            throw new Error("Ingresa un email valido")
        }

        return await this.authRepository.login(email, password)
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
}