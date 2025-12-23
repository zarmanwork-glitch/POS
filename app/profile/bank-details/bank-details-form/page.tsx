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
import { useState } from 'react';

const countries = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Kuwait',
  'Qatar',
  'Bahrain',
  'Oman',
  'Egypt',
  'Jordan',
  'Lebanon',
  'Iraq',
  'Syria',
  'Palestine',
  'Yemen',
  'Sudan',
  'Djibouti',
  'Mauritania',
  'Morocco',
  'Algeria',
  'Tunisia',
  'Libya',
  'United States',
  'Canada',
  'United Kingdom',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Poland',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Portugal',
  'Greece',
  'Ireland',
  'Australia',
  'New Zealand',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Pakistan',
  'Bangladesh',
  'Thailand',
  'Vietnam',
  'Malaysia',
  'Singapore',
  'Indonesia',
  'Philippines',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'Colombia',
  'Peru',
  'South Africa',
];

export default function AddBankDetailsPage() {
  const [formData, setFormData] = useState({
    country: 'Saudi Arabia',
    accountNumber: '',
    iban: '',
    bankName: '',
    swiftCode: '',
    beneficiaryName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleClearCountry = () => {
    setFormData((prev) => ({ ...prev, country: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    setFormData({
      country: 'Saudi Arabia',
      accountNumber: '',
      iban: '',
      bankName: '',
      swiftCode: '',
      beneficiaryName: '',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Profiles</span>
          <span className='text-gray-800'> | Add Bank Details</span>
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
            Add
          </Button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        {/* Bank Details Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Country */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Country : <span className='text-red-500'>*</span>
            </label>
            {formData.country ? (
              <div className='flex items-center gap-2 bg-blue-50 border border-gray-300 rounded-md p-2 h-10'>
                <span className='text-sm text-gray-700 flex-1'>
                  {formData.country}
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
                value={formData.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className='bg-blue-50 h-10 py-2'>
                  <SelectValue placeholder='Select a country' />
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
          </div>

          {/* Account Number */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Account Number : <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='accountNumber'
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder='Specify Account Number'
              className='bg-blue-50 h-10 py-2'
            />
          </div>

          {/* IBAN */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              IBAN : <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='iban'
              value={formData.iban}
              onChange={handleChange}
              placeholder='SA4420000001234567890000'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* Second Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Bank Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Bank Name : <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='bankName'
              value={formData.bankName}
              onChange={handleChange}
              placeholder='Bank Name'
              className='bg-blue-50 h-10 py-2'
            />
          </div>

          {/* SWIFT Code */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              SWIFT Code : <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='swiftCode'
              value={formData.swiftCode}
              onChange={handleChange}
              placeholder='Specify Bank Code'
              className='bg-blue-50 h-10 py-2'
            />
          </div>

          {/* Beneficiary Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Beneficiary Name :
            </label>
            <Input
              type='text'
              name='beneficiaryName'
              value={formData.beneficiaryName}
              onChange={handleChange}
              placeholder='Arthur Dent'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>
      </form>
    </div>
  );
}
