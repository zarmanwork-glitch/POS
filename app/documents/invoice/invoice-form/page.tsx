'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { taxCodes } from '@/enums/taxCode';
import {
  InvoiceFormValues,
  BusinessDetail,
  Customer,
  BankDetail,
} from '@/types/invoiceTypes';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { useDropdownSearch } from '@/hooks/useDropdownSearch';
import { useInvoiceDropdownData } from '@/hooks/useInvoiceDropdownData';
import { useInvoiceSubmit } from '@/hooks/useInvoiceSubmit';
import { invoiceValidationSchema } from '@/schema/invoiceFormValidation';
import { InvoiceDetailsGrid } from '@/components/page-component/InvoiceDetailsGrid';
import { LogoUploadSection } from '@/components/page-component/LogoUploadSection';
import { InvoiceFormHeader } from '@/components/page-component/InvoiceFormHeader';
import { InvoiceFormSections } from '@/components/page-component/InvoiceFormSections';
import ItemDetailsSection from '@/components/page-component/ItemDetailsSection';
import SecondaryControlsSection from '@/components/page-component/SecondaryControlsSection';
import InvoiceFooterSection from '@/components/page-component/InvoiceFooterSection';
import { InvoiceTotalsSummary } from '@/components/page-component/InvoiceTotalsSummary';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';

export default function InvoiceFormPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    items,
    logoPreview,
    setLogoPreview,
    addItemDetail,
    updateItem,
    removeItem,
  } = useInvoiceForm();
  const { businessOptions, customerOptions, bankOptions, itemOptions } =
    useInvoiceDropdownData();
  const { submitInvoice, isLoading } = useInvoiceSubmit();

  // Dropdown search states using custom hook
  const businessSearch = useDropdownSearch(businessOptions, [
    'name',
    'companyName',
    'email',
    'phoneNumber',
  ]);
  const customerSearch = useDropdownSearch(customerOptions, [
    'name',
    'companyName',
    'email',
    'phoneNumber',
    'customerNumber',
  ]);
  const bankSearch = useDropdownSearch(bankOptions, [
    'bankName',
    'accountNumber',
    'country',
  ]);

  const [selectedBusinessDetails, setSelectedBusinessDetails] =
    useState<BusinessDetail | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);

  const [itemSearch, setItemSearch] = useState('');
  const [businessFocused, setBusinessFocused] = useState(false);
  const [customerFocused, setCustomerFocused] = useState(false);
  const [bankFocused, setBankFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      supplyDate: '',
      supplyEndDate: '',
      incoterms: 'na',
      location: '',
      contractId: '',
      customerPoNumber: '',
      specialBillingArrangement: 'NA',
      specialTransactionType: 'NA',
      paymentTerms: '',
      paymentMeans: '',
      specialTaxTreatment: '',
      prePaymentInvoice: false,
      business_detail_id: '',
      bank_detail_id: '',
      customer_id: '',
      currency: 'SAR - Saudi Riyal',
    },
    validationSchema: invoiceValidationSchema,
    onSubmit: (values) => submitInvoice(values, items),
  });

  return (
    <div
      className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        <InvoiceFormHeader
          isLoading={isLoading}
          isRTL={isRTL}
          onSubmit={() => formik.handleSubmit()}
          onCancel={() => router.back()}
          cancelLabel={t('invoices.cancel')}
          saveLabel={t('invoices.form.save')}
          documentLabel={t('invoices.documents')}
          createLabel={t('invoices.form.createInvoice')}
        />

        <InvoiceDetailsGrid
          formik={formik}
          t={t}
        />

        <LogoUploadSection
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          t={t}
        />

        <SecondaryControlsSection
          formik={formik}
          t={t}
        />

        <InvoiceFormSections
          selectedBusinessDetails={selectedBusinessDetails}
          setSelectedBusinessDetails={setSelectedBusinessDetails}
          businessSearch={businessSearch.search}
          setBusinessSearch={businessSearch.setSearch}
          businessFocused={businessFocused}
          setBusinessFocused={setBusinessFocused}
          businessOptions={businessOptions}
          filteredBusinessOptions={businessSearch.filtered}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customerSearch={customerSearch.search}
          setCustomerSearch={customerSearch.setSearch}
          customerFocused={customerFocused}
          setCustomerFocused={setCustomerFocused}
          customerOptions={customerOptions}
          filteredCustomerOptions={customerSearch.filtered}
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          bankSearch={bankSearch.search}
          setBankSearch={bankSearch.setSearch}
          bankFocused={bankFocused}
          setBankFocused={setBankFocused}
          bankOptions={bankOptions}
          filteredBankOptions={bankSearch.filtered}
          formik={formik}
          t={t}
        />

        <ItemDetailsSection
          items={items}
          unitOfMeasures={unitOfMeasures}
          taxCodes={taxCodes}
          updateItem={updateItem}
          removeItem={removeItem}
          addItem={addItemDetail}
          itemOptions={itemOptions}
          itemSearch={itemSearch}
          setItemSearch={setItemSearch}
        />

        <InvoiceTotalsSummary items={items} />

        <InvoiceFooterSection
          formik={formik}
          invoiceTotal={calculateInvoiceTotals(items).totalInvoiceAmount}
          t={t}
        />
      </form>
    </div>
  );
}
