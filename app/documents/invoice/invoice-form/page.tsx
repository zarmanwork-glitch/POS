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
import { X, Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { incoTerms } from '@/enums/incoTerms';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { currencies } from '@/enums/currency';
import { discountTypes } from '@/enums/discountType';
import { taxCodes } from '@/enums/taxCode';
import { billingArrangements } from '@/enums/billingArrangement';
import { transactionTypes } from '@/enums/transactionType';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createInvoice } from '@/api/invoices/invoice.api';
import { formatNumber, parseNumber } from '@/lib/number';

export default function InvoiceFormPage() {
  const router = useRouter();

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

      await createInvoice({
        token: null as any,
        payload,
        successCallbackFunction: () => router.push('/documents/invoice'),
      });
    },
  });

  const [billedBy, setBilledBy] = useState<any>({
    businessDetails: '',
    identificationType: '',
    identificationNumber: '',
  });

  const [billedTo, setBilledTo] = useState<any>({ customer: '', search: '' });

  const [paymentInfo, setPaymentInfo] = useState<any>({ paymentProfile: '' });

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
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
            >
              Save
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
            <label className='block text-sm text-gray-700 mb-1'>
              Special Billing Arrangement:
            </label>
            <Select
              value={formik.values.specialBillingArrangement}
              onValueChange={(v) =>
                formik.setFieldValue('specialBillingArrangement', v)
              }
            >
              <SelectTrigger className='bg-blue-50 h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {billingArrangements.map((arrangement) => (
                  <SelectItem
                    key={arrangement.value}
                    value={arrangement.value}
                  >
                    {arrangement.displayText}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <label className='block text-sm text-gray-700 mb-1'>
              Special Transaction Type:
            </label>
            <Select
              value={formik.values.specialTransactionType}
              onValueChange={(v) =>
                formik.setFieldValue('specialTransactionType', v)
              }
            >
              <SelectTrigger className='bg-blue-50 h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                  >
                    {type.displayText}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className='block text-sm text-gray-700 mt-4 mb-1'>
              Payment Means:
            </label>
            <Input
              className='bg-blue-50 h-10'
              placeholder='Search by code'
              name='paymentMeans'
              value={formik.values.paymentMeans}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold'>BILLED BY</h3>
              <button className='text-sm text-blue-600'>Add</button>
            </div>
            <div className=' p-3'>
              <label className='text-xs text-gray-600'>
                Business Details *
              </label>
              <Input
                className='bg-blue-50 h-10 mt-2'
                placeholder='Business details (id)'
                name='business_detail_id'
                value={formik.values.business_detail_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.business_detail_id &&
              formik.errors.business_detail_id ? (
                <div className='text-sm text-red-500'>
                  {String(formik.errors.business_detail_id)}
                </div>
              ) : null}
              <div className='text-xs text-gray-500 mt-2'>Identification</div>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold'>BILLED TO</h3>
              <button className='text-sm text-blue-600'>Add</button>
            </div>
            <div className='p-3'>
              <label className='text-xs text-gray-600'>
                Choose Customer: *
              </label>
              <Input
                className='bg-blue-50 h-10 mt-2'
                placeholder='Customer id or search'
                name='customer_id'
                value={formik.values.customer_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.customer_id && formik.errors.customer_id ? (
                <div className='text-sm text-red-500'>
                  {String(formik.errors.customer_id)}
                </div>
              ) : null}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold'>PAYMENT INFO</h3>
              <button className='text-sm text-blue-600'>Add</button>
            </div>
            <div className='p-3'>
              <label className='text-xs text-gray-600'>Payment Profile</label>
              <Input
                className='bg-blue-50 h-10 mt-2'
                placeholder='Search by: Bank | Account No. | Country'
                value={paymentInfo.paymentProfile}
                onChange={(e) =>
                  setPaymentInfo((p: any) => ({
                    ...p,
                    paymentProfile: e.target.value,
                  }))
                }
              />
            </div>
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
