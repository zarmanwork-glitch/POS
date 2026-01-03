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
  searchBy = '',
  search = '',
  sortBy = '',
  orderBy = 'desc',
  status = '',
  unitOfMeasure = '',
  buyPriceMin,
  buyPriceMax,
  sellPriceMin,
  sellPriceMax,
}: {
  token: string;
  offset?: number;
  limit?: number;
  searchBy?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  status?: string;
  unitOfMeasure?: string;
  buyPriceMin?: number | string;
  buyPriceMax?: number | string;
  sellPriceMin?: number | string;
  sellPriceMax?: number | string;
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

  if (orderBy) {
    payload.orderBy = orderBy;
  }

  // Additional filters
  if (status) {
    payload.status = String(status).toLowerCase();
  }

  if (unitOfMeasure) {
    payload.unitOfMeasure = unitOfMeasure;
  }

  const toNumberIfPresent = (v: any) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };

  const bMin = toNumberIfPresent(buyPriceMin);
  const bMax = toNumberIfPresent(buyPriceMax);
  const sMin = toNumberIfPresent(sellPriceMin);
  const sMax = toNumberIfPresent(sellPriceMax);

  if (bMin !== undefined) payload.buyPriceMin = bMin;
  if (bMax !== undefined) payload.buyPriceMax = bMax;
  if (sMin !== undefined) payload.sellPriceMin = sMin;
  if (sMax !== undefined) payload.sellPriceMax = sMax;

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
    successMessage: successMessagesEnums.ITEMS.UPDATE_ITEM,
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
    // Display backend success message key when delete completes
    isDisplayResponsePopUp: true,
    successMessage: successMessagesEnums.ITEMS.DELETE_ITEM,
  });
};
