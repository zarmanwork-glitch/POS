import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';

interface BankDetailsType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
}

export const addBankDetails = async ({
  token,
  payload,
  successCallbackFunction,
}: BankDetailsType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BANK_DETAILS.ADD_BANK_DETAILS,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: 'Bank details added successfully',
    successCallback: successCallbackFunction,
  });
};

export const updateBankDetails = async ({
  token,
  payload,
  successCallbackFunction,
}: BankDetailsType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BANK_DETAILS.UPDATE_BANK_DETAILS,
    method: backendApiEnums.METHODS.PATCH,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: 'Bank details updated successfully',
    successCallback: successCallbackFunction,
  });
};

export const getBankDetailsList = async ({
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
    endpoint: backendApiEnums.ENDPOINTS.BANK_DETAILS.BANK_DETAILS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload: {
      offSet: offset,
      limit,
    },
  });
};

export const getBankDetailsById = async ({
  token,
  bankDetailsId,
}: {
  token: string;
  bankDetailsId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BANK_DETAILS.GET_BANK_DETAILS_BY_ID,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: bankDetailsId,
    },
  });
};

export const deleteBankDetails = async ({
  token,
  bankDetailsId,
}: {
  token: string;
  bankDetailsId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.BANK_DETAILS.DELETE_BANK_DETAILS,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: bankDetailsId,
    },
  });
};
