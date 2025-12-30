'use client';

import {
  addBankDetails,
  getBankDetailsById,
  updateBankDetails,
} from '@/api/bank-details/bank-details.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { validationSchema } from '@/schema/bankDetailsValidation';
import countries from '@/json/countries.json';

export default function AddBankDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = !!id;
  const token = Cookies.get('authToken');

  const initialValues = {
    country: '',
    accountNumber: '',
    iban: '',
    bankName: '',
    swiftCode: '',
    beneficiaryName: '',
  };

  const [bankDetailsData, setBankDetailsData] = useState(initialValues);
  const [isLoadingDetails, setIsLoadingDetails] = useState(isEditMode);

  const formik = useFormik({
    initialValues: bankDetailsData,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  // Fetch bank details in edit mode
  useEffect(() => {
    if (id && token) {
      const fetchBankDetails = async () => {
        try {
          const response = await getBankDetailsById({
            token,
            bankDetailsId: id,
          });
          if (response?.data) {
            const details = response.data;
            setBankDetailsData({
              country: details.country || 'Saudi Arabia',
              accountNumber: details.accountNumber || '',
              iban: details.iban || '',
              bankName: details.bankName || '',
              swiftCode: details.swiftCode || '',
              beneficiaryName: details.beneficiaryName || '',
            });
          }
        } catch (error) {
          console.error('Error fetching bank details:', error);
          toast.error('Failed to load bank details');
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchBankDetails();
    } else {
      setIsLoadingDetails(false);
    }
  }, [id, token]);

  async function handleSubmit(values: typeof bankDetailsData) {
    const payload = isEditMode ? { id: id || '', ...values } : values;
    const apiCall = isEditMode ? updateBankDetails : addBankDetails;

    try {
      const response = await apiCall({
        token,
        payload,
        ...(isEditMode && { bankDetailsId: id }),
        successCallbackFunction: () => {
          toast.success(
            isEditMode ? 'Bank details updated' : 'Bank details added'
          );
          router.push('/profile/bank-details/bank-details-list');
        },
      });
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details');
    }
  }

  const handleCancel = () => {
    router.push('/profile/bank-details/bank-details-list');
  };

  if (isLoadingDetails) {
    return (
      <div className='flex justify-center items-center py-12'>
        <p className='text-gray-600'>Loading bank details...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>Profile</span>
            <span className='text-gray-800'>
              | {isEditMode ? 'Edit Bank Details' : 'Add Bank Details'}
            </span>
          </h2>
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Country */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Country : <span className='text-red-500'>*</span>
            </label>
            {formik.values.country ? (
              <div className='flex items-center gap-2 bg-blue-50 border border-gray-300 rounded-md p-2 h-10'>
                <span className='text-sm text-gray-700 flex-1'>
                  {formik.values.country}
                </span>
                <button
                  type='button'
                  onClick={() => formik.setFieldValue('country', '')}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <Select
                value={formik.values.country}
                onValueChange={(value) =>
                  formik.setFieldValue('country', value)
                }
              >
                <SelectTrigger className='bg-blue-50 h-10 py-2'>
                  <SelectValue placeholder='Select Country' />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country}
                      value={country}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {formik.touched.country && formik.errors.country && (
              <p className='text-red-500 text-xs mt-1'>
                {formik.errors.country}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Account Number :<span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='accountNumber'
              placeholder='Specify AccountNumber'
              className='bg-blue-50 h-10 py-2'
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.accountNumber && formik.errors.accountNumber && (
              <p className='text-red-500 text-xs mt-1'>
                {formik.errors.accountNumber}
              </p>
            )}
          </div>

          {/* IBAN */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              IBAN : <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='iban'
              placeholder='GB00 ABCD 0000 0000 0000 00'
              className='bg-blue-50 h-10 py-2'
              value={formik.values.iban}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.iban && formik.errors.iban && (
              <p className='text-red-500 text-xs mt-1'>{formik.errors.iban}</p>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Bank Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Bank Name: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='bankName'
              placeholder='BankName Placeholder'
              className='bg-blue-50 h-10 py-2'
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bankName && formik.errors.bankName && (
              <p className='text-red-500 text-xs mt-1'>
                {formik.errors.bankName}
              </p>
            )}
          </div>

          {/* SWIFT Code */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Swift Code: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='swiftCode'
              placeholder='Specify BankCode'
              className='bg-blue-50 h-10 py-2'
              value={formik.values.swiftCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.swiftCode && formik.errors.swiftCode && (
              <p className='text-red-500 text-xs mt-1'>
                {formik.errors.swiftCode}
              </p>
            )}
          </div>

          {/* Beneficiary Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Beneficiary Name:
            </label>
            <Input
              type='text'
              name='beneficiaryName'
              placeholder='Arthur Dent'
              className='bg-blue-50 h-10 py-2'
              value={formik.values.beneficiaryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.beneficiaryName &&
              formik.errors.beneficiaryName && (
                <p className='text-red-500 text-xs mt-1'>
                  {formik.errors.beneficiaryName}
                </p>
              )}
          </div>
        </div>
      </form>
    </div>
  );
}
