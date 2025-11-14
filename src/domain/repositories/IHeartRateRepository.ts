import { GetHeartRateHistoryResponse, SaveHeartRateResponse } from "../entities/HeartRateResponse";

export interface IHeartRateRepository {
    saveHeartRate(userId: number, bpm: number): Promise<SaveHeartRateResponse>

    getHeartRateHistory(userId: number): Promise<GetHeartRateHistoryResponse>
}