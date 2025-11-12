
import { apiClient } from '../api/ApiClient';
import { LocalStorage } from '../storage/LocalStorage';
import { API_ENDPOINTS } from '@/src/core/config/api';
import { STORAGE_KEYS } from '@/src/core/constants/storage-keys';
import { AuthResponse } from '@/src/domain/entities/AuthResponse';
import { AuthTokens } from '@/src/domain/entities/AuthTokens';
import { RegisterData } from '@/src/domain/entities/RegisterData';
import { User } from '@/src/domain/entities/User';
import { IAuthRepository } from '@/src/domain/repositories/IAuthRepository';


export class AuthRepository implements IAuthRepository {
  
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.LOGIN, { email, password });

      const authResponse: AuthResponse = {
        user: response.user,
        tokens: {
          accessToken: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        },
      };

      await this.saveTokens(authResponse.tokens);
      await LocalStorage.set(STORAGE_KEYS.USER_DATA, authResponse.user);

      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.REGISTER, data);

      const authResponse: AuthResponse = {
        user: response.user,
        tokens: {
          accessToken: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        },
      };

      await this.saveTokens(authResponse.tokens);
      await LocalStorage.set(STORAGE_KEYS.USER_DATA, authResponse.user);

      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  
  /**async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.log('Error en logout del servidor:', error);
    } finally {
      await this.clearTokens();
    }
  } */

  
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<any>(API_ENDPOINTS.REFRESH, { refreshToken });

    const tokens: AuthTokens = {
      accessToken: response.token,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
    };

    await this.saveTokens(tokens);
    return tokens;
  }

  
  async getCurrentUser(): Promise<User | null> {
    try {
      const cachedUser = await LocalStorage.get<User>(STORAGE_KEYS.USER_DATA);
      if (cachedUser) return cachedUser;

      const response = await apiClient.get<User>(API_ENDPOINTS.GET_PROFILE);
      await LocalStorage.set(STORAGE_KEYS.USER_DATA, response);
      return response;
    } catch (error) {
      return null;
    }
  }

  
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await LocalStorage.setSecure(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await LocalStorage.setSecure(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  
  async getStoredTokens(): Promise<AuthTokens | null> {
    const accessToken = await LocalStorage.getSecure(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = await LocalStorage.getSecure(STORAGE_KEYS.REFRESH_TOKEN);
    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  
  async clearTokens(): Promise<void> {
    await LocalStorage.removeSecure(STORAGE_KEYS.ACCESS_TOKEN);
    await LocalStorage.removeSecure(STORAGE_KEYS.REFRESH_TOKEN);
    await LocalStorage.remove(STORAGE_KEYS.USER_DATA);
  }

  
  async hasActiveSession(): Promise<boolean> {
    const tokens = await this.getStoredTokens();
    return tokens !== null;
  }
}

export const authRepository = new AuthRepository();
