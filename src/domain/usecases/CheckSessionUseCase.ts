import { IAuthRepository } from "../repositories/IAuthRepository";

export class CheckSessionUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(): Promise<boolean> {
        return await this.authRepository.hasActiveSession()
    }
}