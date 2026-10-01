import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'noboghat_jwt_token';

// Configurable base URL: priority order is app.config.ts extra -> env -> fallback to production Render backend
const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
export const API_BASE_URL =
  extraApiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://noboghat-bangladesh.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Secure Store Token Helpers
export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to retrieve token from SecureStore:', error);
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to delete token from SecureStore:', error);
  }
}

// Global 401 callback listener for auth state synchronizer
let onUnauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorizedHandler = handler;
}

// Request Interceptor: Attach Authorization Bearer token from SecureStore
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 and trigger logout/redirect
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await clearToken();
      if (onUnauthorizedHandler) {
        onUnauthorizedHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
