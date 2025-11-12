import { AuthResponse } from "../entities/AuthResponse";
import { RegisterData } from "../entities/RegisterData";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class RegisterUseCase {

    constructor(private authRepository: IAuthRepository) { }

    async execute(data: RegisterData): Promise<AuthResponse> {
        if (!data.email || !data.password || !data.name) {
            throw new Error("Todos los campos son requeridos")
        }

        if (!this.isValidEmail(data.email)) {
            throw new Error('Email invalido');
        }

        if (data.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        return await this.authRepository.register(data)

    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}