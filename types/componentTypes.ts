// Component props types
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { InvoiceFormValues } from './invoiceTypes';
import type { Customer, CustomerExtended } from './customerTypes';
import { BusinessDetail, BusinessDetailExtended } from './businessDetailTypes';
import { BankDetail, BankDetailExtended } from './bankDetailTypes';

// Re-export extended types for component usage
export type { CustomerExtended, BusinessDetailExtended, BankDetailExtended };

// Base translation function type
export type TranslationFunction = (key: string, params?: any) => string;

// Delete dialog props
export interface DeleteCustomerDialogProps {
  open: boolean;
  customerName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: TranslationFunction;
}

export interface DeleteBusinessDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isDeleting: boolean;
  deleteItemName: string;
  confirmDelete: () => void;
  t: any;
}

// Table props
export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  page: number;
  limit: number;
  onEdit: (customerId: string) => void;
  onDelete: (customerId: string, customerName: string) => void;
  t: TranslationFunction;
}

export interface BusinessDetailsTableProps {
  data: Array<{
    id: string;
    name: string;
    companyName: string;
    email: string;
    phoneNumber: string;
    vatNumber?: string;
    companyRegistrationNumber?: string;
    identificationNumber?: string;
    country: string;
  }>;
  isLoading: boolean;
  handleEdit: (id: string) => void;
  handleDeleteClick: (id: string, companyName: string) => void;
  t: any;
}

// Controls/Filter props
export interface CustomerListControlsProps {
  searchCustomer: string;
  setSearchCustomer: (value: string) => void;
  searchBy: string;
  setSearchBy: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  orderBy: 'asc' | 'desc';
  setOrderBy: (value: 'asc' | 'desc') => void;
  setPage: (value: number) => void;
  onShowFilters: () => void;
  showFilters: boolean;
  filters: {
    status: string;
    country: string;
  };
  setFilters: (filters: { status: string; country: string }) => void;
  t: TranslationFunction;
}

export interface CustomerFiltersPanelProps {
  showFilters: boolean;
  filters: {
    status: string;
    country: string;
  };
  setFilters: (filters: { status: string; country: string }) => void;
  onClose: () => void;
  t: TranslationFunction;
}

export interface InvoiceControlsBarProps {
  search: string;
  searchBy:
    | 'invoiceNumber'
    | 'customerPoNumber'
    | 'name'
    | 'companyName'
    | 'customerNumber';
  sortBy: 'createdAt' | 'invoiceDate';
  orderBy: 'asc' | 'desc';
  showFilters: boolean;
  activeFilters: Array<{ key: string; label: string }>;
  loading: boolean;
  isRTL: boolean;
  startDate: string;
  endDate: string;
  onSearchChange: (value: string) => void;
  onSearchByChange: (value: string) => void;
  onSortByChange: (value: 'createdAt' | 'invoiceDate') => void;
  onOrderByChange: () => void;
  onShowFilters: () => void;
  onClearFilter: (key: string) => void;
  onSearch: () => void;
  onDownload: () => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  t: ReturnType<typeof useTranslation>[0];
}

export interface InvoiceFilterPanelProps {
  onReset: () => void;
  onApply: () => void;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>[0];
}

// Pagination props
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface InvoicePaginationProps extends PaginationProps {}

export interface BusinessDetailsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  totalItems: number;
  hasMore: boolean;
}

// Invoice form related props
export interface InvoiceFormHeaderProps {
  isLoading: boolean;
  isRTL: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  cancelLabel: string;
  saveLabel: string;
  documentLabel: string;
  createLabel: string;
}

export interface InvoiceDetailsGridProps {
  formik: FormikProps<InvoiceFormValues>;
  t: ReturnType<typeof useTranslation>[0];
}

export interface InvoiceFooterSectionProps {
  formik: FormikProps<any>;
  invoiceTotal: number;
  t: TranslationFunction;
}

export interface InvoiceTotalsSummaryProps {
  items: Array<{
    description: string;
    serviceCode: string;
    quantity: number;
    unitRate: string;
    unitOfMeasure: string;
    discount: string;
    discountType: 'PERC' | 'NUMBER';
    taxRate: number;
    taxCode: string;
    vatSa32?: string;
    outOfScope?: string;
    exempt?: string;
  }>;
}

