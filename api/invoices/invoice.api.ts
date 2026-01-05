import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';

interface InvoiceType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
}

export const createInvoice = async ({
  token,
  payload,
  successCallbackFunction,
}: InvoiceType) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.INVOICES.ADD_INVOICE,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: successMessagesEnums.INVOICES.ADD_INVOICE,
    successCallback: successCallbackFunction,
  });
};

export const getInvoicesList = async ({
  token,
  offset = 0,
  limit = 10,
  filters = {},
}: {
  token: string;
  offset?: number;
  limit?: number;
  filters?: any;
}) => {
  const payload: any = {
    offSet: offset,
    limit,
    ...filters,
  };

  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.INVOICES.GET_INVOICES_LIST,
    method: backendApiEnums.METHODS.POST,
    payload,
  });
};

export const getInvoiceById = async ({
  token,
  invoiceId,
}: {
  token: string;
  invoiceId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.INVOICES.GET_INVOICE_BY_ID,
    method: backendApiEnums.METHODS.POST,
    payload: { id: invoiceId },
  });
};
