'use client';

import BilledBySection from '@/components/page-component/BilledBySection';
import BilledToSection from '@/components/page-component/BilledToSection';
import PaymentInfoSection from '@/components/page-component/PaymentInfoSection';
import { FormikProps } from 'formik';
import {
  InvoiceFormValues,
  BusinessDetail,
  Customer,
  BankDetail,
} from '@/types/invoiceTypes';

interface InvoiceFormSectionsProps {
  selectedBusinessDetails: BusinessDetail | null;
  setSelectedBusinessDetails: (detail: BusinessDetail | null) => void;
  businessSearch: string;
  setBusinessSearch: (search: string) => void;
  businessFocused: boolean;
  setBusinessFocused: (focused: boolean) => void;
  businessOptions: any[];
  filteredBusinessOptions: any[];

  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  customerSearch: string;
  setCustomerSearch: (search: string) => void;
  customerFocused: boolean;
  setCustomerFocused: (focused: boolean) => void;
  customerOptions: any[];
  filteredCustomerOptions: any[];

  selectedBank: BankDetail | null;
  setSelectedBank: (bank: BankDetail | null) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  bankFocused: boolean;
  setBankFocused: (focused: boolean) => void;
  bankOptions: any[];
  filteredBankOptions: any[];

  formik: FormikProps<InvoiceFormValues>;
  t: (key: string) => string;
}

export function InvoiceFormSections({
  selectedBusinessDetails,
  setSelectedBusinessDetails,
  businessSearch,
  setBusinessSearch,
  businessFocused,
  setBusinessFocused,
  businessOptions,
  filteredBusinessOptions,
  selectedCustomer,
  setSelectedCustomer,
  customerSearch,
  setCustomerSearch,
  customerFocused,
  setCustomerFocused,
  customerOptions,
  filteredCustomerOptions,
  selectedBank,
  setSelectedBank,
  bankSearch,
  setBankSearch,
  bankFocused,
  setBankFocused,
  bankOptions,
  filteredBankOptions,
  formik,
  t,
}: InvoiceFormSectionsProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4'>
      <BilledBySection
        selectedBusinessDetails={selectedBusinessDetails}
        setSelectedBusinessDetails={setSelectedBusinessDetails}
        businessSearch={businessSearch}
        setBusinessSearch={setBusinessSearch}
        businessFocused={businessFocused}
        setBusinessFocused={setBusinessFocused}
        businessOptions={businessOptions}
        filteredBusinessOptions={filteredBusinessOptions}
        formik={formik}
        t={t}
      />

      <BilledToSection
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customerSearch={customerSearch}
        setCustomerSearch={setCustomerSearch}
        customerFocused={customerFocused}
        setCustomerFocused={setCustomerFocused}
        customerOptions={customerOptions}
        filteredCustomerOptions={filteredCustomerOptions}
        formik={formik}
        t={t}
      />

      <PaymentInfoSection
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        bankSearch={bankSearch}
        setBankSearch={setBankSearch}
        bankFocused={bankFocused}
        setBankFocused={setBankFocused}
        bankOptions={bankOptions}
        filteredBankOptions={filteredBankOptions}
        formik={formik}
        t={t}
      />
    </div>
  );
}
