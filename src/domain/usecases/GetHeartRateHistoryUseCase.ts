import { GetHeartRateHistoryResponse } from "../entities/HeartRateResponse";
import { IHeartRateRepository } from "../repositories/IHeartRateRepository";

export class GetHeartRateHistoryUseCase {

    constructor(private repository: IHeartRateRepository) {}

    async execute(userId: number): Promise<GetHeartRateHistoryResponse> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        return await this.repository.getHeartRateHistory(userId);
    }
    
}