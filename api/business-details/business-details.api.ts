import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import axios from 'axios';

interface BusinessDetailsType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
  file?: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export const addBusinessDetails = async ({
  token,
  payload,
  successCallbackFunction,
  file,
  onUploadProgress,
}: BusinessDetailsType) => {
  // If file is provided, use FormData and axios directly
  if (file) {
    const formData = new FormData();

    // Add all payload fields to FormData
    if (payload) {
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    // Add file
    formData.append('logo', file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.ADD_BUSINESS_DETAILS}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        }
      );

      if (
        successCallbackFunction &&
        typeof successCallbackFunction === 'function'
      ) {
        successCallbackFunction();
      }

      return response;
    } catch (error) {
      console.error('Error uploading business details with logo:', error);
      throw error;
    }
  }

  // If no file, use the regular API client
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.ADD_BUSINESS_DETAILS,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: 'Business details added successfully',
    successCallback: successCallbackFunction,
  });
};

export const updateBusinessDetails = async ({
  token,
  payload,
  businessDetailsId,
  successCallbackFunction,
  file,
  onUploadProgress,
}: BusinessDetailsType & { businessDetailsId?: string }) => {
  // If file is provided, use FormData and axios directly
  if (file) {
    const formData = new FormData();

    // Add all payload fields to FormData
    if (payload) {
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    // Add file
    formData.append('logo', file);

    try {
      const endpoint = businessDetailsId
        ? `${backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.UPDATE_BUSINESS_DETAILS}/${businessDetailsId}`
        : backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.UPDATE_BUSINESS_DETAILS;

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        }
      );

      if (
        successCallbackFunction &&
        typeof successCallbackFunction === 'function'
      ) {
        successCallbackFunction();
      }

      return response;
    } catch (error) {
      console.error('Error updating business details with logo:', error);
      throw error;
    }
  }

  // If no file, use the regular API client
  return api_client({
    token,
    endpoint: businessDetailsId
      ? `${backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.UPDATE_BUSINESS_DETAILS}/${businessDetailsId}`
      : backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.UPDATE_BUSINESS_DETAILS,
    method: backendApiEnums.METHODS.PATCH,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: 'Business details updated successfully',
    successCallback: successCallbackFunction,
  });
};

export const getBusinessDetailsList = async ({
  token,
  offset = 1,
  limit = 10,
}: {
  token: string;
  offset?: number;
  limit?: number;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.BUSINESS_DETAILS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload: {
      offSet: offset,
      limit,
    },
  });
};

export const getBusinessDetailsById = async ({
  token,
  businessDetailsId,
}: {
  token: string;
  businessDetailsId: string;
}) => {
  return api_client({
    token,
    endpoint:
      backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.GET_BUSINESS_DETAILS_BY_ID,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: businessDetailsId,
    },
  });
};

export const deleteBusinessDetails = async ({
  token,
  businessDetailsId,
}: {
  token: string;
  businessDetailsId: string;
}) => {
  return api_client({
    token,
    endpoint:
      backendApiEnums.ENDPOINTS.BUSINESS_DETAILS.DELETE_BUSINESS_DETAILS,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: businessDetailsId,
    },
  });
};
