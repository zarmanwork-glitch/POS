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
    successMessage: successMessagesEnums.ITEMS.ADD_ITEM,
    successCallback: successCallbackFunction,
  });
};

export const getItemsList = async ({
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
    endpoint: backendApiEnums.ENDPOINTS.ITEMS.GET_ITEMS_LIST,
    method: backendApiEnums.METHODS.POST,
    payload: {
      offSet: offset,
      limit,
    },
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
