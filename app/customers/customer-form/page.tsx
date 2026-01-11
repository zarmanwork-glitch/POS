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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
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
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(!!id);

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
    onSubmit: handleAddCustomer,
  });

  // Fetch customer data using id
  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          setIsLoadingDetails(true);
          const token = Cookies.get('authToken');
          if (!token) {
            console.error('No token found');
            return;
          }

          const response = await getCustomerById({ token, customerId: id });

          if (response?.data.data?.results?.customers) {
            const data = response.data.data.results.customers;

            formik.setValues({
              name: data.name || '',
              companyName: data.companyName || '',
              customerNumber: data.customerNumber || '',
              email: data.email || '',
              phoneNumber: data.phoneNumber || '',
              companyNameLocal: data.companyNameLocal || '',
              country: data.country || '',
              addressStreet: data.addressStreet || '',
              addressStreetAdditional: data.addressStreetAdditional || '',
              buildingNumber: data.buildingNumber || '',
              province: data.province || '',
              city: data.city || '',
              district: data.district || '',
              postalCode: data.postalCode || '',
              neighborhood: data.neighborhood || '',
              addressLocal: data.addressLocal || '',
              companyRegistrationNumber: data.companyRegistrationNumber || '',
              vatNumber: data.vatNumber || '',
              groupVatNumber: data.groupVatNumber || '',
              identificationType: data.identificationType || '',
              identificationNumber: data.identificationNumber || '',
            });
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          toast.error('Failed to load customer data');
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  async function handleAddCustomer(values: typeof formik.values) {
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
        await updateCustomer({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/customers/customer-list');
          },
        });
      } else {
        await createCustomer({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/customers/customer-list');
          },
        });
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error(id ? 'Error updating customer' : 'Error creating customer');
    } finally {
      setIsLoading(false);
    }
  }

  const hasError = (field: keyof typeof formik.errors) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getErrorMessage = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';

  const handleClearCountry = () => {
    formik.setFieldValue('country', '');
    formik.setFieldTouched('country', true);
  };

  // Loading spinner component
  if (isLoadingDetails) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='space-y-4 text-center'>
          <Spinner className='h-12 w-12 text-blue-600 mx-auto' />
          <p className='text-gray-600 font-medium'>{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('sidebar.customers')}</span>
          <span className='text-gray-800'>
            |{' '}
            {id ? t('customers.form.editTitle') : t('customers.form.addTitle')}
          </span>
        </h2>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => router.push('/customers/customer-list')}
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
                {id ? t('profile.updating') : t('profile.saving')}
              </>
            ) : id ? (
              t('profile.update')
            ) : (
              t('profile.save')
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
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                placeholder={t('customers.form.placeholders.name')}
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
                {t('customers.searchOptions.customerNumber')}:
              </label>
              <Input
                type='text'
                name='customerNumber'
                value={formik.values.customerNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.customerNumber')}
                className='bg-blue-50 h-10 py-2'
              />
            </div>
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
                placeholder={t('customers.form.placeholders.email')}
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
                {t('profile.phoneNumber')}:
              </label>
              <Input
                type='tel'
                name='phoneNumber'
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.phoneNumber')}
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
                {t('profile.companyName')} :{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='companyName'
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.companyName')}
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
            <Separator className='flex-1 bg-blue-100 h-0.5' />
            <span className='mx-6 text-sm font-semibold text-blue-600'>
              ADDRESS
            </span>
            <Separator className='flex-1 bg-blue-100 h-0.5' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('profile.country')}: <span className='text-red-500'>*</span>
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
                    <SelectValue
                      placeholder={t(
                        'customers.form.placeholders.selectCountry'
                      )}
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
                {t('profile.city')} : <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='city'
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.enterCity')}
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
                {t('profile.district')} :{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='district'
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.enterDistrict')}
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
                {t('profile.addressStreet')} :{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='addressStreet'
                value={formik.values.addressStreet}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.enterAddress')}
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
                {t('profile.buildingNumber')} :{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='buildingNumber'
                value={formik.values.buildingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t(
                  'customers.form.placeholders.enterBuildingNumber'
                )}
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
                {t('profile.postalCode')} :{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='postalCode'
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('customers.form.placeholders.enterPostalCode')}
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
