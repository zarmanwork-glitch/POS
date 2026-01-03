'use client';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosProgressEvent,
} from 'axios';
import Router from 'next/router';
import { toast } from 'sonner';
import { ApiKeys } from '@/utils/apiMessages';

interface ApiGatewayParams {
  endpoint: string;
  method: AxiosRequestConfig['method'];
  token?: string | null;
  payload?: any;
  isDisplayResponsePopUp?: boolean;
  successMessage?: string | null;
  successCallback?: (() => void) | null;
  successPlainText?: string | null;
  contentType?: string | null;
  errorCallback?: (() => void) | null;
  directAction?: boolean;
  onUploadProgress?: ((progressEvent: AxiosProgressEvent) => void) | null;
}

export const api_client = async ({
  endpoint,
  method,
  token = null,
  payload = null,
  isDisplayResponsePopUp = false,
  successMessage = null,
  successCallback = null,
  successPlainText = null,
  contentType = null,
  errorCallback = null,
  directAction = false,
  onUploadProgress = null,
}: ApiGatewayParams) => {
  const config: AxiosRequestConfig = {
    method,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': contentType ?? 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(payload && { data: payload }),
    ...(onUploadProgress && { onUploadProgress }),
  };

  try {
    const response = await axios(config);

    if (successCallback && typeof successCallback === 'function') {
      if (!directAction && isDisplayResponsePopUp) {
        const resolveMessage = (key: string | null | undefined) => {
          if (!key) return undefined;
          try {
            for (const group of ApiKeys) {
              for (const sectionKey in group) {
                const section: any = (group as any)[sectionKey];
                if (
                  section &&
                  Object.prototype.hasOwnProperty.call(section, key)
                ) {
                  return section[key];
                }
              }
            }
          } catch (e) {
            return undefined;
          }
          return undefined;
        };

        const friendly =
          resolveMessage(successMessage) ??
          successMessage ??
          'Action performed successfully.';

        toast.success(friendly, {
          description: successPlainText ?? undefined,
        });
      }
      successCallback();
    }

    return response;
  } catch (err) {
    const error = err as AxiosError<any>;

    if (
      error.response?.data?.data?.results?.error === 'UnauthorizedException'
    ) {
      Router.push('/login');
      return;
    }

    const errorMessage = error.response?.data?.data?.results?.error;

    if (isDisplayResponsePopUp) {
      const messageToDisplay =
        typeof errorMessage === 'string'
          ? errorMessage
          : typeof errorMessage === 'object' && errorMessage?.message
          ? errorMessage.message
          : 'An unexpected error occurred. Please try again later.';

      toast.error(messageToDisplay);
    }

    errorCallback?.();
    return error.response;
  }
};
