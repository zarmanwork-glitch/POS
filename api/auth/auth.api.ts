import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';
import Cookies from 'js-cookie';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  status: 'success' | 'error';
  data: {
    results: {
      user: {
        id: string;
        email: string;
      };
      token: string;
    };
  };
  message?: string;
}

export const login = async ({
  payload,
  successCallbackFunction,
}: {
  payload: LoginPayload;
  successCallbackFunction?: () => void;
}) => {
  try {
    const response = await api_client({
      endpoint: backendApiEnums.ENDPOINTS.AUTH.LOGIN,
      method: backendApiEnums.METHODS.POST,
      payload,
      isDisplayResponsePopUp: true,
      successMessage: successMessagesEnums.AUTH.LOGIN,
      successCallback: successCallbackFunction,
    });

    const data = response?.data as AuthResponse;

    if (data?.status === 'success' && data?.data?.results?.token) {
      Cookies.set('authToken', data.data.results.token);
      Cookies.set('userEmail', data.data.results.user.email);
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
