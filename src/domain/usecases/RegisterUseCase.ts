import { AuthResponse } from '../entities/AuthResponse';
import { RegisterData } from '../entities/RegisterData';
import { IAuthRepository } from '../repositories/IAuthRepository';


export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthResponse> {
    // Validaciones básicas
    if (!data.name.trim()) {
      throw new Error('El nombre es requerido');
    }

    if (!data.lastName.trim()) {
      throw new Error('El apellido es requerido');
    }

    if (!data.email.trim() || !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!data.phone.trim()) {
      throw new Error('El teléfono es requerido');
    }

    if (!data.gender) {
      throw new Error('El género es requerido');
    }

    if (!data.age || data.age < 13 || data.age > 120) {
      throw new Error('La edad debe estar entre 13 y 120 años');
    }

    if (!data.birthday) {
      throw new Error('La fecha de nacimiento es requerida');
    }

    if (!data.emergencyContact.trim()) {
      throw new Error('El contacto de emergencia es requerido');
    }

    if (!data.height || data.height < 50 || data.height > 300) {
      throw new Error('La altura debe estar entre 50 y 300 cm');
    }

    if (!data.weight || data.weight < 20 || data.weight > 500) {
      throw new Error('El peso debe estar entre 20 y 500 kg');
    }

    // Ejecutar registro
    return await this.authRepository.register(data);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}