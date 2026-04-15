import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';
import Cookies from 'js-cookie';
import { LoginPayload, AuthResponse } from '@/types/apiTypes';

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
      Cookies.set('authToken', data.data.results.token, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax',
        expires: 7,
      });
      Cookies.set('userEmail', data.data.results.user.email, {
        secure: window.location.protocol === 'https:',
        sameSite: 'lax',
        expires: 7,
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};
