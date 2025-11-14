import { API_ENDPOINTS } from "@/src/core/config/api";
import { SaveHeartRateResponse, GetHeartRateHistoryResponse } from "@/src/domain/entities/HeartRateResponse";
import { IHeartRateRepository } from "@/src/domain/repositories/IHeartRateRepository";
import { apiClient } from "../api/ApiClient";
import { HeartRate } from "@/src/domain/entities/HeartRate";

export class HeartRateRepository implements IHeartRateRepository {

    async saveHeartRate(userId: number, bpm: number): Promise<SaveHeartRateResponse> {
        try {
            const endpoint = API_ENDPOINTS.SAVE_HEART_RATE.replace("{userId}", userId.toString());

            const response = await apiClient.post<HeartRate>(endpoint + `?bpm=${bpm}`);

            return {
                heartRate: response
            };

        } catch (error: any) {
            console.error("Error saving heart rate:", error);
            throw new Error(error.message || "Error al guardar heart rate");
        }
    }


    async getHeartRateHistory(userId: number): Promise<GetHeartRateHistoryResponse> {
        try {
            const endpoint = API_ENDPOINTS.GET_HEART_RATE.replace("{userId}", userId.toString());

            const response = await apiClient.get<HeartRate[]>(endpoint);

            return {
                history: response
            };

        } catch (error: any) {
            console.error("Error getting heart rate history:", error);
            throw new Error(error.message || "Error al obtener historial");
        }
    }
}

export const heartRateRepository = new HeartRateRepository();