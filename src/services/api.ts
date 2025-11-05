
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://webapp-motoconnect-557884.azurewebsites.net/api';
const API_VERSION = 'v1';

const api = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  validateStatus: (status) => status < 500,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('API Error Request:', error.message);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Interfaces para tipagem
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface Vehicle {
  vehicleId?: string;
  licensePlate: string;
  vehicleModel: string;
}

export interface User {
  userID?: string;
  name: string;
  email: string;
  password: string;
  type: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    userID: string;
    email: string;
    type: number;
  };
  token?: string;
}

export interface MaintenanceHistory {
  id: string;
  vehicleId: string;
  description: string;
  date: string;
  cost?: number;
}

// Endpoints de Veículos com paginação
export const getVehicles = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/Vehicles?${queryParams.toString()}`);
};

export const createVehicle = (vehicleData: Partial<Vehicle>) => api.post('/Vehicles', vehicleData);
export const getVehicleById = (id: string) => api.get(`/Vehicles/${id}`);
export const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => api.put(`/Vehicles/${id}`, vehicleData);
export const deleteVehicle = (id: string) => api.delete(`/Vehicles/${id}`);

// Endpoints de Usuários com paginação
export const getUsers = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/User?${queryParams.toString()}`);
};

export const createUser = (userData: Partial<User>) => api.post('/User', userData);
export const getUserById = (id: string) => api.get(`/User/${id}`);
export const updateUser = (id: string, userData: Partial<User>) => api.put(`/User/${id}`, userData);
export const deleteUser = (id: string) => api.delete(`/User/${id}`);

// Endpoints de Históricos de Manutenção com paginação
export const getMaintenanceHistories = (params?: PaginationParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  return api.get(`/Histories?${queryParams.toString()}`);
};

export const createMaintenanceHistory = (historyData: Partial<MaintenanceHistory>) => api.post('/Histories', historyData);
export const getMaintenanceHistoryById = (id: string) => api.get(`/Histories/${id}`);
export const updateMaintenanceHistory = (id: string, historyData: Partial<MaintenanceHistory>) => api.put(`/Histories/${id}`, historyData);
export const deleteMaintenanceHistory = (id: string) => api.delete(`/Histories/${id}`);

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/Auth/login', {
      email,
      password
    });

    if (response.status === 200 && response.data?.token) {
      // Decodificar o token JWT para obter informações do usuário
      const tokenParts = response.data.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));

        return {
          success: true,
          message: 'Login realizado com sucesso',
          user: {
            userID: payload.sub || '',
            name: payload.name || '',
            email: payload.email || email,
            type: parseInt(payload.userType || '0')
          },
          token: response.data.token
        };
      }

      return {
        success: true,
        message: 'Login realizado com sucesso',
        token: response.data.token
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        message: response.data?.message || 'Email ou senha incorretos'
      };
    }

    return {
      success: false,
      message: 'Erro ao conectar com o servidor'
    };
  } catch (error: any) {
    console.error('Erro no login:', error);

    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Credenciais inválidas'
      };
    }

    if (error.request) {
      return {
        success: false,
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.'
      };
    }

    return {
      success: false,
      message: 'Erro inesperado ao fazer login'
    };
  }
};

export const authenticateUser = loginUser;

export const registerUser = async (userData: { name: string; email: string; password: string; type?: number }) => {
  try {
    const userPayload: Partial<User> = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      type: userData.type || 0
    };
    
    const response = await createUser(userPayload);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data
      };
    } else {
      throw new Error(response.data?.error || 'Erro ao registrar usuário');
    }
  } catch (error: any) {
    console.error('Erro no registro:', error);
    throw new Error(error.response?.data?.error || error.message || 'Erro ao registrar usuário');
  }
};

export default api;

