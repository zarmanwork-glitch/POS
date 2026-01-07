'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { incoTerms } from '@/enums/incoTerms';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { taxCodes } from '@/enums/taxCode';
import { getBusinessDetailsForSelection } from '@/api/business-details/business-details.api';
import { getCustomersForSelection } from '@/api/customers/customer.api';
import { getBankDetailsForSelection } from '@/api/bank-details/bank-details.api';
import { getItemsForSelection } from '@/api/items/item.api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createInvoice } from '@/api/invoices/invoice.api';
import { SummaryRow } from '@/components/page-component/SummaryRow';
import BilledBySection from '@/components/page-component/BilledBySection';
import BilledToSection from '@/components/page-component/BilledToSection';
import PaymentInfoSection from '@/components/page-component/PaymentInfoSection';
import ItemDetailsSection from '@/components/page-component/ItemDetailsSection';
import SecondaryControlsSection from '@/components/page-component/SecondaryControlsSection';
import InvoiceFooterSection from '@/components/page-component/InvoiceFooterSection';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { calculateItemRow } from '@/utils/itemCalculations';

import { Card } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import {
  BusinessDetail,
  Customer,
  BankDetail,
  InvoiceItem,
  InvoiceFormValues,
} from '@/types/invoiceTypes';

export default function InvoiceFormPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);

  const [selectedBusinessDetails, setSelectedBusinessDetails] =
    useState<BusinessDetail | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);

  const [businessOptions, setBusinessOptions] = useState<BusinessDetail[]>([]);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [bankOptions, setBankOptions] = useState<BankDetail[]>([]);
  const [itemOptions, setItemOptions] = useState<any[]>([]);

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: '',
      serviceCode: '',
      quantity: 1,
      unitRate: '',
      unitOfMeasure: 'unit',
      discount: '',
      discountType: 'PERC',
      taxRate: 0,
      taxCode: 'S',
    },
  ]);

  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [businessSearch, setBusinessSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  const [businessFocused, setBusinessFocused] = useState(false);
  const [customerFocused, setCustomerFocused] = useState(false);
  const [bankFocused, setBankFocused] = useState(false);

  const invoiceValidationSchema = Yup.object({
    invoiceDate: Yup.date().required('Invoice date is required'),
    dueDate: Yup.date().required('Due date is required'),
    paymentMeans: Yup.string().required('Payment means is required'),
    business_detail_id: Yup.string().required('Business details required'),
    customer_id: Yup.string().required('Customer required'),
    currency: Yup.string().required('Currency required'),
  });

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

      // Transform items to include calculated fields
      const transformedItems = items.map((item, idx) => {
        const { vatAmount, totalAmount } = calculateItemRow(item);
        return {
          no: idx + 1,
          description: item.description,
          serviceCode: item.serviceCode,
          unit: item.unitOfMeasure,
          quantity: item.quantity,
          unitRate: item.unitRate,
          discount: item.discount,
          discountType: item.discountType,
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
        subTotal: subTotal,
        totalDiscount: totalDiscount,
        totalTaxableAmount: totalTaxable,
        totalVat: totalVAT,
        invoiceNetTotal: invoiceTotal,
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Fetch lists for dropdowns on mount
  useEffect(() => {
    let isMounted = true;

    const fetchLists = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        const [bResp, cResp, bkResp, itemResp] = await Promise.all([
          getBusinessDetailsForSelection({ token }),
          getCustomersForSelection({ token }),
          getBankDetailsForSelection({ token }),
          getItemsForSelection({ token }),
        ]);

        if (!isMounted) return;

        setBusinessOptions(
          bResp?.data?.data?.results?.businessDetails ||
            bResp?.data?.data?.results ||
            bResp?.data?.data ||
            bResp?.data ||
            []
        );

        setCustomerOptions(
          cResp?.data?.data?.results?.customers ||
            cResp?.data?.results?.customers ||
            cResp?.data?.data?.results ||
            cResp?.data?.data ||
            cResp?.data ||
            []
        );

        setBankOptions(
          bkResp?.data?.data?.results?.bankDetails ||
            bkResp?.data?.results?.bankDetails ||
            bkResp?.data?.data?.results ||
            bkResp?.data?.data ||
            bkResp?.data ||
            []
        );

        const itemsArray = Array.isArray(
          itemResp?.data?.data?.results?.items ||
            itemResp?.data?.data?.results ||
            itemResp?.data?.data ||
            itemResp?.data ||
            []
        )
          ? itemResp?.data?.data?.results?.items ||
            itemResp?.data?.data?.results ||
            itemResp?.data?.data ||
            itemResp?.data ||
            []
          : [];

        setItemOptions(itemsArray);
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching dropdown lists:', error);
          toast.error('Failed to load dropdown data');
        }
      }
    };

    fetchLists();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter functions for search
  const filteredBusinessOptions = businessOptions.filter((b) => {
    const query = businessSearch.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(query)) ||
      (b.companyName && b.companyName.toLowerCase().includes(query)) ||
      (b.email && b.email.toLowerCase().includes(query)) ||
      (b.phoneNumber && b.phoneNumber.toLowerCase().includes(query))
    );
  });

  const filteredCustomerOptions = customerOptions.filter((c) => {
    const query = customerSearch.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.companyName && c.companyName.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phoneNumber && c.phoneNumber.toLowerCase().includes(query)) ||
      (c.customerNumber && c.customerNumber.toLowerCase().includes(query))
    );
  });

  const filteredBankOptions = bankOptions.filter((b) => {
    const query = bankSearch.toLowerCase();
    return (
      (b.bankName && b.bankName.toLowerCase().includes(query)) ||
      (b.accountNumber && b.accountNumber.toLowerCase().includes(query)) ||
      (b.country && b.country.toLowerCase().includes(query))
    );
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const addItem = () => {
    setItems((it) => [
      ...it,
      {
        description: '',
        serviceCode: '',
        quantity: 1,
        unitRate: '',
        unitOfMeasure: 'unit',
        discount: '',
        discountType: 'PERC',
        taxRate: 0,
        taxCode: 'S',
      },
    ]);
  };

  const updateItem = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    setItems((it) =>
      it.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    );
  };

  const removeItem = (index: number) => {
    setItems((it) => it.filter((_, i) => i !== index));
  };

  const totals = calculateInvoiceTotals(items);
  const subTotal = totals.subTotal;
  const totalDiscount = totals.totalDiscount;
  const totalTaxable = totals.totalTaxableAmount;
  const totalVAT = totals.totalVATAmount;
  const invoiceTotal = totals.totalInvoiceAmount;

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
              {' '}
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

        {/* Top grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm text-gray-700 mb-1'>
              {t('invoices.form.invoiceNumber')} (Optional):
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='INV-123456'
              name='invoiceNumber'
              value={formik.values.invoiceNumber}
              onChange={formik.handleChange}
            />
            <div className='text-xs text-gray-400 mt-1'>
              {t('invoices.form.autoGeneratedIfBlank')}
            </div>

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              {t('invoices.form.invoiceDate')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='invoiceDate'
              value={formik.values.invoiceDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {!formik.values.invoiceDate && (
              <div className='text-xs text-gray-400 mt-1'>
                {t('invoices.form.chooseDate')}
              </div>
            )}

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              {t('invoices.form.supplyDate')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='supplyDate'
              value={formik.values.supplyDate}
              onChange={formik.handleChange}
            />
            {!formik.values.supplyDate && (
              <div className='text-xs text-gray-400 mt-1'>
                {t('invoices.form.chooseDate')}
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-700 mb-1'>
              {t('invoices.form.incoTerms')}:
            </label>
            <div className='flex items-center gap-3'>
              <Select
                value={formik.values.incoterms}
                onValueChange={(v) => formik.setFieldValue('incoterms', v)}
              >
                <SelectTrigger className='bg-blue-50 h-10 w-28'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {incoTerms.map((it) => (
                    <SelectItem
                      key={it.value}
                      value={it.value}
                    >
                      {it.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className='bg-blue-50 h-10 flex-1'
                placeholder={t('invoices.form.location')}
                name='location'
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </div>

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              {t('invoices.form.dueDate')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='dueDate'
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dueDate && formik.errors.dueDate ? (
              <div className='text-sm text-red-500'>
                {String(formik.errors.dueDate)}
              </div>
            ) : null}
            {!formik.values.dueDate && (
              <div className='text-xs text-gray-400 mt-1'>
                {t('invoices.form.chooseDate')}
              </div>
            )}

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              {t('invoices.form.supplyEndDate')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='supplyEndDate'
              value={formik.values.supplyEndDate}
              onChange={formik.handleChange}
            />
            {!formik.values.supplyEndDate && (
              <div className='text-xs text-gray-400 mt-1'>
                {t('invoices.form.chooseDate')}
              </div>
            )}
          </div>

          <div>
            <Card
              className='border-2 border-dashed border-gray-300 h-full rounded-md flex items-center justify-center p-6 bg-blue-50 hover:border-blue-400 transition-colors'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer gap-3'>
                {logoPreview ? (
                  <div className='w-full flex flex-col items-center gap-2'>
                    <Image
                      src={logoPreview}
                      alt={t('invoices.form.logoPreviewAlt')}
                      width={160}
                      height={160}
                      className='w-auto h-auto max-w-40 max-h-40 object-contain'
                    />
                    <button
                      type='button'
                      className='text-xs text-blue-600 hover:text-blue-800 mt-2'
                      onClick={(e) => {
                        e.preventDefault();
                        setLogoPreview('');
                        if (fileInputRef.current)
                          fileInputRef.current.value = '';
                      }}
                    >
                      {t('invoices.form.removeLogo')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold text-gray-300'>
                      {t('invoices.form.logoLabel')}
                    </div>
                    <Upload className='h-6 w-6 text-gray-400' />
                    <p className='text-center text-gray-400 text-sm'>
                      {t('invoices.form.dragDropLogo')}
                    </p>
                  </>
                )}
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  className='hidden'
                />
              </label>
            </Card>
          </div>

          <div className='mt-4'>
            <label className='block text-sm text-gray-700 mb-1'>
              {t('invoices.form.contractId')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder={t('invoices.form.contractId')}
              name='contractId'
              value={formik.values.contractId}
              onChange={formik.handleChange}
            />

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              {t('invoices.customerPoNumber')}:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder={t('invoices.customerPoNumber')}
              name='customerPoNumber'
              value={formik.values.customerPoNumber}
              onChange={formik.handleChange}
            />
          </div>
        </div>

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

        {/* total section */}

        <div className='space-y-2'>
          <Separator />

          <SummaryRow
            label='Sub Total:'
            value={subTotal.toFixed(2)}
          />
          <SummaryRow
            label='Total Item Discount Amount:'
            value={`-${totalDiscount.toFixed(2)}`}
          />
          <SummaryRow
            label='Total Taxable Amount:'
            value={totalTaxable.toFixed(2)}
          />
          <SummaryRow
            label='Total VAT:'
            value={totalVAT.toFixed(2)}
          />

          <SummaryRow
            label='Total VAT (SAR):'
            value={totalVAT.toFixed(2)}
            editable
          />

          <Separator />

          <SummaryRow
            label='Invoice Net Total:'
            value={invoiceTotal.toFixed(2)}
            bold
          />

          <Separator />

          {/* Invoice Footer */}
          <InvoiceFooterSection
            formik={formik}
            invoiceTotal={invoiceTotal}
            t={t}
          />
        </div>
      </form>
    </div>
  );
}
