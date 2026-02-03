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
  responseType?: AxiosRequestConfig['responseType'];
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
  responseType = 'json',
}: ApiGatewayParams) => {
  const isFormData =
    typeof FormData !== 'undefined' && payload instanceof FormData;

  const headers: Record<string, any> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) {
    headers['Content-Type'] = contentType ?? 'application/json';
  } else if (contentType) {
    // allow explicit contentType for FormData if provided
    headers['Content-Type'] = contentType;
  }
  const config: AxiosRequestConfig = {
    method,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    headers,
    ...(payload && { data: payload }),
    ...(onUploadProgress && { onUploadProgress }),
    ...(responseType && { responseType }),
  };

  try {
    const response = await axios(config);

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

    if (successCallback && typeof successCallback === 'function') {
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
    const backendMessageKey = error.response?.data?.message;

    if (isDisplayResponsePopUp) {
      // Helper to resolve API message keys to user-friendly messages
      const resolveMessage = (
        key: string | null | undefined,
      ): string | undefined => {
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

      // Helper to parse validation errors
      const parseValidationErrors = (message: string): string[] => {
        const errors: string[] = [];

        // Split by "items." to separate each error
        const parts = message.split(/(?=items\.\d+\.)/);

        for (const part of parts) {
          if (!part.trim()) continue;

          // Match pattern: items.INDEX.FIELD followed by error message
          const match = part.match(/^items\.(\d+)\.(\w+)\s+(.+?)$/s);
          if (!match) continue;

          const itemIndex = parseInt(match[1]) + 1; // Convert to 1-based index
          const fieldName = match[2];
          const errorMsg = match[3].trim();

          // Format user-friendly error message
          let friendlyMsg: string;

          // Clean up common error messages
          if (
            errorMsg.includes('should not be empty') ||
            errorMsg.includes('is required')
          ) {
            friendlyMsg = `Item ${itemIndex}: ${fieldName} is required`;
          } else if (errorMsg.includes('cannot be negative')) {
            friendlyMsg = `Item ${itemIndex}: ${fieldName} cannot be negative`;
          } else if (errorMsg.includes('greater than unit rate')) {
            friendlyMsg = `Item ${itemIndex}: ${fieldName} cannot be greater than unit rate`;
          } else if (errorMsg.includes('must be one of the following values')) {
            friendlyMsg = `Item ${itemIndex}: ${fieldName} has an invalid value. Please select a valid unit.`;
          } else {
            // For other errors, just show first 100 chars
            const shortMsg =
              errorMsg.length > 100
                ? errorMsg.substring(0, 100) + '...'
                : errorMsg;
            friendlyMsg = `Item ${itemIndex}: ${fieldName} - ${shortMsg}`;
          }

          errors.push(friendlyMsg);
        }

        return errors;
      };

      let messageToDisplay: string;

      // First try to resolve the backend message key
      const resolvedMessage = resolveMessage(backendMessageKey);

      if (resolvedMessage) {
        messageToDisplay = resolvedMessage;
      } else if (typeof errorMessage === 'string') {
        // Check if it contains validation errors
        const validationErrors = parseValidationErrors(errorMessage);
        if (validationErrors.length > 0) {
          // Show each validation error as a separate toast
          validationErrors.forEach((err, idx) => {
            setTimeout(() => {
              toast.error(err, { duration: 4000 });
            }, idx * 100);
          });
          return error.response;
        }
        messageToDisplay = errorMessage;
      } else if (typeof errorMessage === 'object' && errorMessage?.message) {
        messageToDisplay = errorMessage.message;
      } else if (backendMessageKey) {
        // Check if backendMessageKey contains validation errors
        const validationErrors = parseValidationErrors(backendMessageKey);
        if (validationErrors.length > 0) {
          validationErrors.forEach((err, idx) => {
            setTimeout(() => {
              toast.error(err, { duration: 4000 });
            }, idx * 100);
          });
          return error.response;
        }
        messageToDisplay = backendMessageKey;
      } else {
        messageToDisplay =
          'An unexpected error occurred. Please try again later.';
      }

      toast.error(messageToDisplay);
    }

    errorCallback?.();
    return error.response;
  }
};
