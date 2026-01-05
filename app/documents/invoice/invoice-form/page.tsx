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
import { X, Plus, Upload, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { Card } from '@/components/ui/card';
import { incoTerms } from '@/enums/incoTerms';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { currencies } from '@/enums/currency';
import { discountTypes } from '@/enums/discountType';
import { taxCodes } from '@/enums/taxCode';
import { billingArrangements } from '@/enums/billingArrangement';
import { transactionTypes } from '@/enums/transactionType';
import { getBusinessDetailsForSelection } from '@/api/business-details/business-details.api';
import { getCustomersForSelection } from '@/api/customers/customer.api';
import { getBankDetailsForSelection } from '@/api/bank-details/bank-details.api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createInvoice } from '@/api/invoices/invoice.api';
import { formatNumber, parseNumber } from '@/lib/number';
import { useEffect } from 'react';

export default function InvoiceFormPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      supplyDate: '',
      supplyEndDate: '',
      incoterms: 'NA',
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
      customer_id: '',
      currency: 'SAR',
    },
    validationSchema: Yup.object({
      invoiceDate: Yup.date().required('Invoice date is required'),
      dueDate: Yup.date().required('Due date is required'),
      paymentMeans: Yup.string().required('Payment means is required'),
      business_detail_id: Yup.string().required('Business details required'),
      customer_id: Yup.string().required('Customer required'),
      currency: Yup.string().required('Currency required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');

        if (!token) {
          console.error('No token found');
          return;
        }

        const payload: any = {
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
          customer_id: values.customer_id,
          currency: values.currency,
          items,
          notes: '',
        };

        // Map frontend field names to backend expected keys (camelCase)
        const apiPayload: any = {
          invoiceNumber: payload.invoiceNumber,
          incoterms: payload.incoterms,
          location: payload.location,
          invoiceDate: payload.invoiceDate,
          dueDate: payload.dueDate,
          supplyDate: payload.supplyDate,
          supplyEndDate: payload.supplyEndDate,
          contractId: payload.contractId,
          customerPoNumber: payload.customerPoNumber,
          paymentTerms: payload.paymentTerms,
          // backend expects numeric paymentMeans values
          paymentMeans:
            payload.paymentMeans !== undefined && payload.paymentMeans !== null
              ? Number(payload.paymentMeans)
              : undefined,
          specialTaxTreatment: payload.specialTaxTreatment,
          prePaymentInvoice: payload.prePaymentInvoice,
          // convert snake_case ids to camelCase expected by backend
          businessDetailId: payload.business_detail_id || undefined,
          customerId: payload.customer_id || undefined,
          // bankDetailId may come from payment info; include if present
          bankDetailId:
            (paymentInfo && (paymentInfo as any).bankDetailId) || undefined,
          currency: payload.currency,
          items: payload.items,
          notes: payload.notes,
        };

        // If a logo file is attached, send as FormData so backend can accept the file
        let payloadToSend: any = apiPayload;
        if (logo) {
          const form = new FormData();
          // append simple fields (use camelCase keys)
          Object.keys(apiPayload).forEach((k) => {
            const val = (apiPayload as any)[k];
            if (val === undefined || val === null) return;
            // For items (array) send as a JSON blob part so backend can parse as array
            if (k === 'items') {
              form.append(
                k,
                new Blob([JSON.stringify(val)], { type: 'application/json' })
              );
              return;
            }
            // for other arrays/objects, stringify
            if (typeof val === 'object') form.append(k, JSON.stringify(val));
            else form.append(k, String(val));
          });
          form.append('logo', logo as Blob);
          payloadToSend = form;
        }

        // Use same pattern as other forms: pass token and successCallbackFunction
        await createInvoice({
          token: token as any,
          payload: payloadToSend,
          successCallbackFunction: () => router.push('/documents/invoice'),
        });
      } catch (error) {
        console.error('Error creating invoice:', error);
        toast.error('Error creating invoice');
      } finally {
        setIsLoading(false);
      }
    },
  });

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

  const [reportingTagInput, setReportingTagInput] = useState('');
  const [reportingTags, setReportingTags] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [businessSearch, setBusinessSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');

  const [businessFocused, setBusinessFocused] = useState(false);
  const [customerFocused, setCustomerFocused] = useState(false);
  const [bankFocused, setBankFocused] = useState(false);

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

        // Support multiple possible response shapes from the selection endpoints
        const biz =
          bResp?.data?.data?.results?.businessDetails ||
          bResp?.data?.data?.results ||
          bResp?.data?.data ||
          bResp?.data ||
          [];

        const cus =
          cResp?.data?.data?.results?.customers ||
          cResp?.data?.results?.customers ||
          cResp?.data?.data?.results ||
          cResp?.data?.data ||
          cResp?.data ||
          [];

        const bk =
          bkResp?.data?.data?.results?.bankDetails ||
          bkResp?.data?.results?.bankDetails ||
          bkResp?.data?.data?.results ||
          bkResp?.data?.data ||
          bkResp?.data ||
          [];

        setBusinessOptions(biz);
        setCustomerOptions(cus);
        setBankOptions(bk);
      } catch (error) {
        console.error('Error fetching dropdown lists:', error);
        toast.error('Failed to load dropdown data');
      } finally {
        setListsLoading(false);
      }
    };

    fetchLists();
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
    <div className='space-y-6'>
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>Documents</span>
            <span className='text-gray-800'> | Create Invoice</span>
          </h2>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              className='bg-blue-600 hover:bg-blue-700'
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? <Spinner className='h-4 w-4 text-white' /> : 'Save'}
            </Button>
          </div>
        </div>

        {/* Top grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm text-gray-700 mb-1'>
              Invoice Number (Optional):
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='INV-123456'
              name='invoiceNumber'
              value={formik.values.invoiceNumber}
              onChange={formik.handleChange}
            />
            <div className='text-xs text-gray-400 mt-1'>
              Auto-generated if left blank
            </div>

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Invoice Date:
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
              <div className='text-xs text-gray-400 mt-1'>Choose Date</div>
            )}

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Supply Date:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='supplyDate'
              value={formik.values.supplyDate}
              onChange={formik.handleChange}
            />
            {!formik.values.supplyDate && (
              <div className='text-xs text-gray-400 mt-1'>Choose Date</div>
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-700 mb-1'>
              IncoTerms:
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
                placeholder='Location'
                name='location'
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </div>

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Due date:
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
              <div className='text-xs text-gray-400 mt-1'>Choose Date</div>
            )}

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Supply End Date:
            </label>
            <Input
              className='bg-blue-50 h-10'
              type='date'
              name='supplyEndDate'
              value={formik.values.supplyEndDate}
              onChange={formik.handleChange}
            />
            {!formik.values.supplyEndDate && (
              <div className='text-xs text-gray-400 mt-1'>Choose Date</div>
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
                      alt='Logo preview'
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
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold text-gray-300'>LOGO</div>
                    <Upload className='h-6 w-6 text-gray-400' />
                    <p className='text-center text-gray-400 text-sm'>
                      Drag and drop an image or click here to select one
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
              Contract ID:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='Contract ID'
              name='contractId'
              value={formik.values.contractId}
              onChange={formik.handleChange}
            />

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Customer PO / Order Number:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='PO / Order Number'
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
              Special Tax Treatment:
            </label>
            <textarea
              className='w-full bg-blue-50 border rounded-md p-2 h-24'
              placeholder='Narration regarding special tax treatment'
              name='specialTaxTreatment'
              value={formik.values.specialTaxTreatment}
              onChange={formik.handleChange}
            />

            <div className='flex items-center gap-3 mt-3'>
              <label className='text-sm text-gray-700'>
                Pre-payment invoice:
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
              {formik.values.prePaymentInvoice ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Middle section - billed by / billed to / payment info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4'>
          {/* BILLED BY */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-gray-700'>BILLED BY</h3>
              <span className='text-xs text-gray-400'>VENDOR INFO</span>
            </div>
            <div>
              <button className='text-sm text-blue-600 mb-3'>Add</button>
            </div>

            {/* Selected Business Details Chip */}
            {selectedBusinessDetails && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    Business Details: <span className='text-red-500'>*</span>
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
                    Identification
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      placeholder='Identification Type'
                      value={selectedBusinessDetails.identificationType || ''}
                      disabled
                      className='text-xs'
                    />
                    <Input
                      placeholder='ID Number'
                      value={selectedBusinessDetails.identificationNumber || ''}
                      disabled
                      className='text-xs'
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-x-3 gap-y-2 text-xs'>
                  <div>
                    <span className='text-gray-600 font-medium'>Name:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Company Name:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.companyName || '-'}
                    </p>
                  </div>
                  <div className='col-span-2'>
                    <span className='text-gray-600 font-medium'>Address:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.address || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>Country:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.country || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>Phone:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.phoneNumber || '-'}
                    </p>
                  </div>
                  <div className='col-span-2'>
                    <span className='text-gray-600 font-medium'>Email:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.email || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>CR:</span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.cr || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      VAT/GST No:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBusinessDetails.vatGstNumber || '-'}
                    </p>
                  </div>
                  {selectedBusinessDetails.momraLicense && (
                    <>
                      <div className='col-span-2'>
                        <span className='text-gray-600 font-medium'>
                          Momra license:
                        </span>
                        <p className='text-gray-700'>
                          {selectedBusinessDetails.momraLicense}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedBusinessDetails.isSaudiVatRegistered !==
                    undefined && (
                    <div>
                      <span className='text-gray-600 font-medium'>
                        Is Saudi VAT registered:
                      </span>
                      <p className='text-gray-700'>
                        {selectedBusinessDetails.isSaudiVatRegistered
                          ? 'Yes'
                          : 'No'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedBusinessDetails && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder='Search by: Name | Company | Email | Phone'
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
                      No results found
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
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-gray-700'>BILLED TO</h3>
              <span className='text-xs text-gray-400'>CUSTOMER INFO</span>
            </div>
            <div>
              <button className='text-sm text-blue-600 mb-3'>Add</button>
            </div>

            {/* Selected Customer Chip */}
            {selectedCustomer && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    Choose Customer: <span className='text-red-500'>*</span>
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
                    Identification
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      placeholder='Identification Type'
                      className='text-xs bg-gray-100'
                    />
                    <Input
                      placeholder='Identification Number'
                      className='text-xs bg-gray-100'
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-x-3 gap-y-2 text-xs'>
                  <div>
                    <span className='text-gray-600 font-medium'>Name:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Company Name:
                    </span>
                    <p className='text-gray-700'>
                      {selectedCustomer.companyName || '-'}
                    </p>
                  </div>
                  <div className='col-span-2'>
                    <span className='text-gray-600 font-medium'>Address:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.address || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>Country:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.country || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>Phone:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.phoneNumber || '-'}
                    </p>
                  </div>
                  <div className='col-span-2'>
                    <span className='text-gray-600 font-medium'>Email:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.email || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>CIN:</span>
                    <p className='text-gray-700'>
                      {selectedCustomer.cin || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      VAT/GST No:
                    </span>
                    <p className='text-gray-700'>
                      {selectedCustomer.vatGstNumber || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedCustomer && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder='Search by: Name | Company | Email | Phone'
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
                      No results found
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
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-gray-700'>
                PAYMENT INFO
              </h3>
              <span className='text-xs text-gray-400'>BANK DETAILS</span>
            </div>
            <div>
              <button className='text-sm text-blue-600 mb-3'>Add</button>
            </div>

            {/* Payment Profile Input */}
            <Input
              className='bg-blue-50 h-10 mb-3'
              placeholder='Search by: Bank | Account No. | Country'
            />

            {/* Selected Bank Chip */}
            {selectedBank && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-sm text-gray-700 font-medium'>
                    Payment Profile:
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

                {/* Bank Details Grid */}
                <div className='grid grid-cols-2 gap-x-3 gap-y-2 text-xs'>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Bank Name:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBank.bankName || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Bank Country:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBank.country || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Beneficiary Name:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBank.beneficiaryName || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      Account Number:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBank.accountNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>
                      SWIFT Code:
                    </span>
                    <p className='text-gray-700'>
                      {selectedBank.swiftCode || '-'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600 font-medium'>IBAN:</span>
                    <p className='text-gray-700'>{selectedBank.iban || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Select Dropdown if not selected */}
            {!selectedBank && (
              <div className='relative'>
                <Input
                  className='bg-blue-50 h-10 pr-10'
                  placeholder='Search by: Bank | Account No. | Country'
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
                      No results found
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Items table */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold'>ITEM DETAILS</h3>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Currency:</span>
              <Select
                value={formik.values.currency}
                onValueChange={(v) => formik.setFieldValue('currency', v)}
              >
                <SelectTrigger className='w-40 bg-blue-50 h-10'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.value}
                      value={currency.value}
                    >
                      {currency.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='overflow-x-auto border rounded-lg'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-4 py-3 text-left font-semibold'>No.</th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Item / Service Description
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Quantity
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Unit Rate
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Discount
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Tax Rate
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>
                    Tax Code
                  </th>
                  <th className='px-4 py-3 text-left font-semibold'>Total</th>
                  <th className='px-4 py-3 text-left' />
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr
                    key={idx}
                    className='border-b hover:bg-gray-50'
                  >
                    <td className='px-4 py-4 align-top font-medium'>
                      {idx + 1}
                    </td>
                    <td className='px-4 py-4'>
                      <div className='space-y-3'>
                        <Input
                          className='bg-blue-50 h-10'
                          placeholder='Description'
                          value={row.description}
                          onChange={(e) =>
                            updateItem(idx, 'description', e.target.value)
                          }
                        />
                        <div className='flex gap-2'>
                          <Input
                            className='bg-blue-50 h-10 flex-1'
                            placeholder='Service Code'
                            value={row.serviceCode}
                            onChange={(e) =>
                              updateItem(idx, 'serviceCode', e.target.value)
                            }
                          />
                          <select
                            className='bg-blue-50 h-10 rounded-md border border-input px-3'
                            value={row.unitOfMeasure}
                            onChange={(e) =>
                              updateItem(idx, 'unitOfMeasure', e.target.value)
                            }
                          >
                            {unitOfMeasures.map((u) => (
                              <option
                                key={u.value}
                                value={u.value}
                              >
                                {u.displayText}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4'>
                      <Input
                        type='number'
                        className='bg-blue-50 h-10'
                        value={row.quantity}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            'quantity',
                            parseNumber(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className='px-4 py-4'>
                      <Input
                        className='bg-blue-50 h-10'
                        type='number'
                        placeholder='0.00'
                        value={row.unitRate}
                        onChange={(e) =>
                          updateItem(idx, 'unitRate', e.target.value)
                        }
                      />
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() =>
                            updateItem(
                              idx,
                              'discountType',
                              row.discountType === 'PERC' ? 'AMT' : 'PERC'
                            )
                          }
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                            row.discountType === 'PERC'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              row.discountType === 'PERC'
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className='text-xs font-medium text-gray-700 min-w-12'>
                          {row.discountType === 'PERC' ? 'PERC %' : 'AMT'}
                        </span>
                        <Input
                          className='bg-blue-50 h-10 flex-1'
                          type='number'
                          placeholder='0'
                          value={row.discount}
                          onChange={(e) =>
                            updateItem(idx, 'discount', e.target.value)
                          }
                        />
                      </div>
                    </td>
                    <td className='px-4 py-4'>
                      <Input
                        className='bg-blue-50 h-10'
                        type='number'
                        placeholder='0'
                        value={row.taxRate}
                        onChange={(e) =>
                          updateItem(idx, 'taxRate', Number(e.target.value))
                        }
                      />
                    </td>
                    <td className='px-4 py-4'>
                      <select
                        className='bg-blue-50 h-10 rounded-md border border-input w-full px-3'
                        value={row.taxCode}
                        onChange={(e) =>
                          updateItem(idx, 'taxCode', e.target.value)
                        }
                      >
                        {taxCodes.map((tc) => (
                          <option
                            key={tc.value}
                            value={tc.value}
                          >
                            {tc.displayText}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='px-4 py-4'>
                      <div className='space-y-2'>
                        <div className='h-10 flex items-center font-medium'>
                          {(() => {
                            const q = parseNumber(row.quantity) || 0;
                            const r = parseNumber(row.unitRate) || 0;
                            const d = parseNumber(row.discount) || 0;
                            const tax = parseNumber(row.taxRate) || 0;
                            const sub = q * r - d;
                            const total = sub + (sub * tax) / 100;
                            return formatNumber(total);
                          })()}
                        </div>
                        <div className='text-xs text-gray-600'>
                          VAT:{' '}
                          {(() => {
                            const q = parseNumber(row.quantity) || 0;
                            const r = parseNumber(row.unitRate) || 0;
                            const d = parseNumber(row.discount) || 0;
                            const tax = parseNumber(row.taxRate) || 0;
                            const sub = q * r - d;
                            const vatAmount = (sub * tax) / 100;
                            return formatNumber(vatAmount);
                          })()}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4'>
                      <button
                        type='button'
                        onClick={() => removeItem(idx)}
                        className='text-red-500 hover:text-red-700 h-10 flex items-center'
                      >
                        <X className='h-5 w-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex items-center justify-between mt-3'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={addItem}
              >
                <Plus className='h-4 w-4 mr-2' /> Add Item
              </Button>
              <Button
                variant='outline'
                onClick={addItem}
              >
                <Plus className='h-4 w-4 mr-2' /> Add Advance Payment Item
              </Button>
            </div>
            <div className='text-sm text-gray-600'>
              Currency: <strong>{formik.values.currency}</strong>
            </div>
          </div>
        </div>

        {/* Reporting tags */}
        <div>
          <label className='block text-sm text-gray-700 mb-2'>
            Reporting Tags
          </label>
          <div className='flex gap-2 items-center'>
            <Input
              className='bg-blue-50 h-10'
              placeholder='Type tag and press Enter'
              value={reportingTagInput}
              onChange={(e) => setReportingTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && reportingTagInput.trim()) {
                  e.preventDefault();
                  setReportingTags((t) => [...t, reportingTagInput.trim()]);
                  setReportingTagInput('');
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {reportingTags.map((t, i) => (
                <div
                  key={i}
                  className='px-2 py-1 bg-gray-100 rounded-full flex items-center gap-2'
                >
                  <span className='text-sm'>{t}</span>
                  <button
                    type='button'
                    onClick={() =>
                      setReportingTags((s) => s.filter((_, idx) => idx !== i))
                    }
                    className='text-gray-500'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
