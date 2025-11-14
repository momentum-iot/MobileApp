import { SaveHeartRateResponse } from "../entities/HeartRateResponse";
import { IHeartRateRepository } from "../repositories/IHeartRateRepository";

export class SaveHeartRateUseCase {

    constructor(private repository: IHeartRateRepository) {}

    async execute(userId: number, bpm:number): Promise<SaveHeartRateResponse> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        if (!bpm || bpm <= 0) {
            throw new Error("Invalid BPM value");
        }

        return await this.repository.saveHeartRate(userId, bpm);
    }
}