import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getBusinessDetailsForSelection } from '@/api/business-details/business-details.api';
import { getCustomersForSelection } from '@/api/customers/customer.api';
import { getBankDetailsForSelection } from '@/api/bank-details/bank-details.api';
import { getItemsForSelection } from '@/api/items/item.api';
import { BusinessDetailExtended } from '@/types/businessDetailTypes';
import { CustomerExtended } from '@/types/customerTypes';
import { BankDetailExtended } from '@/types/bankDetailTypes';
import {
  ApiResponse,
  DropdownApiResults,
  DropdownData,
} from '@/types/hookTypes';

export const useInvoiceDropdownData = (): DropdownData => {
  const [businessOptions, setBusinessOptions] = useState<
    BusinessDetailExtended[]
  >([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerExtended[]>(
    [],
  );
  const [bankOptions, setBankOptions] = useState<BankDetailExtended[]>([]);
  const [itemOptions, setItemOptions] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const extractData = useCallback(
    (
      response: ApiResponse<DropdownApiResults> | undefined,
    ): Record<string, unknown>[] => {
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
    [],
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

        setBusinessOptions(extractData(bResp) as BusinessDetailExtended[]);
        setCustomerOptions(extractData(cResp) as CustomerExtended[]);
        setBankOptions(extractData(bkResp) as BankDetailExtended[]);

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
