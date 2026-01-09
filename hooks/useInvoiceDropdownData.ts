import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getBusinessDetailsForSelection } from '@/api/business-details/business-details.api';
import { getCustomersForSelection } from '@/api/customers/customer.api';
import { getBankDetailsForSelection } from '@/api/bank-details/bank-details.api';
import { getItemsForSelection } from '@/api/items/item.api';
import { BusinessDetail, Customer, BankDetail } from '@/types/invoiceTypes';

interface ApiResponse {
  data?: {
    data?: {
      results?: {
        businessDetails?: BusinessDetail[];
        customers?: Customer[];
        bankDetails?: BankDetail[];
        items?: Record<string, unknown>[];
      };
    };
    results?: {
      businessDetails?: BusinessDetail[];
      customers?: Customer[];
      bankDetails?: BankDetail[];
      items?: Record<string, unknown>[];
    };
  };
}

interface DropdownData {
  businessOptions: BusinessDetail[];
  customerOptions: Customer[];
  bankOptions: BankDetail[];
  itemOptions: Record<string, unknown>[];
  isLoading: boolean;
}

export const useInvoiceDropdownData = (): DropdownData => {
  const [businessOptions, setBusinessOptions] = useState<BusinessDetail[]>([]);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [bankOptions, setBankOptions] = useState<BankDetail[]>([]);
  const [itemOptions, setItemOptions] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const extractData = useCallback(
    (response: ApiResponse | undefined): Record<string, unknown>[] => {
      if (!response) return [];
      return (
        (response?.data?.data?.results?.businessDetails as Record<
          string,
          unknown
        >[]) ||
        (response?.data?.data?.results?.customers as Record<
          string,
          unknown
        >[]) ||
        (response?.data?.data?.results?.bankDetails as Record<
          string,
          unknown
        >[]) ||
        (response?.data?.data?.results?.items as Record<string, unknown>[]) ||
        (response?.data?.results?.businessDetails as Record<
          string,
          unknown
        >[]) ||
        (response?.data?.results?.customers as Record<string, unknown>[]) ||
        (response?.data?.results?.bankDetails as Record<string, unknown>[]) ||
        (response?.data?.results?.items as Record<string, unknown>[]) ||
        (response?.data?.data?.results as Record<string, unknown>[]) ||
        (response?.data?.data as Record<string, unknown>[]) ||
        (response?.data as Record<string, unknown>[]) ||
        []
      );
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchLists = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const [bResp, cResp, bkResp, itemResp] = await Promise.all([
          getBusinessDetailsForSelection({ token }),
          getCustomersForSelection({ token }),
          getBankDetailsForSelection({ token }),
          getItemsForSelection({ token }),
        ]);

        if (!isMounted) return;

        setBusinessOptions(extractData(bResp) as BusinessDetail[]);
        setCustomerOptions(extractData(cResp) as Customer[]);
        setBankOptions(extractData(bkResp) as BankDetail[]);

        const itemsArray = extractData(itemResp);
        setItemOptions(Array.isArray(itemsArray) ? itemsArray : []);
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching dropdown lists:', error);
          toast.error('Failed to load dropdown data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLists();

    return () => {
      isMounted = false;
    };
  }, [extractData]);

  return {
    businessOptions,
    customerOptions,
    bankOptions,
    itemOptions,
    isLoading,
  };
};
