export type BusinessDetail = {
  id?: string;
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
};

export type Customer = {
  id?: string;
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  customerNumber?: string;
};

export type BankDetail = {
  id?: string;
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  country?: string;
};

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
};

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
