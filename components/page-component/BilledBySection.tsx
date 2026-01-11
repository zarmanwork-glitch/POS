'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SearchableDropdown } from '@/components/page-component/SearchableDropdown';

interface BusinessDetail {
  id?: string;
  _id?: string;
  companyName?: string;
  displayName?: string;
  name?: string;
  identificationType?: string;
  identificationNumber?: string;
  address?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  cr?: string;
  vatGstNumber?: string;
  momraLicense?: string;
  isSaudiVatRegistered?: boolean;
}

interface BilledBySectionProps {
  selectedBusinessDetails: BusinessDetail | null;
  setSelectedBusinessDetails: (details: BusinessDetail | null) => void;
  businessSearch: string;
  setBusinessSearch: (search: string) => void;
  businessFocused: boolean;
  setBusinessFocused: (focused: boolean) => void;
  businessOptions: BusinessDetail[];
  filteredBusinessOptions: BusinessDetail[];
  formik: any;
  t: (key: string) => string;
}

export default function BilledBySection({
  selectedBusinessDetails,
  setSelectedBusinessDetails,
  businessSearch,
  setBusinessSearch,
  businessFocused,
  setBusinessFocused,
  businessOptions,
  filteredBusinessOptions,
  formik,
  t,
}: BilledBySectionProps) {
  const router = useRouter();

  const handleSelectBusiness = (business: BusinessDetail) => {
    const id = business.id || business._id || '';
    formik.setFieldValue('business_detail_id', id);
    setSelectedBusinessDetails(business);
    setBusinessSearch('');
    setBusinessFocused(false);
  };

  const handleClear = () => {
    setSelectedBusinessDetails(null);
    formik.setFieldValue('business_detail_id', '');
    setBusinessSearch('');
  };

  const displayName =
    selectedBusinessDetails?.companyName ||
    selectedBusinessDetails?.displayName ||
    selectedBusinessDetails?.name;

  const displaySecondary = [
    selectedBusinessDetails?.email,
    selectedBusinessDetails?.phoneNumber,
  ]
    .filter(Boolean)
    .join(' | ');

  const businessOptionsForDropdown: any[] = businessOptions.map((b) => ({
    value: b.id || b._id || '',
    displayText: b.companyName || b.displayName || b.name,
    description: [b.email, b.phoneNumber].filter(Boolean).join(' • '),
    original: b,
  }));

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-sm font-semibold text-gray-700'>
            {t('invoices.form.selectedBusinessDetails')}
          </h3>
          <span className='text-xs text-gray-400'>VENDOR INFO</span>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='mb-3 bg-transparent text-blue-600 hover:bg-transparent hover:text-blue-700'
            >
              Add
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Redirect</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to leave this page? You may lose any
                unsaved changes.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className='text-blue-600'>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => router.push('/your-target-route')}
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                Yes, redirect me
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Business Details Section with SearchableDropdown */}
      <SearchableDropdown
        label={t('invoices.form.businessDetails') || 'Business Details'}
        placeholder={t('invoices.form.searchBusiness') || 'Search business...'}
        value={formik.values.business_detail_id || ''}
        searchValue={businessSearch}
        isOpen={businessFocused}
        options={businessOptionsForDropdown}
        onSearchChange={setBusinessSearch}
        onFocus={() => setBusinessFocused(true)}
        onBlur={() => setTimeout(() => setBusinessFocused(false), 150)}
        onSelect={(option) => {
          const originalBusiness = businessOptions.find(
            (b) => (b.id || b._id) === option.value
          );
          if (originalBusiness) {
            handleSelectBusiness(originalBusiness);
          }
        }}
        onClear={handleClear}
        error={
          formik.errors.business_detail_id
            ? t(String(formik.errors.business_detail_id))
            : undefined
        }
        touched={formik.touched.business_detail_id}
        isSelected={!!selectedBusinessDetails}
        selectedDisplayValue={
          displayName + (displaySecondary ? ` | ${displaySecondary}` : '')
        }
        renderOption={(option) => (
          <div>
            <span className='font-bold'>{option.displayText}</span>
            {option.description && (
              <div className='text-gray-500 text-xs mt-0.5'>
                {option.description}
              </div>
            )}
          </div>
        )}
      />

      {/* Business Details Display Table */}
      {selectedBusinessDetails && (
        <div className='border border-gray-200 rounded-md overflow-hidden'>
          <div className='divide-y divide-gray-200'>
            {(() => {
              const rows = [
                {
                  label: t('invoices.form.name'),
                  value: selectedBusinessDetails.name,
                },
                {
                  label: t('invoices.form.companyName'),
                  value: selectedBusinessDetails.companyName,
                },
                {
                  label: t('invoices.form.address'),
                  value: selectedBusinessDetails.address,
                },
                {
                  label: t('invoices.form.country'),
                  value: selectedBusinessDetails.country,
                },
                {
                  label: t('invoices.form.phone'),
                  value: selectedBusinessDetails.phoneNumber,
                },
                {
                  label: t('invoices.form.email'),
                  value: selectedBusinessDetails.email,
                },
                {
                  label: t('invoices.form.cr'),
                  value: selectedBusinessDetails.cr,
                },
                {
                  label: t('invoices.form.vatNo'),
                  value: selectedBusinessDetails.vatGstNumber,
                },
              ];

              if (selectedBusinessDetails.momraLicense) {
                rows.push({
                  label: t('invoices.form.momraLicense'),
                  value: selectedBusinessDetails.momraLicense,
                });
              }

              if (selectedBusinessDetails.isSaudiVatRegistered !== undefined) {
                rows.push({
                  label: t('invoices.form.isSaudiVatRegistered'),
                  value: selectedBusinessDetails.isSaudiVatRegistered
                    ? t('invoices.form.yes')
                    : t('invoices.form.no'),
                });
              }

              return rows.map((row, index) => (
                <div
                  key={index}
                  className={`flex items-start px-4 py-3 text-sm ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className='w-1/3 text-gray-600 font-medium'>
                    {row.label}:
                  </div>
                  <div className='w-2/3 text-gray-700 break-words'>
                    {row.value || '-'}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
