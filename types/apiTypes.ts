import { AxiosRequestConfig, AxiosProgressEvent } from 'axios';

// API client params
export interface ApiGatewayParams {
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

// Auth types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
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

// API function param types
export interface BankDetailsApiParams {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
}

export interface BusinessDetailsApiParams {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
  file?: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export interface CustomerApiParams {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
}

export interface InvoiceApiParams {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  file?: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export interface ItemApiParams {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
}
