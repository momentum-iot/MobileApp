import { User } from "../entities/User";
import { IAuthRepository } from "../repositories/IAuthRepository";

export class GetCurrentUserUseCase {
    constructor(private authRepository: IAuthRepository) {}

    async execute(): Promise<User | null> {
        return await this.authRepository.getCurrentUser()
    }
}