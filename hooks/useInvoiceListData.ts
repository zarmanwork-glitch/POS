import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getInvoicesList } from '@/api/invoices/invoice.api';
import { Invoice } from '@/types/invoiceTypes';
import { ApiInvoice, UseInvoiceListDataProps } from '@/types/hookTypes';

// Re-export Invoice type for backward compatibility
export type { Invoice };

const limit = 10;

export const useInvoiceListData = (filters: UseInvoiceListDataProps) => {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const fetchInvoices = async () => {
        try {
          setLoading(true);
          const token = Cookies.get('authToken');

          // Build payload with only non-empty values
          const payload: any = {
            offSet: (filters.page - 1) * limit,
            limit,
          };

          // Always add sortBy, orderBy, invoiceDate and createdAt
          payload.sortBy = filters.sortBy;
          payload.orderBy = filters.orderBy;
          payload.invoiceDate = 'invoiceDate';
          payload.createdAt = 'createdAt';

          // Only add search parameters if search is not empty
          if (filters.search) {
            payload.searchBy = filters.searchBy;
            payload.search = filters.search;
          }

          // Only add status if selected
          if (filters.statusFilter !== 'All') {
            payload.status = filters.statusFilter;
          }

          // Only add type if selected
          if (filters.typeFilter !== 'All') {
            payload.type = filters.typeFilter;
          }

          const res = await getInvoicesList({
            token: token || '',
            offset: (filters.page - 1) * limit,
            limit,
            filters: payload,
            startDate: filters.startDate,
            endDate: filters.endDate,
          });

          const results =
            res?.data?.data?.results?.invoice ??
            res?.data?.data?.results?.invoices ??
            [];

          const count =
            res?.data?.data?.results?.recordsCount ??
            res?.data?.data?.results?.totalCount ??
            0;

          const mapped: Invoice[] = results.map((inv: ApiInvoice) => ({
            id: inv.id || inv._id || '',
            invoiceNumber: inv.invoiceNumber,
            invoiceDate:
              (typeof inv.invoiceDate === 'string'
                ? inv.invoiceDate
                : typeof inv.createdAt === 'string'
                  ? inv.createdAt
                  : ''
              )?.slice(0, 10) || '',
            dueDate: inv.dueDate?.slice(0, 10) || '',
            invoiceType: inv.type,
            customer:
              (typeof inv.customer === 'object'
                ? inv.customer?.name || inv.customer?.companyName || ''
                : inv.customer) || '',
            customerCompanyName:
              (typeof inv.customer === 'object'
                ? inv.customer?.companyName || ''
                : '') || '',
            customerCountry:
              (typeof inv.customer === 'object'
                ? inv.customer?.country || ''
                : '') || '',
            customerCity:
              (typeof inv.customer === 'object'
                ? inv.customer?.city || ''
                : '') || '',
            customerLocation:
              (typeof inv.customer === 'object'
                ? inv.customer?.location || ''
                : '') || '',
            total:
              inv.invoiceNetTotal ??
              inv.totalAmount ??
              inv.AmountPaidToDate ??
              0,
            currency: inv.currency || '',
            status: inv.status,
          }));

          setItems(mapped);
          setTotalCount(count);
        } catch (err) {
          console.error(err);
          toast.error('Failed to load invoices');
        } finally {
          setLoading(false);
        }
      };

      fetchInvoices();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    filters.page,
    filters.sortBy,
    filters.orderBy,
    filters.searchBy,
    filters.search,
    filters.startDate,
    filters.endDate,
    filters.statusFilter,
    filters.typeFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    items,
    loading,
    totalCount,
    totalPages,
    limit,
  };
};
