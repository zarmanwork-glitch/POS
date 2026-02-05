import { useTranslation } from 'react-i18next';
import { InvoiceStatusType } from '@/enums/invoiceStatus';
import { InvoiceTypeType } from '@/enums/invoiceType';

// Business detail type for invoice dropdowns
export type BusinessDetail = {
  id?: string;
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
};

// Customer type for invoice dropdowns
export type Customer = {
  id?: string;
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  customerNumber?: string;
};

// Bank detail type for invoice dropdowns
export type BankDetail = {
  id?: string;
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  country?: string;
};

// Invoice line item
export type InvoiceItem = {
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
};

// Invoice form values
export type InvoiceFormValues = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  supplyDate: string;
  supplyEndDate: string;
  incoterms: string;
  location: string;
  contractId: string;
  customerPoNumber: string;
  specialBillingArrangement: string;
  specialTransactionType: string;
  paymentTerms: string;
  paymentMeans: string;
  specialTaxTreatment: string;
  prePaymentInvoice: boolean;
  business_detail_id: string;
  bank_detail_id: string;
  customer_id: string;
  currency: string;
};

// Invoice list item (transformed from API)
export type Invoice = {
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
};

// Invoice table props
export interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  page: number;
  limit: number;
  onDownloadPdf: (invoiceId: string) => void;
  onPreview: (invoiceId: string) => void;
  onViewDetails: (invoiceId: string) => void;
  onEmailInvoice: (invoiceId: string) => void;
  t: ReturnType<typeof useTranslation>[0];
}
