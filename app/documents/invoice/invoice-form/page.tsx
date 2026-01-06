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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { X, Plus, Upload, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Card } from '@/components/ui/card';
import { incoTerms } from '@/enums/incoTerms';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { taxCodes } from '@/enums/taxCode';
import { getBusinessDetailsForSelection } from '@/api/business-details/business-details.api';
import { getCustomersForSelection } from '@/api/customers/customer.api';
import { getBankDetailsForSelection } from '@/api/bank-details/bank-details.api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createInvoice } from '@/api/invoices/invoice.api';
import { formatNumber, parseNumber } from '@/lib/number';

export default function InvoiceFormPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(false);

  const [selectedBusinessDetails, setSelectedBusinessDetails] =
    useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const [businessOptions, setBusinessOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [bankOptions, setBankOptions] = useState<any[]>([]);
  const [listsLoading, setListsLoading] = useState(true);

  const [items, setItems] = useState<any[]>([
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

  // reporting tags removed (unused)
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [businessSearch, setBusinessSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');

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

  const handleSubmitInvoice = async (values: any) => {
    try {
      setIsLoading(true);

      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No token found');
        toast.error('Authentication error');
        return;
      }

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
        business_detail_id: values.business_detail_id,
        bank_detail_id: values.bank_detail_id,
        customer_id: values.customer_id,
        currency: values.currency,
        items,
        notes: '',
      };

      await createInvoice({
        token: token as any,
        payload,
        successCallbackFunction: () => router.push('/documents/invoice'),
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error creating invoice');
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

  const handleField = (key: string, value: any) => {
    formik.setFieldValue(key, value);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
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
        setListsLoading(true);

        const token = Cookies.get('authToken');
        if (!token) return;

        const [bResp, cResp, bkResp] = await Promise.all([
          getBusinessDetailsForSelection({ token }),
          getCustomersForSelection({ token }),
          getBankDetailsForSelection({ token }),
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
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching dropdown lists:', error);
          toast.error('Failed to load dropdown data');
        }
      } finally {
        if (isMounted) {
          setListsLoading(false);
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
        setLogo(file);
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

  const updateItem = (index: number, key: string, value: any) => {
    setItems((it) =>
      it.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    );
  };

  const removeItem = (index: number) => {
    setItems((it) => it.filter((_, i) => i !== index));
  };

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
                    <img
                      src={logoPreview}
                      alt={t('invoices.form.logoPreviewAlt')}
                      className='w-auto h-auto max-w-40 max-h-40 object-contain'
                    />
                    <button
                      type='button'
                      className='text-xs text-blue-600 hover:text-blue-800 mt-2'
                      onClick={(e) => {
                        e.preventDefault();
                        setLogo(null);
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
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Payment Terms:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='Terms'
              name='paymentTerms'
              value={formik.values.paymentTerms}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Payment Means:
            </label>
            <div>
              <Select
                value={formik.values.paymentMeans}
                onValueChange={(v) => formik.setFieldValue('paymentMeans', v)}
              >
                <SelectTrigger className='bg-blue-50 h-10'>
                  <SelectValue placeholder='Select payment means' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='30'>30</SelectItem>
                  <SelectItem value='42'>42</SelectItem>
                  <SelectItem value='48'>48</SelectItem>
                  <SelectItem value='1'>1</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.paymentMeans && formik.errors.paymentMeans ? (
                <div className='text-sm text-red-500'>
                  {String(formik.errors.paymentMeans)}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-700 mb-1'>
              {t('invoices.form.specialTaxTreatment')}:
            </label>
            <textarea
              className='w-full bg-blue-50 border rounded-md p-2 h-24'
              placeholder={t('invoices.form.specialTaxTreatment')}
              name='specialTaxTreatment'
              value={formik.values.specialTaxTreatment}
              onChange={formik.handleChange}
            />

            <div className='flex items-center gap-3 mt-3'>
              <label className='text-sm text-gray-700'>
                {t('invoices.form.prePaymentInvoice')}:
              </label>
              <button
                type='button'
                onClick={() =>
                  formik.setFieldValue(
                    'prePaymentInvoice',
                    !formik.values.prePaymentInvoice
                  )
                }
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formik.values.prePaymentInvoice
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formik.values.prePaymentInvoice
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className='text-sm text-gray-600 mt-2'>
              {formik.values.prePaymentInvoice
                ? t('invoices.form.yes')
                : t('invoices.form.no')}
            </p>
          </div>
        </div>

        {/* Middle section - billed by / billed to / payment info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4'>
          {/* BILLED BY */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='mb-3'>
                <h3 className='text-sm font-semibold text-gray-700'>
                  {t('invoices.form.selectedBusinessDetails')}
                </h3>
                <span className='text-xs text-gray-400'>
                  {t('invoices.form.selectBusinessDetails')}
                </span>
              </div>
              <div>
                <button className='text-sm text-blue-600 mb-3'>
                  {t('invoices.form.change')}
                </button>
              </div>
            </div>

            {/* Selected Business Details Chip */}
            {selectedBusinessDetails && (
              <div className='p-3 mb-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    {t('invoices.form.selectBusinessDetails')}:
                    <span className='text-red-500'>*</span>
                  </span>
                  <div className='flex items-center gap-2 bg-white border rounded px-2 py-1'>
                    <span className='text-sm text-gray-700'>
                      {selectedBusinessDetails.companyName ||
                        selectedBusinessDetails.displayName ||
                        selectedBusinessDetails.name}
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedBusinessDetails(null);
                        formik.setFieldValue('business_detail_id', '');
                      }}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                {/* Identification section */}
                <div className='mb-3'>
                  <div className='text-xs text-gray-600 font-medium mb-2'>
                    {t('invoices.form.identification')}
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      placeholder={t('invoices.form.identificationType')}
                      value={selectedBusinessDetails.identificationType || ''}
                      disabled
                      className='text-xs'
                    />
                    <Input
                      placeholder={t('invoices.form.identificationNumber')}
                      value={selectedBusinessDetails.identificationNumber || ''}
                      disabled
                      className='text-xs'
                    />
                  </div>
                </div>

                {/* Details Table-like layout (matches attached image) */}
                <div className='mt-2 border border-gray-200 rounded-md overflow-hidden text-xs'>
                  {(() => {
                    const rows = [
                      {
                        label: t('invoices.form.name'),
                        value: selectedBusinessDetails.name || '-',
                      },
                      {
                        label: t('invoices.form.companyName'),
                        value: selectedBusinessDetails.companyName || '-',
                      },
                      {
                        label: t('invoices.form.address'),
                        value: selectedBusinessDetails.address || '-',
                      },
                      {
                        label: t('invoices.form.country'),
                        value: selectedBusinessDetails.country || '-',
                      },
                      {
                        label: t('invoices.form.phone'),
                        value: selectedBusinessDetails.phoneNumber || '-',
                      },
                      {
                        label: t('invoices.form.email'),
                        value: selectedBusinessDetails.email || '-',
                      },
                      {
                        label: t('invoices.form.cr'),
                        value: selectedBusinessDetails.cr || '-',
                      },
                      {
                        label: t('invoices.form.vatNo'),
                        value: selectedBusinessDetails.vatGstNumber || '-',
                      },
                    ];

                    if (selectedBusinessDetails.momraLicense) {
                      rows.push({
                        label: t('invoices.form.momraLicense'),
                        value: selectedBusinessDetails.momraLicense,
                      });
                    }

                    if (
                      selectedBusinessDetails.isSaudiVatRegistered !== undefined
                    ) {
                      rows.push({
                        label: t('invoices.form.isSaudiVatRegistered'),
                        value: selectedBusinessDetails.isSaudiVatRegistered
                          ? t('invoices.form.yes')
                          : t('invoices.form.no'),
                      });
                    }

                    return (
                      <div className='divide-y divide-gray-200'>
                        {rows.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-start px-4 py-3 ${
                              i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <div className='w-1/3 text-gray-600 font-medium'>
                              {r.label}:
                            </div>
                            <div className='w-2/3 text-gray-700 whitespace-pre-wrap'>
                              {r.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedBusinessDetails && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder={t('invoices.form.searchBusiness')}
                  value={businessSearch}
                  onChange={(e) => setBusinessSearch(e.target.value)}
                  onFocus={() => setBusinessFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setBusinessFocused(false), 200)
                  }
                />
                <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

                {/* Dropdown list */}
                {businessFocused &&
                  (businessSearch
                    ? filteredBusinessOptions.length > 0
                    : businessOptions.length > 0) && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                      {(businessSearch
                        ? filteredBusinessOptions
                        : businessOptions
                      ).map((b) => {
                        const id = b.id || b._id || '';
                        const primary =
                          b.companyName || b.displayName || b.name || id;
                        const secondary = [b.email || b.phoneNumber]
                          .filter(Boolean)
                          .join(' • ');

                        return (
                          <button
                            key={id}
                            type='button'
                            onClick={() => {
                              formik.setFieldValue('business_detail_id', id);
                              setSelectedBusinessDetails(b);
                              setBusinessSearch('');
                              setBusinessFocused(false);
                            }}
                            className='w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0'
                          >
                            <div className='text-sm font-medium text-gray-800'>
                              {primary}
                            </div>
                            {secondary && (
                              <div className='text-xs text-gray-500'>
                                {secondary}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                {businessFocused &&
                  businessSearch &&
                  filteredBusinessOptions.length === 0 && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
                      {t('invoices.form.noResultsFound')}
                    </div>
                  )}
              </div>
            )}
            {formik.touched.business_detail_id &&
            formik.errors.business_detail_id ? (
              <div className='text-sm text-red-500'>
                {String(formik.errors.business_detail_id)}
              </div>
            ) : null}
          </div>

          {/* BILLED TO */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='mb-3'>
                <h3 className='text-sm font-semibold text-gray-700'>
                  {t('invoices.form.selectedCustomer')}
                </h3>
                <span className='text-xs text-gray-400'>
                  {t('invoices.form.selectCustomer')}
                </span>
              </div>
              <div>
                <button className='text-sm text-blue-600 mb-3'>
                  {t('invoices.form.change')}
                </button>
              </div>
            </div>

            {/* Selected Customer Chip */}
            {selectedCustomer && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    {t('invoices.form.selectCustomer')}:{' '}
                    <span className='text-red-500'>*</span>
                  </span>
                  <div className='flex items-center gap-2 bg-white border rounded px-2 py-1'>
                    <span className='text-sm text-gray-700'>
                      {selectedCustomer.companyName ||
                        selectedCustomer.displayName ||
                        selectedCustomer.name ||
                        selectedCustomer.customerNumber}
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedCustomer(null);
                        formik.setFieldValue('customer_id', '');
                      }}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                {/* Identification section */}
                <div className='mb-3'>
                  <div className='text-xs text-gray-600 font-medium mb-2'>
                    {t('invoices.form.identification')}
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      placeholder={t('invoices.form.identificationType')}
                      className='text-xs bg-gray-100'
                    />
                    <Input
                      placeholder={t('invoices.form.identificationNumber')}
                      className='text-xs bg-gray-100'
                    />
                  </div>
                </div>

                {/* Details Table-like layout (small text) */}
                <div className='mt-2 border border-gray-200 rounded-md overflow-hidden text-xs'>
                  {(() => {
                    const rows = [
                      {
                        label: t('invoices.form.name'),
                        value: selectedCustomer.name || '-',
                      },
                      {
                        label: t('invoices.form.companyName'),
                        value: selectedCustomer.companyName || '-',
                      },
                      {
                        label: t('invoices.form.address'),
                        value: selectedCustomer.address || '-',
                      },
                      {
                        label: t('invoices.form.country'),
                        value: selectedCustomer.country || '-',
                      },
                      {
                        label: t('invoices.form.phone'),
                        value: selectedCustomer.phoneNumber || '-',
                      },
                      {
                        label: t('invoices.form.email'),
                        value: selectedCustomer.email || '-',
                      },
                      {
                        label: t('invoices.form.cr'),
                        value: selectedCustomer.cin || '-',
                      },
                      {
                        label: t('invoices.form.vatNo'),
                        value: selectedCustomer.vatGstNumber || '-',
                      },
                    ];

                    return (
                      <div className='divide-y divide-gray-200'>
                        {rows.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-start px-4 py-3 ${
                              i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <div className='w-1/3 text-gray-600 font-medium'>
                              {r.label}:
                            </div>
                            <div className='w-2/3 text-gray-700 whitespace-pre-wrap'>
                              {r.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedCustomer && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder={t('invoices.form.searchCustomer')}
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onFocus={() => setCustomerFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setCustomerFocused(false), 200)
                  }
                />
                <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

                {/* Dropdown list */}
                {customerFocused &&
                  (customerSearch
                    ? filteredCustomerOptions.length > 0
                    : customerOptions.length > 0) && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                      {(customerSearch
                        ? filteredCustomerOptions
                        : customerOptions
                      ).map((c) => {
                        const id = c.id || c._id || '';
                        const primary =
                          c.companyName ||
                          c.displayName ||
                          c.name ||
                          c.customerNumber ||
                          id;
                        const secondary = [c.email || c.phoneNumber]
                          .filter(Boolean)
                          .join(' • ');

                        return (
                          <button
                            key={id}
                            type='button'
                            onClick={() => {
                              formik.setFieldValue('customer_id', id);
                              setSelectedCustomer(c);
                              setCustomerSearch('');
                              setCustomerFocused(false);
                            }}
                            className='w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0'
                          >
                            <div className='text-sm font-medium text-gray-800'>
                              {primary}
                            </div>
                            {secondary && (
                              <div className='text-xs text-gray-500'>
                                {secondary}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                {customerFocused &&
                  customerSearch &&
                  filteredCustomerOptions.length === 0 && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
                      {t('invoices.form.noResultsFound')}
                    </div>
                  )}
              </div>
            )}
            {formik.touched.customer_id && formik.errors.customer_id ? (
              <div className='text-sm text-red-500'>
                {String(formik.errors.customer_id)}
              </div>
            ) : null}
          </div>

          {/* PAYMENT INFO */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='mb-3'>
                <h3 className='text-sm font-semibold text-gray-700'>
                  {t('invoices.form.selectedPaymentDetails')}
                </h3>
                <span className='text-xs text-gray-400'>
                  {t('invoices.form.selectPaymentDetails')}
                </span>
              </div>
              <div>
                <button className='text-sm text-blue-600 mb-3'>
                  {t('invoices.form.change')}
                </button>
              </div>
            </div>

            {/* Selected Bank Chip */}
            {selectedBank && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    {t('invoices.form.selectPaymentDetails')}:
                  </span>
                  <div className='flex items-center gap-2 bg-white border rounded px-2 py-1'>
                    <span className='text-sm text-gray-700'>
                      {selectedBank.bankName ||
                        selectedBank.accountNumber ||
                        'Bank'}
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedBank(null);
                        formik.setFieldValue('bank_detail_id', '');
                      }}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                {/* Bank Details Table-like layout (small text) */}
                <div className='mt-2 border border-gray-200 rounded-md overflow-hidden text-xs'>
                  {(() => {
                    const rows = [
                      {
                        label: t('invoices.form.bankName'),
                        value: selectedBank.bankName || '-',
                      },
                      {
                        label: t('invoices.form.beneficiaryName'),
                        value: selectedBank.beneficiaryName || '-',
                      },
                      {
                        label: t('invoices.form.accountNumber') || 'Account',
                        value: selectedBank.accountNumber || '-',
                      },
                      {
                        label: t('invoices.form.country'),
                        value: selectedBank.country || '-',
                      },
                      {
                        label: t('invoices.form.swiftCode'),
                        value: selectedBank.swiftCode || '-',
                      },
                      { label: 'IBAN', value: selectedBank.iban || '-' },
                    ];

                    return (
                      <div className='divide-y divide-gray-200'>
                        {rows.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-start px-4 py-3 ${
                              i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <div className='w-1/3 text-gray-600 font-medium'>
                              {r.label}:
                            </div>
                            <div className='w-2/3 text-gray-700 whitespace-pre-wrap'>
                              {r.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedBank && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder={t('invoices.form.searchBank')}
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  onFocus={() => setBankFocused(true)}
                  onBlur={() => setTimeout(() => setBankFocused(false), 200)}
                />
                <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

                {/* Dropdown list */}
                {bankFocused &&
                  (bankSearch
                    ? filteredBankOptions.length > 0
                    : bankOptions.length > 0) && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                      {(bankSearch ? filteredBankOptions : bankOptions).map(
                        (b) => {
                          const id = b.id || b._id || '';
                          const primary = b.bankName || b.accountNumber || id;
                          const secondary = [
                            b.accountNumber && b.accountNumber !== primary
                              ? b.accountNumber
                              : null,
                            b.country,
                          ]
                            .filter(Boolean)
                            .join(' • ');

                          return (
                            <button
                              key={id}
                              type='button'
                              onClick={() => {
                                setSelectedBank(b);
                                formik.setFieldValue('bank_detail_id', id);
                                setBankSearch('');
                                setBankFocused(false);
                              }}
                              className='w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0'
                            >
                              <div className='text-sm font-medium text-gray-800'>
                                {primary}
                              </div>
                              {secondary && (
                                <div className='text-xs text-gray-500'>
                                  {secondary}
                                </div>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                {bankFocused &&
                  bankSearch &&
                  filteredBankOptions.length === 0 && (
                    <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
                      {t('invoices.form.noResultsFound')}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* ITEM DETAILS */}
        <div className='space-y-3'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <h3 className='text-xs font-semibold tracking-wide'>
              ITEM DETAILS
            </h3>

            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-500'>
                Currency: <span className='text-red-500'>*</span>
              </span>
              <div className='w-44 h-9 bg-blue-50 border rounded-md px-3 flex items-center text-xs font-medium'>
                SAR – Saudi Riyal
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className='hidden md:block border rounded-lg overflow-x-auto'>
            <Table className='text-xs'>
              <TableHeader>
                <TableRow className='bg-gray-50'>
                  <TableHead>No.</TableHead>
                  <TableHead>Item / Service</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Rate</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>VAT %</TableHead>
                  <TableHead>Tax Code</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((row, idx) => {
                  const quantity = parseNumber(row.quantity) || 0;
                  const unitRate = parseNumber(row.unitRate) || 0;
                  const discountValue = parseNumber(row.discount) || 0;
                  const vatPercent = parseNumber(row.taxRate) || 0;

                  const price = quantity * unitRate;

                  let discountAmount = 0;
                  let vatAmount = 0;
                  let totalAmount = 0;

                  // Use formulas depending on discount type
                  if (row.discountType === 'PERC') {
                    // i) discount in percentage
                    // VAT Amount = Price × (1 − Discount%/100) × (VAT%/100)
                    // Final Total = Price × (1 − Discount%/100) × (1 + VAT%/100)
                    const taxable = price * (1 - discountValue / 100);
                    discountAmount = price - taxable;
                    vatAmount = taxable * (vatPercent / 100);
                    totalAmount = taxable * (1 + vatPercent / 100);
                  } else {
                    // ii) discount is a fixed number
                    // VAT Amount = (Price − Discount) × (VAT% / 100)
                    // Final Total = (Price − Discount) × (1 + VAT% / 100)
                    const taxable = Math.max(price - discountValue, 0);
                    discountAmount = Math.min(discountValue, price);
                    vatAmount = taxable * (vatPercent / 100);
                    totalAmount = taxable * (1 + vatPercent / 100);
                  }

                  return (
                    <TableRow
                      key={idx}
                      className='align-top'
                    >
                      <TableCell className='font-medium'>{idx + 1}</TableCell>
                      {/* Description */}
                      <TableCell>
                        <div className='space-y-2'>
                          <Input
                            className='bg-blue-50 h-9 text-xs'
                            placeholder='Description'
                            value={row.description}
                            onChange={(e) =>
                              updateItem(idx, 'description', e.target.value)
                            }
                          />
                          <div className='flex gap-2'>
                            <Input
                              className='bg-blue-50 h-9 text-xs'
                              placeholder='Service Code'
                              value={row.serviceCode}
                              onChange={(e) =>
                                updateItem(idx, 'serviceCode', e.target.value)
                              }
                            />
                            <Select
                              value={row.unitOfMeasure}
                              onValueChange={(v) =>
                                updateItem(idx, 'unitOfMeasure', v)
                              }
                            >
                              <SelectTrigger className='bg-blue-50 h-9 text-xs w-24'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unitOfMeasures.map((u) => (
                                  <SelectItem
                                    key={u.value}
                                    value={u.value}
                                  >
                                    {u.displayText}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TableCell>
                      {/* Quantity */}
                      <TableCell>
                        <Input
                          type='number'
                          className='bg-blue-50 h-9 text-xs'
                          value={row.quantity}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              'quantity',
                              parseNumber(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      {/* Rate */}
                      <TableCell>
                        <Input
                          type='number'
                          className='bg-blue-50 h-9 text-xs'
                          value={row.unitRate}
                          onChange={(e) =>
                            updateItem(idx, 'unitRate', e.target.value)
                          }
                        />
                      </TableCell>
                      {/* Discount */}
                      <TableCell>
                        <div className='flex gap-2'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() =>
                              updateItem(
                                idx,
                                'discountType',
                                row.discountType === 'PERC' ? 'NUMBER' : 'PERC'
                              )
                            }
                          >
                            {row.discountType === 'PERC'
                              ? 'PERC %'
                              : 'Number #'}
                          </Button>
                          <Input
                            type='number'
                            className='bg-blue-50 h-9 text-xs w-20'
                            value={row.discount}
                            onChange={(e) =>
                              updateItem(idx, 'discount', e.target.value)
                            }
                          />
                        </div>
                      </TableCell>
                      {/* VAT */}
                      <TableCell>
                        <Input
                          type='number'
                          className='bg-blue-50 h-9 text-xs'
                          value={row.taxRate}
                          onChange={(e) =>
                            updateItem(idx, 'taxRate', Number(e.target.value))
                          }
                        />
                      </TableCell>
                      {/* Tax Code */}
                      <TableCell>
                        <Select
                          value={row.taxCode}
                          onValueChange={(v) => updateItem(idx, 'taxCode', v)}
                        >
                          <SelectTrigger className='bg-blue-50 h-9 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taxCodes.map((tc) => (
                              <SelectItem
                                key={tc.value}
                                value={tc.value}
                              >
                                {tc.displayText}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* Total */}
                      <TableCell>
                        <div className='font-semibold text-sm'>
                          {formatNumber(totalAmount)}
                        </div>
                        <div className='text-[11px] text-gray-500'>
                          VAT: {formatNumber(vatAmount)}
                        </div>
                      </TableCell>
                      {/* Remove */}
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => removeItem(idx)}
                        >
                          <X className='h-4 w-4 text-red-500' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className='md:hidden space-y-3'>
            {items.map((row, idx) => (
              <div
                key={idx}
                className='border rounded-lg p-3 space-y-2 bg-white'
              >
                <div className='flex justify-between text-xs font-semibold'>
                  <span>Item #{idx + 1}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeItem(idx)}
                  >
                    <X className='h-4 w-4 text-red-500' />
                  </Button>
                </div>

                <Input
                  className='bg-blue-50 h-9 text-xs'
                  placeholder='Description'
                  value={row.description}
                  onChange={(e) =>
                    updateItem(idx, 'description', e.target.value)
                  }
                />

                <div className='grid grid-cols-2 gap-2'>
                  <Input
                    type='number'
                    className='bg-blue-50 h-9 text-xs'
                    placeholder='Qty'
                    value={row.quantity}
                    onChange={(e) =>
                      updateItem(idx, 'quantity', parseNumber(e.target.value))
                    }
                  />
                  <Input
                    type='number'
                    className='bg-blue-50 h-9 text-xs'
                    placeholder='Rate'
                    value={row.unitRate}
                    onChange={(e) =>
                      updateItem(idx, 'unitRate', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <Button
            variant='outline'
            size='sm'
            onClick={addItem}
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Item
          </Button>
        </div>
      </form>
    </div>
  );
}
