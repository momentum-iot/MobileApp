import { HeartRate } from "./HeartRate";

export interface SaveHeartRateResponse {
    heartRate: HeartRate;
}

export interface GetHeartRateHistoryResponse {
    history: HeartRate[];
}
