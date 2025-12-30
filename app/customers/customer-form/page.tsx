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
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
} from '@/api/customers/customer.api';
import countries from '@/json/countries.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  companyName: Yup.string().required('Company Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  district: Yup.string().required('District is required'),
  addressStreet: Yup.string().required('Street Address is required'),
  buildingNumber: Yup.string().required('Building Number is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  // Optional fields (no validation)
  customerNumber: Yup.string(),
  phoneNumber: Yup.string(),
  companyNameLocal: Yup.string(),
  province: Yup.string(),
  addressStreetAdditional: Yup.string(),
  neighborhood: Yup.string(),
  addressLocal: Yup.string(),
  companyRegistrationNumber: Yup.string(),
  vatNumber: Yup.string(),
  groupVatNumber: Yup.string(),
  identificationType: Yup.string(),
  identificationNumber: Yup.string(),
});

export default function CustomerFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const isEditMode = !!customerId;
  const token = Cookies.get('authToken');

  const formik = useFormik({
    initialValues: {
      name: '',
      companyName: '',
      customerNumber: '',
      email: '',
      phoneNumber: '',
      companyNameLocal: '',
      country: '',
      addressStreet: '',
      addressStreetAdditional: '',
      buildingNumber: '',
      province: '',
      city: '',
      district: '',
      postalCode: '',
      neighborhood: '',
      addressLocal: '',
      companyRegistrationNumber: '',
      vatNumber: '',
      groupVatNumber: '',
      identificationType: '',
      identificationNumber: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const payload = isEditMode ? { id: customerId, ...values } : values;
        const apiCall = isEditMode ? updateCustomer : createCustomer;

        await apiCall({
          token,
          payload,
          successCallbackFunction: () => {
            toast.success(
              isEditMode
                ? 'Customer updated successfully'
                : 'Customer created successfully'
            );
            router.push('/customers/customer-list');
          },
        });
      } catch (error: any) {
        console.error('Error:', error);
        toast.error(
          isEditMode ? 'Error updating customer' : 'Error creating customer',
          { duration: 2000 }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch customer data in edit mode
  useEffect(() => {
    if (isEditMode && token && customerId) {
      const fetchCustomer = async () => {
        try {
          const response = await getCustomerById({ token, customerId });
          if (response?.data) {
            const customer = response.data;
            formik.setValues({
              name: customer.name || '',
              companyName: customer.companyName || '',
              customerNumber: customer.customerNumber || '',
              email: customer.email || '',
              phoneNumber: customer.phoneNumber || '',
              companyNameLocal: customer.companyNameLocal || '',
              country: customer.country || '',
              addressStreet: customer.addressStreet || '',
              addressStreetAdditional: customer.addressStreetAdditional || '',
              buildingNumber: customer.buildingNumber || '',
              province: customer.province || '',
              city: customer.city || '',
              district: customer.district || '',
              postalCode: customer.postalCode || '',
              neighborhood: customer.neighborhood || '',
              addressLocal: customer.addressLocal || '',
              companyRegistrationNumber:
                customer.companyRegistrationNumber || '',
              vatNumber: customer.vatNumber || '',
              groupVatNumber: customer.groupVatNumber || '',
              identificationType: customer.identificationType || '',
              identificationNumber: customer.identificationNumber || '',
            });
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          toast.error('Failed to load customer data');
        }
      };
      fetchCustomer();
    }
  }, [isEditMode, token, customerId]);

  const hasError = (field: keyof typeof formik.errors) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getErrorMessage = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';

  const handleClearCountry = () => {
    formik.setFieldValue('country', '');
    formik.setFieldTouched('country', true);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Customers</span>
          <span className='text-gray-800'>
            | {isEditMode ? 'Edit Customer' : 'Add Customer'}
          </span>
        </h2>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => router.push('/customers/customer-list')}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={formik.handleSubmit}
        className='space-y-6'
      >
        {/* Basic Information */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                placeholder='Enter customer name'
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
                Customer Number:
              </label>
              <Input
                type='text'
                name='customerNumber'
                value={formik.values.customerNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter customer number'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
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
                placeholder='Enter email address'
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
                Phone Number:
              </label>
              <Input
                type='tel'
                name='phoneNumber'
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter phone number'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Company Name : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='companyName'
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter company name'
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
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Company Name (Local):
              </label>
              <Input
                type='text'
                name='companyNameLocal'
                value={formik.values.companyNameLocal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter local company name'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Company Registration Number:
              </label>
              <Input
                type='text'
                name='companyRegistrationNumber'
                value={formik.values.companyRegistrationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter registration number'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                VAT Number:
              </label>
              <Input
                type='text'
                name='vatNumber'
                value={formik.values.vatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter VAT number'
                className='bg-blue-50 h-10 py-2'
              />
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
                placeholder='Enter group VAT number'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Identification Type:
              </label>
              <Select
                value={formik.values.identificationType}
                onValueChange={(value) =>
                  formik.setFieldValue('identificationType', value)
                }
              >
                <SelectTrigger className='bg-blue-50 h-10 py-2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='national_id'>National ID</SelectItem>
                  <SelectItem value='tax_identification_no'>
                    Tax Identification No
                  </SelectItem>
                  <SelectItem value='iqama_number'>Iqama Number</SelectItem>
                  <SelectItem value='passport_id'>Passport ID</SelectItem>
                  <SelectItem value='700_number'>700 Number</SelectItem>
                  <SelectItem value='commercial_registration_number'>
                    Commercial Registration
                  </SelectItem>
                  <SelectItem value='momra_license'>MOMRA License</SelectItem>
                  <SelectItem value='mlsd_license'>MLSD License</SelectItem>
                  <SelectItem value='sagia_license'>SAGIA License</SelectItem>
                  <SelectItem value='gcc_id'>GCC ID</SelectItem>
                  <SelectItem value='ministry_of_justice_license'>
                    Ministry of Justice License
                  </SelectItem>
                  <SelectItem value='other_id'>Other ID</SelectItem>
                  <SelectItem value='company_registration'>
                    Company Registration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Identification Number:
              </label>
              <Input
                type='text'
                name='identificationNumber'
                value={formik.values.identificationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter identification number'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <div className='relative flex items-center py-2'>
            <div className='flex-grow border-t-2 border-blue-100'></div>
            <span className='mx-6 text-sm font-semibold text-blue-600'>
              ADDRESS
            </span>
            <div className='flex-grow border-t-2 border-blue-100'></div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Country: <span className='text-red-500'>*</span>
              </label>
              {formik.values.country ? (
                <div className='flex items-center gap-2 bg-blue-50 border border-gray-300 rounded-md p-2 h-10'>
                  <span className='text-sm text-gray-700 flex-1'>
                    {formik.values.country}
                  </span>
                  <button
                    type='button'
                    onClick={handleClearCountry}
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
                  <SelectTrigger
                    className={`bg-blue-50 h-10 py-2 ${
                      hasError('country') ? 'border-red-500 border' : ''
                    }`}
                  >
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
              {hasError('country') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('country')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Province/State:
              </label>
              <Input
                type='text'
                name='province'
                value={formik.values.province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Province/State'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                City : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='city'
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter city'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('city') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('city') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('city')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                District : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='district'
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter district'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('district') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('district') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('district')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Street Address : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='addressStreet'
                value={formik.values.addressStreet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter street address'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('addressStreet') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('addressStreet') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('addressStreet')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Additional Street Info:
              </label>
              <Input
                type='text'
                name='addressStreetAdditional'
                value={formik.values.addressStreetAdditional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter additional info'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Building Number : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='buildingNumber'
                value={formik.values.buildingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter building number'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('buildingNumber') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('buildingNumber') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('buildingNumber')}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Neighborhood:
              </label>
              <Input
                type='text'
                name='neighborhood'
                value={formik.values.neighborhood}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter neighborhood'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Postal Code : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='postalCode'
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter postal code'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('postalCode') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('postalCode') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('postalCode')}
                </p>
              )}
            </div>
            <div className='md:col-span-3'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Address (Local Language):
              </label>
              <Input
                type='text'
                name='addressLocal'
                value={formik.values.addressLocal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter address in local language'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
