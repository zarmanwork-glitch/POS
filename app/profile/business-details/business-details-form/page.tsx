'use client';

import {
  addBusinessDetails,
  getBusinessDetailsById,
  updateBusinessDetails,
} from '@/api/business-details/business-details.api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import countries from '@/json/countries.json';
import { validationSchema } from '@/schema/businessDetailsFormValidation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import { identificationTypes } from '@/enums/businessDetailsFormIdentification';

interface BusinessDetailsFormValues {
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  companyNameLocal: string;
  isVatRegistered: string;
  country: string;
  addressStreet: string;
  addressStreetAdditional: string;
  buildingNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  additionalNumber: string;
  addressLocal: string;
  companyRegistrationNumber: string;
  vatNumber: string;
  groupVatNumber: string;
  identificationType: string;
  identificationNumber: string;
  refundPolicy: string;
  refundPolicyLocal: string;
}

function BusinessDetailsFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(!!id);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(true);

  const formik = useFormik<BusinessDetailsFormValues>({
    initialValues: {
      name: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      companyNameLocal: '',
      isVatRegistered: 'yes',
      country: '',
      addressStreet: '',
      addressStreetAdditional: '',
      buildingNumber: '',
      province: '',
      city: '',
      district: '',
      postalCode: '',
      additionalNumber: '',
      addressLocal: '',
      companyRegistrationNumber: '',
      vatNumber: '',
      groupVatNumber: '',
      identificationType: '',
      identificationNumber: '',
      refundPolicy: '',
      refundPolicyLocal: '',
    },
    validationSchema,
    onSubmit: handleAddBusinessDetails,
  });

  // Fetch business details data using id
  useEffect(() => {
    if (id) {
      const fetchBusinessDetails = async () => {
        try {
          setIsLoadingDetails(true);
          const token = Cookies.get('authToken');
          if (!token) {
            console.error('No token found');
            return;
          }

          const response = await getBusinessDetailsById({
            token,
            businessDetailsId: id,
          });

          if (response?.data?.data?.results?.businessDetails) {
            const data = response.data.data.results.businessDetails;

            // Populate form with fetched data
            formik.setValues({
              name: data.name || '',
              companyName: data.companyName || '',
              email: data.email || '',
              phoneNumber: data.phoneNumber || '',
              companyNameLocal: data.companyNameLocal || '',
              isVatRegistered: data.isVatRegistered ? 'yes' : 'no',
              country: data.country || '',
              addressStreet: data.addressStreet || '',
              addressStreetAdditional: data.addressStreetAdditional || '',
              buildingNumber: data.buildingNumber || '',
              province: data.province || '',
              city: data.city || '',
              district: data.district || '',
              postalCode: data.postalCode || '',
              additionalNumber: data.additionalNumber || '',
              addressLocal: data.addressLocal || '',
              companyRegistrationNumber: data.companyRegistrationNumber || '',
              vatNumber: data.vatNumber || '',
              groupVatNumber: data.groupVatNumber || '',
              identificationType: data.identificationType || '',
              identificationNumber: data.identificationNumber || '',
              refundPolicy: data.refundPolicy || '',
              refundPolicyLocal: data.refundPolicyLocal || '',
            });

            // Set existing logo URL if available
            if (data.logoUrl) {
              setExistingLogoUrl(data.logoUrl);
              setLogoPreview(data.logoUrl);
            }

            // Set refund policy fields if available
            if (data.refundPolicy) {
              formik.setFieldValue('refundPolicy', data.refundPolicy);
            }
            if (data.refundPolicyLocal) {
              formik.setFieldValue('refundPolicyLocal', data.refundPolicyLocal);
            }
          }
        } catch (error) {
          console.error('Error fetching business details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      };

      fetchBusinessDetails();
    }
  }, [id]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear the native file input value so selecting the same file again will trigger onChange
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
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setLogo(null);
    setLogoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    router.push('/profile/business-details/business-details-list');
  };

  async function handleAddBusinessDetails(values: BusinessDetailsFormValues) {
    try {
      setIsLoading(true);
      const token = Cookies.get('authToken');

      if (!token) {
        console.error('No token found');
        return;
      }

      const isVatRegistered = values.isVatRegistered === 'yes' ? true : false;

      const payload: any = {
        name: values.name,
        companyName: values.companyName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        companyNameLocal: values.companyNameLocal,
        isVatRegistered,
        addressStreet: values.addressStreet,
        addressStreetAdditional: values.addressStreetAdditional,
        buildingNumber: values.buildingNumber,
        country: values.country,
        province: values.province,
        city: values.city,
        district: values.district,
        postalCode: values.postalCode,
        additionalNumber: values.additionalNumber,
        addressLocal: values.addressLocal,
      };

      // Always include VAT fields if they have values
      if (values.companyRegistrationNumber) {
        payload.companyRegistrationNumber = values.companyRegistrationNumber;
      }
      if (values.vatNumber) {
        payload.vatNumber = values.vatNumber;
      }
      if (values.groupVatNumber) {
        payload.groupVatNumber = values.groupVatNumber;
      }

      // Always include identification fields if they have values
      if (values.identificationType) {
        payload.identificationType = values.identificationType;
      }
      if (values.identificationNumber) {
        payload.identificationNumber = values.identificationNumber;
      }

      // Always include refund policy fields if they have values
      if (values.refundPolicy) {
        payload.refundPolicy = values.refundPolicy;
      }
      if (values.refundPolicyLocal) {
        payload.refundPolicyLocal = values.refundPolicyLocal;
      }

      // If id exists, update otherwise create new
      if (id) {
        payload.id = id;
        await updateBusinessDetails({
          token,
          payload,
          // businessDetailsId: id,
          file: logo || undefined,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
          successCallbackFunction: () => {
            // Reset form after successful submission
            handleCancel();
            // Navigate back to business details list
            router.push('/profile/business-details/business-details-list');
          },
        });
      } else {
        await addBusinessDetails({
          token,
          payload,
          file: logo || undefined,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
          successCallbackFunction: () => {
            // Reset form after successful submission
            handleCancel();
            // Navigate back to business details list
            router.push('/profile/business-details/business-details-list');
          },
        });
      }
    } catch (error) {
      console.error('Error adding business details:', error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }

  // Helper function to display error messages
  const getErrorMessage = (fieldName: keyof typeof formik.errors) => {
    const error = formik.errors[fieldName];
    const touched = formik.touched[fieldName];

    if (touched && error) {
      return typeof error === 'string' ? error : error;
    }
    return '';
  };

  const hasError = (fieldName: keyof typeof formik.errors) => {
    return formik.touched[fieldName] && !!formik.errors[fieldName];
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
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('profile.title')}</span>
          <span className='text-gray-800'>
            |{' '}
            {id
              ? t('profile.editBusinessDetails')
              : t('profile.addBusinessDetails')}
          </span>
        </h2>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t('profile.cancel')}
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className='mr-2 h-4 w-4 text-white' />
                {id
                  ? t('profile.updating', { defaultValue: 'Updating...' })
                  : t('profile.saving', { defaultValue: 'Saving...' })}
              </>
            ) : id ? (
              t('profile.update', { defaultValue: 'Update' })
            ) : (
              t('profile.addBusinessDetails')
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        {/* Basic Information */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Name and Company */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('profile.name')}: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('profile.johnDoe')}
                  className={`bg-blue-50 h-10 py-2 ${
                    hasError('name') ? 'border-red-500 border' : ''
                  }`}
                />
                {hasError('name') && (
                  <p className='text-red-500 text-xs mt-1'>
                    {getErrorMessage('name')}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('profile.companyName')}:{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='companyName'
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('profile.specifyCompanyName')}
                  className={`bg-blue-50 h-10 py-2 ${
                    hasError('companyName') ? 'border-red-500 border' : ''
                  }`}
                />
                {hasError('companyName') && (
                  <p className='text-red-500 text-xs mt-1'>
                    {getErrorMessage('companyName')}
                  </p>
                )}
              </div>
            </div>

            {/* Email and Phone */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('profile.email')}: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='email'
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('profile.nameAtDomain')}
                  className={`bg-blue-50 h-10 py-2 ${
                    hasError('email') ? 'border-red-500 border' : ''
                  }`}
                />
                {hasError('email') && (
                  <p className='text-red-500 text-xs mt-1'>
                    {getErrorMessage('email')}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t('profile.phoneNumber')}:{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <div className='w-full'>
                  {/* Input wrapper */}
                  <div className='flex items-center rounded-lg border bg-blue-50 px-2 h-10'>
                    <Image
                      src='/saudi_flag.svg'
                      alt='saudi flag'
                      width={24}
                      height={24}
                      className='mr-3'
                    />

                    <Input
                      type='tel'
                      name='phoneNumber'
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('profile.phoneNumber')}
                      className='flex-1 bg-transparent border-none outline-none focus:ring-0'
                    />
                  </div>

                  {hasError('phoneNumber') && (
                    <p className='text-red-500 text-xs mt-1'>
                      {getErrorMessage('phoneNumber')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Name in Local Language */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.companyNameLocal')}:
              </label>
              <Input
                type='text'
                name='companyNameLocal'
                value={formik.values.companyNameLocal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.specifyCompanyName')}
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>

          {/* Right Column - Logo Upload */}
          <Card
            className='border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center min-h-30 bg-blue-50 hover:border-blue-400 transition-colors'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer gap-3'>
              {logoPreview ? (
                <div className='w-full flex flex-col items-center gap-2'>
                  <img
                    src={logoPreview}
                    alt='Logo preview'
                    className='w-auto h-auto max-w-37.5 max-h-37.5 object-contain'
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className='w-full max-w-xs'>
                      <div className='text-xs text-gray-600 mb-1'>
                        {t('profile.uploading', { defaultValue: 'Uploading:' })}{' '}
                        {uploadProgress}%
                      </div>
                      <div className='w-full bg-gray-300 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    type='button'
                    className='text-xs text-blue-600 hover:text-blue-800 mt-2'
                    onClick={(e) => {
                      e.preventDefault();
                      setLogo(null);
                      setLogoPreview('');
                      setUploadProgress(0);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    {t('profile.changeLogo', { defaultValue: 'Remove Logo' })}
                  </button>
                </div>
              ) : (
                <>
                  <div className='text-4xl font-bold text-gray-300'>
                    {t('profile.logo')}
                  </div>
                  <Upload className='h-8 w-8 text-gray-400' />
                  <p className='text-center text-gray-400 text-sm'>
                    {t('profile.dragDrop')}
                  </p>
                </>
              )}
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleLogoChange}
                className='hidden'
                disabled={isLoading}
              />
            </label>
          </Card>
        </div>

        {/* Address Section */}
        <div className='relative flex items-center py-2'>
          <Separator className='flex-1 bg-blue-100 h-0.5' />
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            {t('profile.address')}
          </span>
          <Separator className='flex-1 bg-blue-100 h-0.5' />
        </div>

        {/* Address Streets */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.addressStreet')}
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='addressStreet'
                value={formik.values.addressStreet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.addressPlaceholder1')}
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.addressStreetAdditional')}
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='addressStreetAdditional'
                value={formik.values.addressStreetAdditional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.addressPlaceholder2')}
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.buildingNumber')}:{' '}
              <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='buildingNumber'
                value={formik.values.buildingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.numberPlaceholder')}
                className={`bg-blue-50 h-10 py-2 w-full ${
                  hasError('buildingNumber') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('buildingNumber') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('buildingNumber')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Country, Province, City */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.country')}: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Select
                value={formik.values.country}
                onValueChange={(value) =>
                  formik.setFieldValue('country', value)
                }
              >
                <SelectTrigger
                  className={`bg-blue-50 h-10 py-2 w-full ${
                    hasError('country') ? 'border-red-500 border' : ''
                  }`}
                >
                  <SelectValue placeholder={t('profile.selectCountry')} />
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
              {hasError('country') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('country')}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.province')}:
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='province'
                value={formik.values.province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.provinceState')}
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.city')}: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='city'
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.cityPlaceholder')}
                className={`bg-blue-50 h-10 py-2 w-full ${
                  hasError('city') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('city') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('city')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* District, Postal Code, Additional Number */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.district')}: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='district'
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.districtPlaceholder')}
                className={`bg-blue-50 h-10 py-2 w-full ${
                  hasError('district') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('district') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('district')}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.postalCode')}: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='postalCode'
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.postalCodePlaceholder')}
                className={`bg-blue-50 h-10 py-2 w-full ${
                  hasError('postalCode') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('postalCode') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('postalCode')}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t('profile.additionalNumber')}:
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='additionalNumber'
                value={formik.values.additionalNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.numberPlaceholder')}
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
        </div>

        {/* Address in Local Language */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('profile.addressLocalLanguage')}
          </label>
          <div className='w-full'>
            <textarea
              name='addressLocal'
              value={formik.values.addressLocal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('profile.addressPlaceholder2')}
              className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              rows={4}
            />
          </div>
        </div>
        {/* VAT Registration Heading */}
        <div className='relative flex items-center py-2'>
          {/* The light blue line */}
          <Separator className='flex-1 bg-blue-100 h-0.5' />

          {/* The centered text */}
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            {t('profile.vatInfo')}
          </span>

          {/* The other side of the line */}
          <Separator className='flex-1 bg-blue-100 h-0.5' />
        </div>

        {/* VAT Registration */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            {t('profile.isSaudiVatRegistered')}:{' '}
            <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-6'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='isVatRegistered'
                value='yes'
                checked={formik.values.isVatRegistered === 'yes'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>{t('profile.yes')}</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='isVatRegistered'
                value='no'
                checked={formik.values.isVatRegistered === 'no'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>{t('profile.no')}</span>
            </label>
          </div>
          {hasError('isVatRegistered') && (
            <p className='text-red-500 text-xs mt-1'>
              {getErrorMessage('isVatRegistered')}
            </p>
          )}
        </div>

        {/* VAT Registration Section */}
        <div className=' p-6 rounded-lg  '>
          <p className='text-sm text-gray-600 mb-4'>
            Please provide VAT registration details
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.companyRegistrationNumber')}:{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='companyRegistrationNumber'
                value={formik.values.companyRegistrationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.specifyCompanyRegNumber')}
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('companyRegistrationNumber')
                    ? 'border-red-500 border'
                    : ''
                }`}
              />
              {hasError('companyRegistrationNumber') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('companyRegistrationNumber')}
                </p>
              )}
            </div>
            <div className='px-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.vatNo')}: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='vatNumber'
                value={formik.values.vatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.vatNumberPlaceholder')}
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('vatNumber') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('vatNumber') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('vatNumber')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.groupVatNo')}:
              </label>
              <Input
                type='text'
                name='groupVatNumber'
                value={formik.values.groupVatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.notAvailable')}
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className=' p-6 rounded-lg'>
          <div className='relative flex items-center py-2'>
            {/* The light blue line */}
            <Separator className='flex-1 bg-blue-100 h-0.5' />

            {/* The centered text */}
            <span className='mx-6 text-sm font-semibold text-blue-600'>
              {t('profile.additionalInfo')}
            </span>

            {/* The other side of the line */}
            <Separator className='flex-1 bg-blue-100 h-0.5' />
          </div>
          <p className='text-xs text-gray-600 mb-4'>
            {t('profile.nonKsaVatInfo')}
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.identification')}:{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Select
                value={formik.values.identificationType}
                onValueChange={(value) =>
                  formik.setFieldValue('identificationType', value)
                }
              >
                <SelectTrigger
                  className={`bg-blue-50 h-10 py-2 ${
                    hasError('identificationType')
                      ? 'border-red-500 border'
                      : ''
                  }`}
                >
                  <SelectValue
                    placeholder={t('profile.identificationTypePlaceholder')}
                  />
                </SelectTrigger>

                <SelectContent>
                  {identificationTypes.map((option, index) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {t(`${option.displayText}`)}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value='commercial_registration_number'>
                    {t('profile.commercialRegistration')}
                  </SelectItem>
                  <SelectItem value='momra_license'>
                    {t('profile.momraLicense')}
                  </SelectItem>
                  <SelectItem value='mlsd_license'>
                    {t('profile.mlsdLicense')}
                  </SelectItem>
                  <SelectItem value='sagia_license'>
                    {t('profile.sagiaLicense')}
                  </SelectItem>
                  <SelectItem value='ministry_of_justice_license'>
                    {t('profile.ministryOfJustice')}
                  </SelectItem>
                  <SelectItem value='other_id'>
                    {t('profile.otherID')}
                  </SelectItem> */}
                </SelectContent>
              </Select>
              {hasError('identificationType') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('identificationType')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.identificationNumber')}:{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='identificationNumber'
                value={formik.values.identificationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('profile.identificationNumberPlaceholder')}
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('identificationNumber')
                    ? 'border-red-500 border'
                    : ''
                }`}
              />
              {hasError('identificationNumber') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('identificationNumber')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Refund Policy Section */}
        <Accordion
          type='single'
          collapsible
          defaultValue='refund-policy'
          className='space-y-4'
        >
          <AccordionItem
            value='refund-policy'
            className='border-none'
          >
            {/* Header */}
            <AccordionTrigger className='relative flex items-center py-2 hover:no-underline group'>
              <Separator className='flex-1 bg-blue-100 h-0.5' />

              <span className='mx-6 text-sm font-semibold text-blue-500 flex items-center gap-2'>
                REFUND POLICY
                <ChevronDown className='h-4 w-4 text-blue-400 transition-transform duration-300 group-data-[state=open]:rotate-180' />
              </span>

              <Separator className='flex-1 bg-blue-100 h-0.5' />
            </AccordionTrigger>

            {/* Content */}
            <AccordionContent className='pt-4 space-y-4'>
              {/* Description */}
              <p className='text-sm text-gray-500'>
                The refund policy outlines the rules for obtaining refunds for
                purchased goods and services. This policy will be included in
                all simple and standard invoices.
              </p>

              {/* Refund Policy (English) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Refund Policy:
                </label>
                <textarea
                  name='refundPolicy'
                  value={formik.values.refundPolicy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='No refunds'
                  rows={3}
                  className={`w-full bg-blue-50 border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError('refundPolicy')
                      ? 'border-red-500'
                      : 'border-blue-200'
                  }`}
                />
                {hasError('refundPolicy') && (
                  <p className='text-red-500 text-xs mt-1'>
                    {getErrorMessage('refundPolicy')}
                  </p>
                )}
              </div>

              {/* Refund Policy (Local Language) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Refund Policy in local language:
                </label>
                <textarea
                  name='refundPolicyLocal'
                  value={formik.values.refundPolicyLocal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='لا يوجد استرجاع'
                  rows={3}
                  className={`w-full bg-blue-50 border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError('refundPolicyLocal')
                      ? 'border-red-500'
                      : 'border-blue-200'
                  }`}
                />
                {hasError('refundPolicyLocal') && (
                  <p className='text-red-500 text-xs mt-1'>
                    {getErrorMessage('refundPolicyLocal')}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}

export default function BusinessDetailsFormPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <Spinner className='h-12 w-12 text-blue-600' />
        </div>
      }
    >
      <BusinessDetailsFormContent />
    </Suspense>
  );
}
