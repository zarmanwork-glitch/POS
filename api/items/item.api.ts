import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';

interface ItemType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  successMessage?: string;
}

export const addITEM = async ({
  token,
  payload,
  successCallbackFunction,
}: ItemType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.ADD_ITEMS,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    // successMessage: successMessagesEnums.ITEMS.ADD_ITEM,

    successCallback: successCallbackFunction,
  });
};

export const getItemsList = async ({
  token,
  offset = 1,
  limit = 10,
  searchBy = '',
  search = '',
  sortBy = '',
}: {
  token: string;
  offset?: number;
  limit?: number;
  searchBy?: string;
  search?: string;
  sortBy?: string;
}) => {
  const payload: any = {
    offSet: offset,
    limit,
  };

  // Map display values to backend lowercase values
  if (searchBy) {
    const searchByMap: Record<string, string> = {
      Description: 'description',
      'Material / Service Code': 'materialNo',
    };
    payload.searchBy = searchByMap[searchBy] || searchBy.toLowerCase();
  }

  if (search) {
    payload.search = search;
  }

  if (sortBy) {
    const sortByMap: Record<string, string> = {
      Chronological: 'chronological',
      Description: 'description',
      'Material / Service Code': 'materialNo',
    };
    payload.sortBy = sortByMap[sortBy] || sortBy.toLowerCase();
  }

  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.GET_ITEMS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload,
  });
};

export const getItemById = async ({
  token,
  itemId,
}: {
  token: string;
  itemId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.GET_ITEMS_BY_ID,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: itemId,
    },
  });
};

export const updateItem = async ({
  token,
  payload,
  successCallbackFunction,
}: ItemType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.UPDATE_ITEM,
    method: backendApiEnums.METHODS.PATCH,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: 'Customer updated successfully',
    successCallback: successCallbackFunction,
  });
};

export const deleteItem = async ({
  token,
  itemId,
}: {
  token: string;
  itemId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.DELETE_ITEM,
    method: backendApiEnums.METHODS.POST,
    payload: {
      id: itemId,
    },
  });
};
