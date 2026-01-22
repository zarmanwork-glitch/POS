'use client';
import { addITEM, getItemById, updateItem } from '@/api/items/item.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { units } from '@/json/units.json';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ToggleButton } from '@/components/base-components/ToggleButton';
import * as Yup from 'yup';

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
      },
    ),
  discountPercentage: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .nullable(),
});

interface ItemFormValues {
  itemType: string;
  itemStatus: string;
  description: string;
  materialNo: string;
  unitOfMeasure: string;
  buyPrice: string | number;
  sellPrice: string | number;
  discountPercentage: string | number;
}

function ItemsFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(!!id);
  const { t } = useTranslation();

  const formik = useFormik<ItemFormValues>({
    initialValues: {
      itemType: '',
      itemStatus: 'enabled',
      description: '',
      materialNo: '',
      unitOfMeasure: '',
      buyPrice: '',
      sellPrice: '',
      discountPercentage: '',
    },
    validationSchema,
    onSubmit: handleAddItem,
  });

  // Fetch item data by id
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          setIsLoadingDetails(true);
          const token = Cookies.get('authToken');
          if (!token) {
            console.error('No token found');
            return;
          }

          const response = await getItemById({ token, itemId: id });
          if (response?.data.data?.results?.items) {
            const data = response.data.data.results.items;

            formik.setValues({
              itemType: data.itemType || '',
              itemStatus: data.itemStatus ?? 'enabled',
              description: data.description || '',
              materialNo: data.materialNo || '',
              unitOfMeasure: data.unitOfMeasure || '',
              buyPrice: data.buyPrice || '',
              sellPrice: data.sellPrice || '',
              discountPercentage: data.discountPercentage || '',
            });
          }
        } catch (error) {
          console.error('Error fetching item:', error);
          toast.error('Failed to load item data');
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchItem();
    }
  }, [id]);

  async function handleAddItem(values: ItemFormValues) {
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
        (payload as any).id = id;
        await updateItem({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/profile/items/items-list');
          },
        });
      } else {
        await addITEM({
          token,
          payload,
          successCallbackFunction: () => {
            router.push('/profile/items/items-list');
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
              ? t('profile.editItem', { defaultValue: 'Edit Item' })
              : t('profile.addItem')}
          </span>
        </h2>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => router.push('/profile/items/items-list')}
            disabled={formik.isSubmitting}
          >
            {t('profile.cancel')}
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={() => formik.handleSubmit()}
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
        {/* Item Information Section */}
        <div className='relative flex items-center py-4'>
          <Separator className='flex-1 bg-blue-100 h-0.5' />
          <span className='mx-6 text-sm font-semibold text-blue-600'>
            {t('profile.itemInformation', { defaultValue: 'ITEM INFORMATION' })}
          </span>
          <Separator className='flex-1 bg-blue-100 h-0.5' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Item Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                {t('profile.itemType')}: <span className='text-red-500'>*</span>
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
                  <span className='text-gray-700'>
                    {t('profile.service', { defaultValue: 'Service' })}
                  </span>
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
                  <span className='text-gray-700'>
                    {t('profile.material', { defaultValue: 'Material' })}
                  </span>
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
                  {unitOfMeasures.map((unit) => (
                    <SelectItem
                      key={unit.value}
                      value={unit.value}
                    >
                      {unit.displayText}
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
            <ToggleButton
              value={formik.values.itemStatus}
              onChange={(val) => formik.setFieldValue('itemStatus', val)}
              optionA={{ value: 'enabled', label: 'Enabled' }}
              optionB={{ value: 'disabled', label: 'Disabled' }}
              label='Item Status'
              required
              showStatusText
            />

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

export default function NewItemPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <Spinner className='h-12 w-12 text-blue-600' />
        </div>
      }
    >
      <ItemsFormContent />
    </Suspense>
  );
}
