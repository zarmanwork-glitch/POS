import { api_client } from '@/api/api_client';
import { backendApiEnums } from '@/enums/backendApi.enums';
import { successMessagesEnums } from '@/enums/successMessages.enum';
import axios from 'axios';
import { toast } from 'sonner';

interface InvoiceType {
  token: string;
  payload?: any;
  successCallbackFunction?: () => void;
  file?: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export const createInvoice = async ({
  token,
  payload,
  successCallbackFunction,
  file,
  onUploadProgress,
}: InvoiceType) => {
  // If file is provided, use FormData and axios directly
  if (file) {
    const formData = new FormData();

    // Add all payload fields to FormData
    if (payload) {
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (key === 'items') {
          // Handle items array - send each field separately for backend validation
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              Object.keys(item).forEach((itemKey) => {
                formData.append(
                  `items[${index}][${itemKey}]`,
                  String(item[itemKey]),
                );
              });
            });
          }
        } else if (value !== null && value !== undefined) {
          // Handle other fields as simple values
          formData.append(key, String(value));
        }
      });
    }

    // Add file
    formData.append('logo', file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${backendApiEnums.ENDPOINTS.INVOICES.ADD_INVOICE}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        },
      );

      // Show success toast
      toast.success('Invoice Created Successfully', {
        duration: 2000,
      });

      if (
        successCallbackFunction &&
        typeof successCallbackFunction === 'function'
      ) {
        successCallbackFunction();
      }

      return response;
    } catch (error) {
      console.error('Error uploading invoice with logo:', error);
      toast.error('Error creating invoice', { duration: 2000 });
      throw error;
    }
  }

  // If no file, use the regular API client
  const res = await api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.INVOICES.ADD_INVOICE,
    method: backendApiEnums.METHODS.POST,
    payload,
    isDisplayResponsePopUp: true,
    successMessage: successMessagesEnums.INVOICES.ADD_INVOICE,
    successCallback: successCallbackFunction,
  });

  // try to return the created invoice object if present (matches Postman)
  try {
    return res?.data?.data?.results?.invoice ?? res;
  } catch (e) {
    return res;
  }
};

export const getInvoicesList = async ({
  token,
  offset = 0,
  limit = 10,
  filters = {},
  startDate = '',
  endDate = '',
}: {
  token: string;
  offset?: number;
  limit?: number;
  filters?: any;
  startDate?: string;
  endDate?: string;
}) => {
  const payload: any = {
    offSet: offset,
    limit,
    ...filters,
  };

  // Add date filters if provided
  if (startDate) {
    payload.invoiceStartDate = startDate;
  }
  if (endDate) {
    payload.invoiceEndDate = endDate;
  }

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

export const downloadInvoicePdf = async ({
  token,
  invoiceId,
}: {
  token: string;
  invoiceId: string;
}) => {
  return api_client({
    token,
    endpoint: backendApiEnums.ENDPOINTS.INVOICES.DOWNLOAD,
    method: backendApiEnums.METHODS.POST,
    payload: { id: invoiceId },
    responseType: 'blob',
  });
};
