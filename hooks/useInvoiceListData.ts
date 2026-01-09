import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getInvoicesList } from '@/api/invoices/invoice.api';
import { InvoiceStatusType } from '@/enums/invoiceStatus';
import { InvoiceTypeType } from '@/enums/invoiceType';

type ApiInvoice = {
  id?: string;
  _id?: string;
  invoiceNumber: string;
  invoiceDate?: string;
  createdAt?: string;
  dueDate?: string;
  type: InvoiceTypeType;
  customer?:
    | { name?: string; companyName?: string; location?: string }
    | string;
  totalAmount?: number;
  AmountPaidToDate?: number;
  currency?: string;
  status: InvoiceStatusType;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceType: InvoiceTypeType;
  customer: string;
  customerLocation: string;
  total: number;
  currency: string;
  status: InvoiceStatusType;
};

interface UseInvoiceListDataProps {
  page: number;
  sortBy: 'createdAt' | 'invoiceDate';
  orderBy: 'asc' | 'desc';
  searchBy:
    | 'invoiceNumber'
    | 'customerPoNumber'
    | 'name'
    | 'companyName'
    | 'customerNumber';
  search: string;
  startDate: string;
  endDate: string;
  statusFilter: 'All' | InvoiceStatusType;
  typeFilter: 'All' | InvoiceTypeType;
}

const limit = 10;

export const useInvoiceListData = (filters: UseInvoiceListDataProps) => {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
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
          customerLocation:
            (typeof inv.customer === 'object'
              ? inv.customer?.location || ''
              : '') || '',
          total: inv.totalAmount ?? inv.AmountPaidToDate ?? 0,
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