export interface LogoUploadSectionProps {
  logo: File | null;
  setLogo: (file: File | null) => void;
  logoPreview: string;
  setLogoPreview: (preview: string) => void;
  t: ReturnType<typeof useTranslation>[0];
}

export interface InvoiceFormSectionsProps {
  selectedBusinessDetails: BusinessDetailExtended | null;
  setSelectedBusinessDetails: (detail: BusinessDetailExtended | null) => void;
  businessSearch: string;
  setBusinessSearch: (search: string) => void;
  businessFocused: boolean;
  setBusinessFocused: (focused: boolean) => void;
  businessOptions: BusinessDetailExtended[];
  filteredBusinessOptions: BusinessDetailExtended[];

  selectedCustomer: CustomerExtended | null;
  setSelectedCustomer: (customer: CustomerExtended | null) => void;
  customerSearch: string;
  setCustomerSearch: (search: string) => void;
  customerFocused: boolean;
  setCustomerFocused: (focused: boolean) => void;
  customerOptions: CustomerExtended[];
  filteredCustomerOptions: CustomerExtended[];

  selectedBank: BankDetailExtended | null;
  setSelectedBank: (bank: BankDetailExtended | null) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  bankFocused: boolean;
  setBankFocused: (focused: boolean) => void;
  bankOptions: BankDetailExtended[];
  filteredBankOptions: BankDetailExtended[];

  formik: FormikProps<InvoiceFormValues>;
  t: TranslationFunction;
}

export interface InvoiceDatesIncoTermsProps {
  formik: any;
  t: any;
}

// Section props
export interface BilledBySectionProps {
  selectedBusinessDetails: BusinessDetailExtended | null;
  setSelectedBusinessDetails: (details: BusinessDetailExtended | null) => void;
  businessSearch: string;
  setBusinessSearch: (search: string) => void;
  businessFocused: boolean;
  setBusinessFocused: (focused: boolean) => void;
  businessOptions: BusinessDetailExtended[];
  filteredBusinessOptions: BusinessDetailExtended[];
  formik: any;
  t: TranslationFunction;
}

export interface BilledToSectionProps {
  selectedCustomer: CustomerExtended | null;
  setSelectedCustomer: (customer: CustomerExtended | null) => void;
  customerSearch: string;
  setCustomerSearch: (search: string) => void;
  customerFocused: boolean;
  setCustomerFocused: (focused: boolean) => void;
  customerOptions: CustomerExtended[];
  filteredCustomerOptions: CustomerExtended[];
  formik: any;
  t: TranslationFunction;
}

export interface PaymentInfoSectionProps {
  selectedBank: BankDetailExtended | null;
  setSelectedBank: (bank: BankDetailExtended | null) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  bankFocused: boolean;
  setBankFocused: (focused: boolean) => void;
  bankOptions: BankDetailExtended[];
  filteredBankOptions: BankDetailExtended[];
  formik: any;
  t: TranslationFunction;
}

// Dropdown props
export interface DropdownOption {
  value: string;
  displayText?: string;
  description?: string;
  [key: string]: any;
}

export interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  searchValue: string;
  isOpen: boolean;
  options: DropdownOption[];
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: (option: DropdownOption) => void;
  onClear: () => void;
  error?: string;
  touched?: boolean;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  isSelected?: boolean;
  selectedDisplayValue?: string;
}

// Modal props
export interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadingPreview: boolean;
  previewUrl: string | null;
}

// Base component props
export interface DetailRow {
  label: string;
  value: string | undefined;
}

export interface DetailsDisplayCardProps {
  title: string;
  displayName: string | undefined;
  onClear: () => void;
  detailRows: DetailRow[];
  showIdentification?: boolean;
  identificationLabel?: string;
  identificationTypePlaceholder?: string;
  identificationNumberPlaceholder?: string;
}

export interface ToggleButtonProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  optionA: { value: T; label: React.ReactNode };
  optionB: { value: T; label: React.ReactNode };
  label?: string;
  required?: boolean;
  className?: string;
  showStatusText?: boolean;
}

export interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
  editable?: boolean;
  tooltip?: string;
}
