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
import { Spinner } from '@/components/ui/spinner';
import countries from '@/json/countries.json';
import { validationSchema } from '@/schema/businessDetailsFormValidation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { Upload } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BusinessDetailsFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(!!id);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      name: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      companyNameLocal: '',
      isVatRegistered: '',
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
            });

            // Set existing logo URL if available
            if (data.logoUrl) {
              setExistingLogoUrl(data.logoUrl);
              setLogoPreview(data.logoUrl);
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
  };

  async function handleAddBusinessDetails(values: typeof formik.values) {
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
              (progressEvent.loaded * 100) / progressEvent.total
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
              (progressEvent.loaded * 100) / progressEvent.total
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
          <p className='text-gray-600 font-medium'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Profile</span>
          <span className='text-gray-800'>
            | {id ? 'Edit Business Details' : 'Add Business Details'}
          </span>
        </h2>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
          >
            {isLoading
              ? id
                ? 'Updating...'
                : 'Saving...'
              : id
              ? 'Update'
              : 'Add'}
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
                  Name: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='John Doe'
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
                  Company Name: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='companyName'
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='Specify company name'
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
                  Email: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='email'
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='name@domain.com'
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
                  Phone Number: <span className='text-red-500'>*</span>
                </label>
                <div className='flex gap-2'>
                  <Input
                    type='text'
                    value='SA'
                    disabled
                    className='w-16 bg-blue-50 h-10 py-2'
                  />
                  <div className='flex-1'>
                    <Input
                      type='tel'
                      name='phoneNumber'
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder='Phone number'
                      className={`bg-blue-50 h-10 py-2 ${
                        hasError('phoneNumber') ? 'border-red-500 border' : ''
                      }`}
                    />
                    {hasError('phoneNumber') && (
                      <p className='text-red-500 text-xs mt-1'>
                        {getErrorMessage('phoneNumber')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Name in Local Language */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Company Name (Local Language):
              </label>
              <Input
                type='text'
                name='companyNameLocal'
                value={formik.values.companyNameLocal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Company name'
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
                        Uploading: {uploadProgress}%
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
                    }}
                  >
                    Change Logo
                  </button>
                </div>
              ) : (
                <>
                  <div className='text-4xl font-bold text-gray-300'>Logo</div>
                  <Upload className='h-8 w-8 text-gray-400' />
                  <p className='text-center text-gray-400 text-sm'>
                    Drag and drop your image here or click to select
                  </p>
                </>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleLogoChange}
                className='hidden'
                disabled={isLoading}
              />
            </label>
          </Card>
        </div>

        {/* Address Section */}
        <div className='relative flex items-center py-2'>
          <div className='flex-grow border-t-2 border-blue-100'></div>
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            ADDRESS
          </span>
          <div className='flex-grow border-t-2 border-blue-100'></div>
        </div>

        {/* Address Streets */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Street Address:
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='addressStreet'
                value={formik.values.addressStreet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Street name'
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Street Address (Additional):
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='addressStreetAdditional'
                value={formik.values.addressStreetAdditional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Additional address details'
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Building Number: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='buildingNumber'
                value={formik.values.buildingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter number'
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
              Country: <span className='text-red-500'>*</span>
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
                  <SelectValue placeholder='Select country' />
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
              Province/State:
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='province'
                value={formik.values.province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Province or state'
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              City: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='city'
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='City name'
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
              District: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='district'
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='District name'
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
              Postal Code: <span className='text-red-500'>*</span>
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='postalCode'
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Postal code'
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
              Additional Number:
            </label>
            <div className='w-full'>
              <Input
                type='text'
                name='additionalNumber'
                value={formik.values.additionalNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter number'
                className='bg-blue-50 h-10 py-2 w-full'
              />
            </div>
          </div>
        </div>

        {/* Address in Local Language */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Address Local Language
          </label>
          <div className='w-full'>
            <textarea
              name='addressLocal'
              value={formik.values.addressLocal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='Address in local language'
              className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
              rows={4}
            />
          </div>
        </div>
        {/* VAT Registration Heading */}
        <div className='relative flex items-center py-2'>
          {/* The light blue line */}
          <div className='flex-grow border-t-2 border-blue-100'></div>

          {/* The centered text */}
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            VAT INFO
          </span>

          {/* The other side of the line */}
          <div className='flex-grow border-t-2 border-blue-100'></div>
        </div>

        {/* VAT Registration */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Is Saudi VAT Registered: <span className='text-red-500'>*</span>
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
              <span className='text-gray-700'>Yes</span>
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
              <span className='text-gray-700'>No</span>
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
                Company Registration Number:{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='companyRegistrationNumber'
                value={formik.values.companyRegistrationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Specify company registration number'
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
                VAT Number: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='vatNumber'
                value={formik.values.vatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='VAT number'
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
                Group VAT Number:
              </label>
              <Input
                type='text'
                name='groupVatNumber'
                value={formik.values.groupVatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Not available'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className=' p-6 rounded-lg'>
          <div className='relative flex items-center py-2'>
            {/* The light blue line */}
            <div className='flex-grow border-t-2 border-blue-100'></div>

            {/* The centered text */}
            <span className='mx-6 text-sm font-semibold text-blue-600'>
              ADDITIONAL INFO
            </span>

            {/* The other side of the line */}
            <div className='flex-grow border-t-2 border-blue-100'></div>
          </div>
          <p className='text-xs text-gray-600 mb-4'>
            For non-KSA VAT registration, provide relevant identification
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Identification Type: <span className='text-red-500'>*</span>
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
                  <SelectValue placeholder='Select identification type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='commercial_registration_number'>
                    Commercial Registration
                  </SelectItem>
                  <SelectItem value='momra_license'>MOMRA License</SelectItem>
                  <SelectItem value='mlsd_license'>MLSD License</SelectItem>
                  <SelectItem value='sagia_license'>SAGIA License</SelectItem>
                  <SelectItem value='ministry_of_justice_license'>
                    Ministry of Justice License
                  </SelectItem>
                  <SelectItem value='other_id'>Other ID</SelectItem>
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
                Identification Number: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='identificationNumber'
                value={formik.values.identificationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Identification Number'
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
      </form>
    </div>
  );
}
