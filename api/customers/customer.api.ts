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
  offset = 0,
  limit = 10,
  searchBy = '',
  search = '',
  sortBy = '',
  orderBy = '',
  status = '',
  country = '',
}: {
  token: string;
  offset?: number;
  limit?: number;
  searchBy?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  status?: string;
  country?: string;
}) => {
  const payload: any = {
    offSet: offset,
    limit,
  };

  // Map display searchBy to backend field names
  if (searchBy) {
    const searchByMap: Record<string, string> = {
      Name: 'name',
      'Company Name': 'companyName',
      Email: 'email',
      Phone: 'phoneNumber',
      customerNumber: 'customerNumber',
    };

    payload.searchBy = searchByMap[searchBy] || searchBy;
  }

  if (search) {
    payload.search = search;
  }

  // Map sortBy display values to backend
  if (sortBy) {
    const sortByMap: Record<string, string> = {
      Chronological: 'chronological',
      Name: 'name',
      'Company Name': 'companyName',
      Email: 'email',
    };
    payload.sortBy = sortByMap[sortBy] || sortBy;
  }

  if (orderBy) {
    payload.orderBy = orderBy;
  }

  if (status) {
    payload.status = String(status).toLowerCase();
  }

  if (country) {
    payload.country = country;
  }

  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.CUSTOMERS.GET_CUSTOMERS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload,
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
