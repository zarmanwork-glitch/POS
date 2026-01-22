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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { validationSchema } from '@/schema/bankDetailsValidation';
import countries from '@/json/countries.json';
import { Spinner } from '@/components/ui/spinner';

export default function AddBankDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const [isLoadingDetails, setIsLoadingDetails] = useState(!!id);

  const formik = useFormik({
    initialValues: {
      country: '',
      accountNumber: '',
      iban: '',
      bankName: '',
      swiftCode: '',
      beneficiaryName: '',
    },
    validationSchema,
    onSubmit: handleAddBankDetails,
  });

  // Fetch bank details by id
  useEffect(() => {
    if (id) {
      const fetchBankDetails = async () => {
        try {
          setIsLoadingDetails(true);
          const token = Cookies.get('authToken');
          if (!token) {
            console.error('No token found');
            return;
          }

          const response = await getBankDetailsById({
            token,
            bankDetailsId: id,
          });

          if (response?.data.data?.results.bankDetails) {
            if (response?.data.data?.results?.bankDetails) {
              const data = response.data.data.results.bankDetails;

              formik.setValues({
                country: data.country || '',
                accountNumber: data.accountNumber || '',
                iban: data.iban || '',
                bankName: data.bankName || '',
                swiftCode: data.swiftCode || '',
                beneficiaryName: data.beneficiaryName || '',
              });
            }
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
  }, [id]);

  async function handleAddBankDetails(values: typeof formik.values) {
    try {
      setIsLoading(true);
      const token = Cookies.get('authToken');

      if (!token) {
        console.error('No token found');
        return;
      }

      const payload = values;

      // If id exists, update otherwise create new
      if (id) {
        payload.id = id;
        await updateBankDetails({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/profile/bank-details/bank-details-list');
          },
        });
      } else {
        await addBankDetails({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/profile/bank-details/bank-details-list');
          },
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(id ? 'Error updating item' : 'Error creating item');
    } finally {
      setIsLoading(false);
    }
  }

  const hasError = (field: keyof typeof formik.errors) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getErrorMessage = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';
  const handleCancel = () => {
    router.push('/profile/bank-details/bank-details-list');
  };
  // Loading spinner component
  if (isLoadingDetails) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='space-y-4 text-center'>
          <Spinner className='h-12 w-12 text-blue-600 mx-auto' />
          <p className='text-gray-600 font-medium'>
            {t('profile.loading', { defaultValue: 'Loading...' })}
          </p>
        </div>
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
            <span className='text-blue-600'>{t('profile.title')}</span>
            <span className='text-gray-800'>
              |{' '}
              {id
                ? t('profile.editBankDetails', {
                    defaultValue: 'Edit Bank Details',
                  })
                : t('profile.addBankDetails')}
            </span>
          </h2>
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              disabled={formik.isSubmitting}
            >
              {t('profile.cancel')}
            </Button>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <Spinner className='mr-2 h-4 w-4 text-white' />
                  {id
                    ? t('profile.updating', { defaultValue: 'Updating...' })
                    : t('profile.saving', { defaultValue: 'Saving...' })}
                </>
              ) : id ? (
                t('profile.update', { defaultValue: 'Update' })
              ) : (
                t('profile.bankDetails.add')
              )}
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Country */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.bankDetails.country')}:{' '}
              <span className='text-red-500'>*</span>
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
                  <SelectValue
                    placeholder={t('profile.bankDetails.selectCountry')}
                  />
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
              {t('profile.bankDetails.accountNumber')}:{' '}
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='accountNumber'
              placeholder={t('profile.bankDetails.specifyAccountNumber')}
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
              {t('profile.bankDetails.iban')}:{' '}
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='iban'
              placeholder={t('profile.bankDetails.ibanPlaceholder')}
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
              {t('profile.bankDetails.swiftCode')}:{' '}
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='swiftCode'
              placeholder={t('profile.bankDetails.specifyBankCode')}
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
