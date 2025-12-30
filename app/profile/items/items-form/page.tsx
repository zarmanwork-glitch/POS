'use client';
import { addITEM } from '@/api/items/item.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { units } from '@/json/units.json';

// Validation Schema using Yup
const validationSchema = Yup.object({
  itemType: Yup.string().required('Item type is required'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'Description must be at least 3 characters'),
  materialNo: Yup.string()
    .required('Material/Service No is required')
    .min(2, 'Must be at least 2 characters'),
  unitOfMeasure: Yup.string().required('Unit of measure is required'),
  buyPrice: Yup.number()
    .required('Buy price is required')
    .min(0, 'Buy price cannot be negative'),
  sellPrice: Yup.number()
    .required('Sell price is required')
    .min(0, 'Sell price cannot be negative')
    .test(
      'is-greater-than-buy',
      'Sell price must be greater than or equal to buy price',
      function (value) {
        const { buyPrice } = this.parent;
        return (
          value !== undefined && buyPrice !== undefined && value >= buyPrice
        );
      }
    ),
  discountPercentage: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .nullable(),
});

export default function NewItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');
  const isEditMode = !!itemId;
  const token = Cookies.get('authToken');

  const formik = useFormik({
    initialValues: {
      itemType: 'material',
      itemStatus: 'enabled',
      description: '',
      materialNo: '',
      unitOfMeasure: 'unit',
      buyPrice: 0,
      sellPrice: 0,
      discountPercentage: 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = isEditMode ? { id: itemId, ...values } : values;
        const apiCall = isEditMode
          ? addITEM /* replace with editItem when ready */
          : addITEM;

        await apiCall({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/profile/items/items-list');
          },
        });
      } catch (error) {
        console.error('Error saving item:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch item data on edit mode
  useEffect(() => {
    if (isEditMode && token && itemId) {
      const fetchItem = async () => {
        try {
          // Replace with actual API call when available
          // const response = await getItemById({ token, itemId });
          // const item = response.data;

          // Mock data (remove when real API is connected)
          const item = {
            itemType: 'material',
            itemStatus: 'enabled',
            description: 'Sample item',
            materialNo: 'MAT-001',
            unitOfMeasure: 'piece',
            buyPrice: 100,
            sellPrice: 150,
            discountPercentage: 10,
          };

          formik.setValues({
            itemType: item.itemType || 'material',
            itemStatus: item.itemStatus || 'enabled',
            description: item.description || '',
            materialNo: item.materialNo || '',
            unitOfMeasure: item.unitOfMeasure || 'unit',
            buyPrice: item.buyPrice || 0,
            sellPrice: item.sellPrice || 0,
            discountPercentage: item.discountPercentage || 0,
          });
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      fetchItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, token, itemId]);

  const hasError = (field: keyof typeof formik.errors) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getErrorMessage = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : '';

  if (formik.isSubmitting && isEditMode) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='space-y-4 text-center'>
          <div className='h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='text-gray-600 font-medium'>Loading item data...</p>
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
            | {isEditMode ? ' Edit Item' : ' New Item'}
          </span>
        </h2>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => router.push('/profile/items/items-list')}
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
        {/* Item Information Section */}
        <div className='relative flex items-center py-4'>
          <div className='flex-grow border-t-2 border-blue-100'></div>
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            ITEM INFORMATION
          </span>
          <div className='flex-grow border-t-2 border-blue-100'></div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Item Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Item Type: <span className='text-red-500'>*</span>
              </label>
              <div className='flex gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='itemType'
                    value='service'
                    checked={formik.values.itemType === 'service'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-4 h-4'
                  />
                  <span className='text-gray-700'>Service</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='itemType'
                    value='material'
                    checked={formik.values.itemType === 'material'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='w-4 h-4'
                  />
                  <span className='text-gray-700'>Material</span>
                </label>
              </div>
              {hasError('itemType') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('itemType')}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description: <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='description'
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter item description'
                className={`w-full p-3 border rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  hasError('description') ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
              />
              {hasError('description') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('description')}
                </p>
              )}
            </div>

            {/* Material / Service No */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Material / Service No: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='materialNo'
                value={formik.values.materialNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='e.g. MAT-001'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('materialNo') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('materialNo') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('materialNo')}
                </p>
              )}
            </div>

            {/* Unit of Measure */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Unit of Measure: <span className='text-red-500'>*</span>
              </label>
              <Select
                value={formik.values.unitOfMeasure}
                onValueChange={(value) =>
                  formik.setFieldValue('unitOfMeasure', value)
                }
              >
                <SelectTrigger
                  className={`bg-blue-50 h-10 py-2 ${
                    hasError('unitOfMeasure') ? 'border-red-500 border' : ''
                  }`}
                >
                  <SelectValue placeholder='Select a unit' />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError('unitOfMeasure') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('unitOfMeasure')}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Item Status Toggle */}
            <div className='p-6 bg-blue-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>
                  Item Status: <span className='text-red-500'>*</span>
                </label>
                <button
                  type='button'
                  onClick={() =>
                    formik.setFieldValue(
                      'itemStatus',
                      formik.values.itemStatus === 'enabled'
                        ? 'disabled'
                        : 'enabled'
                    )
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    formik.values.itemStatus === 'enabled'
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formik.values.itemStatus === 'enabled'
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className='text-sm text-gray-600 mt-2'>
                {formik.values.itemStatus === 'enabled'
                  ? 'Enabled'
                  : 'Disabled'}
              </p>
            </div>

            {/* Buy Price */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Buy Price: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='number'
                name='buyPrice'
                value={formik.values.buyPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='0.00'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('buyPrice') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('buyPrice') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('buyPrice')}
                </p>
              )}
            </div>

            {/* Sell Price */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sell Price: <span className='text-red-500'>*</span>
              </label>
              <Input
                type='number'
                name='sellPrice'
                value={formik.values.sellPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='0.00'
                className={`bg-blue-50 h-10 py-2 ${
                  hasError('sellPrice') ? 'border-red-500 border' : ''
                }`}
              />
              {hasError('sellPrice') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('sellPrice')}
                </p>
              )}
            </div>

            {/* Discount Percentage */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Discount Percentage:
              </label>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  name='discountPercentage'
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='0'
                  className={`bg-blue-50 h-10 py-2 flex-1 ${
                    hasError('discountPercentage')
                      ? 'border-red-500 border'
                      : ''
                  }`}
                />
                <span className='text-gray-700 font-medium'>%</span>
              </div>
              {hasError('discountPercentage') && (
                <p className='text-red-500 text-xs mt-1'>
                  {getErrorMessage('discountPercentage')}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
