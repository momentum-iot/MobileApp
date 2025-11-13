import { ICheckRepository } from "@/src/domain/repositories/ICheckRepository";
import { apiClient } from '../api/ApiClient';
import { API_ENDPOINTS } from '@/src/core/config/api';

export class CheckRepository implements ICheckRepository {


    async checkIn(): Promise<string> {
        try {
            const response = await apiClient.post<string>(API_ENDPOINTS.CHECK_IN);
            return response;
        } catch (error: any) {
            console.error('Error en check-in:', error);
            throw new Error(error.message || 'Error al hacer check-in');
        }
    }


    async checkOut(): Promise<string> {
        try {
            const response = await apiClient.post<string>(API_ENDPOINTS.CHECK_OUT);
            return response;
        } catch (error: any) {
            console.error('Error en check-out:', error);
            throw new Error(error.message || 'Error al hacer check-out');
        }
    }


    async getConcurrency(): Promise<number> {
        try {
            const response = await apiClient.get<any>(API_ENDPOINTS.GET_CONCURRENCY);

            const count = typeof response === 'number' ? response : (response.count || response || 0);

            return typeof count === 'number' && !isNaN(count) ? count : 0;
        } catch (error) {
            console.error('Error al obtener concurrencia:', error);
            return 0;
        }
    }


    async isUserInside(): Promise<boolean> {
        try {
            const response = await apiClient.get<boolean>(API_ENDPOINTS.GET_USER_STATUS);
            return response;
        } catch (error) {
            console.error('Error al verificar estado:', error);
            return false;
        }
    }

}

export const checkRepository = new CheckRepository();