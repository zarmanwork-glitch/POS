import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';

interface CustomerType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
}

export const createCustomer = async ({
  token,
  payload,
  successCallbackFunction,
}: CustomerType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.ADD_CUSTOMER,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: successMessagesEnums.CUSTOMERS.ADD_CUSTOMER,
    successCallback: successCallbackFunction,
  });
};

export const updateCustomer = async ({
  token,
  payload,
  successCallbackFunction,
}: CustomerType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER,
    method: backendApiEnums.METHODS.PATCH,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: successMessagesEnums.CUSTOMERS.UPDATE_CUSTOMER,
    successCallback: successCallbackFunction,
  });
};

export const getCustomersList = async ({
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
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.GET_CUSTOMERS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload: {
      offSet: offset,
      limit,
    },
  });
};

export const getCustomerById = async ({
  token,
  customerId,
}: {
  token: string;
  customerId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: customerId,
    },
  });
};

export const deleteCustomer = async ({
  token,
  customerId,
}: {
  token: string;
  customerId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: customerId,
    },
  });
};
