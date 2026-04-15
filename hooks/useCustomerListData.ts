import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getCustomersList } from '@/api/customers/customer.api';
import { Customer } from '@/types/customerTypes';
import { UseCustomerListDataProps } from '@/types/hookTypes';

export const useCustomerListData = ({
  page,
  limit,
  searchBy,
  search,
  sortBy,
  orderBy,
  status,
  country,
}: UseCustomerListDataProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const fetchCustomers = async () => {
        try {
          setIsLoading(true);
          const token = Cookies.get('authToken');
          if (!token) {
            toast.error('Authentication token not found');
            return;
          }

          const offset = Math.max(0, (page - 1) * limit);

          const payloadToSend: any = {
            token,
            offset,
            limit,
          };

          if (search) Object.assign(payloadToSend, { searchBy, search });
          if (sortBy) Object.assign(payloadToSend, { sortBy });
          if (orderBy) Object.assign(payloadToSend, { orderBy });
          if (status && status !== 'Both')
            Object.assign(payloadToSend, { status });
          if (country && country !== 'All')
            Object.assign(payloadToSend, { country });

          const response = await getCustomersList(payloadToSend);

          const fetchedCustomers =
            response?.data?.data?.results?.customers ||
            response?.data?.results?.customers ||
            response?.data?.data?.results?.items ||
            response?.data?.results?.items ||
            response?.data?.items ||
            [];

          const fetched = Array.isArray(fetchedCustomers)
            ? fetchedCustomers
            : [];

          setCustomers(fetched);

          const results =
            response?.data?.data?.results ||
            response?.data?.results ||
            response?.data ||
            {};

          const total =
            results?.total ||
            results?.totalCount ||
            results?.totalRecords ||
            results?.count ||
            results?.recordsCount ||
            response?.data?.total ||
            0;

          if (typeof total === 'number' && total > 0) {
            setTotalItems(total);
          } else if (Array.isArray(fetched) && fetched.length > 0) {
            setTotalItems((page - 1) * limit + fetched.length);
          } else {
            setTotalItems(0);
          }

          setHasMore(Array.isArray(fetched) ? fetched.length >= limit : false);
        } catch (error: any) {
          console.error('Error fetching customers:', error);
          toast.error('Error fetching customers', { duration: 2000 });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCustomers();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [page, limit, search, sortBy, orderBy, searchBy, status, country]);

  return {
    customers,
    setCustomers,
    isLoading,
    totalItems,
    hasMore,
  };
};
