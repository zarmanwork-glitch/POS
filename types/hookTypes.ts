// Hook-specific types
import { InvoiceStatusType } from '@/enums/invoiceStatus';
import { InvoiceTypeType } from '@/enums/invoiceType';
import { BusinessDetailExtended } from '@/types/businessDetailTypes';
import { CustomerExtended } from '@/types/customerTypes';
import { BankDetailExtended } from '@/types/bankDetailTypes';

// Search by type
export type SearchByType =
  | 'invoiceNumber'
  | 'customerPoNumber'
  | 'name'
  | 'companyName'
  | 'customerNumber';

// API response types
export interface ApiResponse<T> {
  data?: {
    data?: {
      results?: T;
    };
    results?: T;
  };
}

// Invoice list data types
export interface ApiInvoice {
  id?: string;
  _id?: string;
  invoiceNumber: string;
  invoiceDate?: string;
  createdAt?: string;
  dueDate?: string;
  type: InvoiceTypeType;
  customer?:
    | {
        name?: string;
        companyName?: string;
        location?: string;
        country?: string;
        city?: string;
      }
    | string;
  totalAmount?: number;
  invoiceNetTotal?: number;
  AmountPaidToDate?: number;
  currency?: string;
  status: InvoiceStatusType;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceType: InvoiceTypeType;
  customer: string;
  customerCompanyName: string;
  customerCountry: string;
  customerCity: string;
  customerLocation: string;
  total: number;
  currency: string;
  status: InvoiceStatusType;
}

// Hook props interfaces
export interface UseInvoiceListDataProps {
  page: number;
  sortBy: 'createdAt' | 'invoiceDate';
  orderBy: 'asc' | 'desc';
  searchBy: SearchByType;
  search: string;
  startDate: string;
  endDate: string;
  statusFilter: 'All' | InvoiceStatusType;
  typeFilter: 'All' | InvoiceTypeType;
}

export interface UseCustomerListDataProps {
  page: number;
  limit: number;
  searchBy: string;
  search: string;
  sortBy: string;
  orderBy: 'asc' | 'desc';
  status: string;
  country: string;
}

// Dropdown API results
export interface DropdownApiResults {
  businessDetails?: BusinessDetailExtended[];
  customers?: CustomerExtended[];
  bankDetails?: BankDetailExtended[];
  items?: Record<string, unknown>[];
}

// Dropdown data types
export interface DropdownData {
  businessOptions: BusinessDetailExtended[];
  customerOptions: CustomerExtended[];
  bankOptions: BankDetailExtended[];
  itemOptions: Record<string, unknown>[];
  isLoading: boolean;
}

// Searchable fields interface
export interface HasSearchableFields {
  [key: string]: any;
}
