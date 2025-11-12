// src/data/repositories/AuthRepository.ts

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
      const response = await apiClient.post<any>(API_ENDPOINTS.LOGIN, { 
        email, 
        password 
      });

      
      const authResponse: AuthResponse = {
        user: {
          id: response.user.id,
          name: response.user.name,
          lastName: response.user.lastName,
          phone: response.user.phone,
          gender: response.user.gender,
          age: response.user.age,
          email: response.user.email,
          role: response.user.role,
          membership: response.user.membership,
          status: response.user.status,
          joinDate: response.user.joinDate,
          joinHour: response.user.joinHour,
          birthday: response.user.birthday,
          emergencyContact: response.user.emergencyContact,
          height: response.user.height,
          weight: response.user.weight,
          avatar: response.user.avatar,
        },
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
      console.error('Error en login:', error);
      throw error;
    }
  }


  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      
      const response = await apiClient.post<any>(API_ENDPOINTS.REGISTER, {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        age: data.age,
        birthday: data.birthday, 
        emergencyContact: data.emergencyContact,
        height: Math.round(data.height), 
        weight: data.weight, 
      });

      const authResponse: AuthResponse = {
        user: {
          id: response.user.id,
          name: response.user.name,
          lastName: response.user.lastName,
          phone: response.user.phone,
          gender: response.user.gender,
          age: response.user.age,
          email: response.user.email,
          role: response.user.role,
          membership: response.user.membership,
          status: response.user.status,
          joinDate: response.user.joinDate,
          joinHour: response.user.joinHour,
          birthday: response.user.birthday,
          emergencyContact: response.user.emergencyContact,
          height: response.user.height,
          weight: response.user.weight,
          avatar: response.user.avatar,
        },
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
      console.error('Error en registro:', error);
      throw error;
    }
  }

  

  /*async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.log('Error en logout del servidor:', error);   
    } finally {    
      await this.clearTokens();
    }
  } */

  
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.REFRESH, { 
        refreshToken 
      });

      const tokens: AuthTokens = {
        accessToken: response.token,
        refreshToken: response.refreshToken || refreshToken,
        expiresIn: response.expiresIn,
      };

      await this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  }

  
  async getCurrentUser(): Promise<User | null> {
    try {
      const cachedUser = await LocalStorage.get<User>(STORAGE_KEYS.USER_DATA);
      if (cachedUser) {
        return cachedUser;
      }

      
      const response = await apiClient.get<any>(API_ENDPOINTS.GET_PROFILE);
      
      const user: User = {
        id: response.id,
        name: response.name,
        lastName: response.lastName,
        phone: response.phone,
        gender: response.gender,
        age: response.age,
        email: response.email,
        role: response.role,
        membership: response.membership,
        status: response.status,
        joinDate: response.joinDate,
        joinHour: response.joinHour,
        birthday: response.birthday,
        emergencyContact: response.emergencyContact,
        height: response.height,
        weight: response.weight,
        avatar: response.avatar,
      };

      await LocalStorage.set(STORAGE_KEYS.USER_DATA, user);
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
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
    
    if (!accessToken || !refreshToken) {
      return null;
    }

    return { 
      accessToken, 
      refreshToken 
    };
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