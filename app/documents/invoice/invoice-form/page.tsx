'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { taxCodes } from '@/enums/taxCode';
import { useFormik } from 'formik';
import { createInvoice } from '@/api/invoices/invoice.api';
import BilledBySection from '@/components/page-component/BilledBySection';
import BilledToSection from '@/components/page-component/BilledToSection';
import PaymentInfoSection from '@/components/page-component/PaymentInfoSection';
import ItemDetailsSection from '@/components/page-component/ItemDetailsSection';
import SecondaryControlsSection from '@/components/page-component/SecondaryControlsSection';
import InvoiceFooterSection from '@/components/page-component/InvoiceFooterSection';
import { calculateItemRow } from '@/utils/itemCalculations';

import {
  InvoiceFormValues,
  BusinessDetail,
  Customer,
  BankDetail,
} from '@/types/invoiceTypes';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';
import { useDropdownSearch } from '@/hooks/useDropdownSearch';
import { useInvoiceDropdownData } from '@/hooks/useInvoiceDropdownData';
import { invoiceValidationSchema } from '@/schema/invoiceFormValidation';
import { InvoiceDetailsGrid } from '@/components/page-component/InvoiceDetailsGrid';
import { LogoUploadSection } from '@/components/page-component/LogoUploadSection';
import { InvoiceTotalsSummary } from '@/components/page-component/InvoiceTotalsSummary';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';

export default function InvoiceFormPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);

  //custom hooks for form state and data
  const {
    items,
    logoPreview,
    setLogoPreview,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceForm();
  const { businessOptions, customerOptions, bankOptions, itemOptions } =
    useInvoiceDropdownData();

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

  const handleSubmitInvoice = async (values: InvoiceFormValues) => {
    try {
      setIsLoading(true);

      // Validate required selections
      if (!values.business_detail_id) {
        toast.error('Please select a business detail');
        return;
      }
      if (!values.customer_id) {
        toast.error('Please select a customer');
        return;
      }
      if (!values.bank_detail_id) {
        toast.error('Please select a bank detail');
        return;
      }

      // Validate items
      if (items.length === 0) {
        toast.error('Please add at least one item');
        return;
      }

      const hasInvalidItems = items.some(
        (item) => !item.description || !item.quantity || !item.unitRate
      );
      if (hasInvalidItems) {
        toast.error(
          'Please fill in all required item fields (description, quantity, rate)'
        );
        return;
      }

      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No token found');
        toast.error('Authentication error');
        return;
      }

      const totals = calculateInvoiceTotals(items);

      // Transform items to include calculated fields
      const transformedItems = items.map((item, idx) => {
        const { vatAmount, totalAmount } = calculateItemRow(item);

        // Normalize discountType to API expected values
        const normalizedDiscountType =
          item.discountType?.toLowerCase() === 'percentage'
            ? 'percentage'
            : item.discountType?.toLowerCase() === 'number'
            ? 'number'
            : 'number'; // default to 'number' if not specified

        return {
          no: idx + 1,
          description: item.description,
          serviceCode: item.serviceCode,
          unit: item.unitOfMeasure,
          quantity: item.quantity,
          unitRate: item.unitRate,
          discount: item.discount,
          discountType: normalizedDiscountType,
          taxRate: item.taxRate,
          taxCode: item.taxCode,
          vatAmount: vatAmount,
          total: totalAmount,
        };
      });

      const payload = {
        invoiceNumber: values.invoiceNumber,
        incoterms: values.incoterms,
        location: values.location,
        invoiceDate: values.invoiceDate,
        dueDate: values.dueDate,
        supplyDate: values.supplyDate,
        supplyEndDate: values.supplyEndDate,
        contractId: values.contractId,
        customerPoNumber: values.customerPoNumber,
        paymentTerms: values.paymentTerms,
        paymentMeans: values.paymentMeans,
        specialTaxTreatment: values.specialTaxTreatment,
        prePaymentInvoice: values.prePaymentInvoice,
        businessDetailId: values.business_detail_id,
        bankDetailId: values.bank_detail_id,
        customerId: values.customer_id,
        currency: values.currency,
        items: transformedItems,
        subTotal: totals.subTotal,
        totalDiscount: totals.totalDiscount,
        totalTaxableAmount: totals.totalTaxableAmount,
        totalVat: totals.totalVATAmount,
        invoiceNetTotal: totals.totalInvoiceAmount,
        notes: '',
      };

      await createInvoice({
        token: token || '',
        payload,
        successCallbackFunction: () =>
          router.push('/documents/invoice/invoice-list'),
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      supplyDate: '',
      supplyEndDate: '',
      incoterms: 'N/A',
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
    onSubmit: handleSubmitInvoice,
  });

  // Filter functions for search
  const filteredBusinessOptions = businessSearch.filtered;
  const filteredCustomerOptions = customerSearch.filtered;
  const filteredBankOptions = bankSearch.filtered;

  return (
    <div
      className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>{t('invoices.documents')}</span>
            <span className='text-gray-800'>
              | {t('invoices.form.createInvoice')}
            </span>
          </h2>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant='outline'
              onClick={() => router.back()}
            >
              {t('invoices.cancel')}
            </Button>
            <Button
              className='bg-blue-600 hover:bg-blue-700'
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner className='h-4 w-4 text-white' />
              ) : (
                t('invoices.form.save')
              )}
            </Button>
          </div>
        </div>

        {/* Top grid - Invoice Details */}
        <InvoiceDetailsGrid
          formik={formik}
          t={t}
        />

        {/* Logo Upload Section */}
        <LogoUploadSection
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          t={t}
        />

        {/* Secondary controls */}
        <SecondaryControlsSection
          formik={formik}
          t={t}
        />

        {/* Middle section - billed by / billed to / payment info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4'>
          <BilledBySection
            selectedBusinessDetails={selectedBusinessDetails}
            setSelectedBusinessDetails={setSelectedBusinessDetails}
            businessSearch={businessSearch.search}
            setBusinessSearch={businessSearch.setSearch}
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
            customerSearch={customerSearch.search}
            setCustomerSearch={customerSearch.setSearch}
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
            bankSearch={bankSearch.search}
            setBankSearch={bankSearch.setSearch}
            bankFocused={bankFocused}
            setBankFocused={setBankFocused}
            bankOptions={bankOptions}
            filteredBankOptions={filteredBankOptions}
            formik={formik}
            t={t}
          />
        </div>

        {/* ITEM DETAILS */}
        <ItemDetailsSection
          items={items}
          unitOfMeasures={unitOfMeasures}
          taxCodes={taxCodes}
          updateItem={updateItem}
          removeItem={removeItem}
          addItem={addItem}
          itemOptions={itemOptions}
          itemSearch={itemSearch}
          setItemSearch={setItemSearch}
        />

        {/* Totals Summary */}
        <InvoiceTotalsSummary items={items} />

        {/* Invoice Footer */}
        <InvoiceFooterSection
          formik={formik}
          invoiceTotal={calculateInvoiceTotals(items).totalInvoiceAmount}
          t={t}
        />
      </form>
    </div>
  );
}
