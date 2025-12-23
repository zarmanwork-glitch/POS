'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const units = [
  'Unit',
  'Meter',
  'Kilogram',
  'Liter',
  'Piece',
  'Box',
  'Pack',
  'Dozen',
  'Hour',
  'Day',
  'Month',
  'Year',
];

export default function NewItemPage() {
  const [formData, setFormData] = useState({
    itemType: 'material',
    itemStatus: true,
    description: '',
    materialServiceCode: '',
    unitOfMeasure: 'Unit',
    currencyBuy: 'SAR - Saudi Riyal',
    buyPrice: '0',
    currencySell: 'SAR - Saudi Riyal',
    sellPrice: '0',
    discountPercentage: '0',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, itemType: type }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({ ...prev, itemStatus: !prev.itemStatus }));
  };

  const handleUnitChange = (value: string) => {
    setFormData((prev) => ({ ...prev, unitOfMeasure: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    setFormData({
      itemType: 'material',
      itemStatus: true,
      description: '',
      materialServiceCode: '',
      unitOfMeasure: 'Unit',
      currencyBuy: 'SAR - Saudi Riyal',
      buyPrice: '0',
      currencySell: 'SAR - Saudi Riyal',
      sellPrice: '0',
      discountPercentage: '0',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Profiles</span>
          <span className='text-gray-800'> | New Item</span>
        </h2>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        {/* Item Type */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Item Type : <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-6'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='itemType'
                value='service'
                checked={formData.itemType === 'service'}
                onChange={(e) => handleItemTypeChange(e.target.value)}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>Service</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='itemType'
                value='material'
                checked={formData.itemType === 'material'}
                onChange={(e) => handleItemTypeChange(e.target.value)}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>Material</span>
            </label>
          </div>
        </div>

        {/* Item Status */}
        <div className='flex items-center gap-4'>
          <label className='text-sm font-medium text-gray-700'>
            Item Status : <span className='text-red-500'>*</span>
          </label>
          <button
            type='button'
            onClick={handleToggleStatus}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              formData.itemStatus ? 'bg-blue-400' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                formData.itemStatus ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className='text-sm text-gray-600'>
            {formData.itemStatus ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Description : <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Description'
            className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={4}
          />
        </div>

        {/* Material / Service Code */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Material / Service Code : <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='materialServiceCode'
            value={formData.materialServiceCode}
            onChange={handleChange}
            placeholder='Service/Material Number'
            className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={4}
          />
        </div>

        {/* Unit Of Measure */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Unit Of Measure : <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.unitOfMeasure}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger className='bg-blue-50 h-10 py-2'>
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
        </div>

        {/* Buy Price Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Currency :
            </label>
            <Input
              type='text'
              name='currencyBuy'
              value={formData.currencyBuy}
              disabled
              className='bg-blue-50 h-10 py-2'
            />
            <p className='text-xs text-gray-500 mt-1'>
              SAR - Saudi Riyal is the default currency
            </p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Buy Price :
            </label>
            <Input
              type='text'
              name='buyPrice'
              value={formData.buyPrice}
              onChange={handleChange}
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* Sell Price Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Currency :
            </label>
            <Input
              type='text'
              name='currencySell'
              value={formData.currencySell}
              disabled
              className='bg-blue-50 h-10 py-2'
            />
            <p className='text-xs text-gray-500 mt-1'>
              SAR - Saudi Riyal is the default currency
            </p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Sell Price :
            </label>
            <Input
              type='text'
              name='sellPrice'
              value={formData.sellPrice}
              onChange={handleChange}
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* Discount Percentage */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Discount Percentage :
          </label>
          <div className='flex items-center gap-2'>
            <Input
              type='text'
              name='discountPercentage'
              value={formData.discountPercentage}
              onChange={handleChange}
              className='bg-blue-50 h-10 py-2 flex-1'
            />
            <span className='text-gray-700 font-medium'>%</span>
          </div>
        </div>
      </form>
    </div>
  );
}
