'use client';

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
import { Upload } from 'lucide-react';
import Image from 'next/image';
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

export default function BusinessDetailsFormPage() {
  const [formData, setFormData] = useState({
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
    branches: '',
    refundPolicy: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, isVatRegistered: value }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, logo);
  };

  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
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
      branches: '',
      refundPolicy: '',
    });
    setLogo(null);
    setLogoPreview('');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Profiles</span>
          <span className='text-gray-800'> | Add Business Details</span>
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
        {/* Basic Information */}
        {/* Basic Information Heading */}
        <div className='border-t-2 border-blue-100 pt-4'>
          <h3 className='text-lg font-semibold text-blue-400'>
            BASIC INFORMATION
          </h3>
        </div>

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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='John Doe'
                  className='bg-blue-50 h-10 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Company Name: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='companyName'
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder='Specify Company Name'
                  className='bg-blue-50 h-10 py-2'
                />
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='name@domain.com'
                  className='bg-blue-50 h-10 py-2'
                />
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
                  <Input
                    type='tel'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder='Phone number'
                    className='flex-1 bg-blue-50 h-10 py-2'
                  />
                </div>
              </div>
            </div>

            {/* Company Name in Local Language */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Company Name in Local Language:
              </label>
              <Input
                type='text'
                name='companyNameLocal'
                value={formData.companyNameLocal}
                onChange={handleChange}
                placeholder='Company name'
                className='bg-blue-50 h-10 py-2'
              />
            </div>
          </div>

          {/* Right Column - Logo Upload */}
          <Card className='border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center min-h-30 bg-blue-50'>
            <label className='w-full h-full flex flex-col items-center justify-center cursor-pointer gap-3'>
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt='Logo preview'
                  className='w-full h-full object-contain'
                />
              ) : (
                <>
                  <div className='text-4xl font-bold text-gray-300'>LOGO</div>
                  <Upload className='h-8 w-8 text-gray-400' />
                  <p className='text-center text-gray-400 text-sm'>
                    Drag and drop an image or click here to select one
                  </p>
                </>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleLogoChange}
                className='hidden'
              />
            </label>
          </Card>
        </div>

        {/* VAT Registration Heading */}
        <div className='border-t-2 border-blue-100 pt-4'>
          <h3 className='text-lg font-semibold text-blue-400'>VAT Info</h3>
        </div>

        {/* VAT Registration */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Is your company Saudi Arabia VAT registered?:{' '}
            <span className='text-red-500'>*</span>
          </label>
          <div className='flex gap-6'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='isVatRegistered'
                value='yes'
                checked={formData.isVatRegistered === 'yes'}
                onChange={(e) => handleRadioChange(e.target.value)}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>Yes</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='isVatRegistered'
                value='no'
                checked={formData.isVatRegistered === 'no'}
                onChange={(e) => handleRadioChange(e.target.value)}
                className='w-4 h-4'
              />
              <span className='text-gray-700'>No</span>
            </label>
          </div>
        </div>

        {/* VAT Registration Section */}
        {formData.isVatRegistered === 'yes' && (
          <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
            <p className='text-sm text-gray-600 mb-4'>
              For Saudi VAT registered companies, either the VAT number or Group
              VAT Number is mandatory. The combination of the Company
              Registration number and the VAT/Group VAT Number must be unique
              for each business profile.
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
                  value={formData.companyRegistrationNumber}
                  onChange={handleChange}
                  placeholder='Specify Company Reg Number'
                  className='bg-blue-50 h-10 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  VAT No: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='vatNumber'
                  value={formData.vatNumber}
                  onChange={handleChange}
                  placeholder='VAT Number'
                  className='bg-blue-50 h-10 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Group VAT No:
                </label>
                <Input
                  type='text'
                  name='groupVatNumber'
                  value={formData.groupVatNumber}
                  onChange={handleChange}
                  placeholder='Not Available'
                  className='bg-blue-50 h-10 py-2'
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Section */}
        {formData.isVatRegistered === 'no' && (
          <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
            <h3 className='text-sm font-semibold text-gray-700 mb-4'>
              ADDITIONAL INFO
            </h3>
            <p className='text-xs text-gray-600 mb-4'>
              For Non-KSA VAT number select ID type - 'Others'
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Identification: <span className='text-red-500'>*</span>
                </label>
                <Select
                  value={formData.identificationType}
                  onValueChange={(value) => setFormData((prev) => ({}))}
                >
                  <SelectTrigger className='bg-blue-50 h-10 py-2'>
                    <SelectValue placeholder='Identification Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='passport'>
                      Commercial registration number
                    </SelectItem>
                    <SelectItem value='nationalId'>Momra license</SelectItem>
                    <SelectItem value='businessLicense'>
                      MLSD license
                    </SelectItem>
                    <SelectItem value='others'>Sagia license</SelectItem>
                    <SelectItem value='others'>
                      Ministry if justice license
                    </SelectItem>
                    <SelectItem value='others'>Other ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Identification Number: <span className='text-red-500'>*</span>
                </label>
                <Input
                  type='text'
                  name='identificationNumber'
                  value={formData.identificationNumber}
                  onChange={handleChange}
                  placeholder='Identification Number'
                  className='bg-blue-50 h-10 py-2'
                />
              </div>
            </div>
          </div>
        )}

        {/* Address Section */}
        <div className='border-t-2 border-blue-100 pt-4'>
          <h3 className='text-lg font-semibold text-blue-400'>ADDRESS</h3>
        </div>

        {/* Address Streets */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Address Street:
            </label>
            <Input
              type='text'
              name='addressStreet'
              value={formData.addressStreet}
              onChange={handleChange}
              placeholder='Address 1'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Address Street (Additional):
            </label>
            <Input
              type='text'
              name='addressStreetAdditional'
              value={formData.addressStreetAdditional}
              onChange={handleChange}
              placeholder='Address 2'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Building Number: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='buildingNumber'
              value={formData.buildingNumber}
              onChange={handleChange}
              placeholder='Number'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* Country, Province, City */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Country: <span className='text-red-500'>*</span>
            </label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, country: value }))
              }
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
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Province/State:
            </label>
            <Input
              type='text'
              name='province'
              value={formData.province}
              onChange={handleChange}
              placeholder='Province/State'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              City: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='city'
              value={formData.city}
              onChange={handleChange}
              placeholder='City'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* District, Postal Code, Additional Number */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              District/Neighborhood: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='district'
              value={formData.district}
              onChange={handleChange}
              placeholder='District'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Postal Code: <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='postalCode'
              value={formData.postalCode}
              onChange={handleChange}
              placeholder='Code'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Additional Number:
            </label>
            <Input
              type='text'
              name='additionalNumber'
              value={formData.additionalNumber}
              onChange={handleChange}
              placeholder='Number'
              className='bg-blue-50 h-10 py-2'
            />
          </div>
        </div>

        {/* Address in Local Language */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Address in Local Language:
          </label>
          <textarea
            name='addressLocal'
            value={formData.addressLocal}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                addressLocal: e.target.value,
              }))
            }
            placeholder='Address in Local Language'
            className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={4}
          />
        </div>

        {/* Company Branches Section */}
        <div className='border-t-2 border-blue-100 pt-4 pb-4'>
          <h3 className='text-lg font-semibold text-blue-400'>
            COMPANY BRANCHES
          </h3>
        </div>

        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Branches provide fine-grain control over how invoices are created
            and help manage multiple teams across various locations. Begin by
            adding one or more branch names. Next, link those branches to
            specific permissions (check teams/permissions). This setup allows
            you to restrict access to specific resources through teams.
          </p>
          <Select
            value={formData.branches}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, branches: value }))
            }
          >
            <SelectTrigger className='bg-blue-50 h-10 py-2'>
              <SelectValue placeholder='Select...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='branch1'>Branch 1</SelectItem>
              <SelectItem value='branch2'>Branch 2</SelectItem>
              <SelectItem value='branch3'>Branch 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refund Policy Section */}
        <div className='border-t-2 border-blue-100 pt-4 pb-4'>
          <h3 className='text-lg font-semibold text-blue-400'>REFUND POLICY</h3>
        </div>

        <div>
          <textarea
            name='refundPolicy'
            value={formData.refundPolicy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                refundPolicy: e.target.value,
              }))
            }
            placeholder='Enter your refund policy details'
            className='w-full p-3 border border-gray-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows={4}
          />
        </div>
      </form>
    </div>
  );
}
