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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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
  const [selectOpen, setSelectOpen] = useState(false);
  const [identificationType, setIdentificationType] = useState(
    selectedBusinessDetails?.identificationType || ''
  );
  const [identificationNumber, setIdentificationNumber] = useState(
    selectedBusinessDetails?.identificationNumber || ''
  );

  const handleSelectChange = (value: string) => {
    const selected = businessOptions.find((b) => (b.id || b._id) === value);
    if (selected) {
      formik.setFieldValue('business_detail_id', value);
      setSelectedBusinessDetails(selected);
      setIdentificationType(selected.identificationType || '');
      setIdentificationNumber(selected.identificationNumber || '');
    }
    setSelectOpen(false);
  };

  const handleClear = () => {
    setSelectedBusinessDetails(null);
    formik.setFieldValue('business_detail_id', '');
    setIdentificationType('');
    setIdentificationNumber('');
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
              className='text-blue-600 hover:bg-blue-50'
            >
              {t('invoices.form.add') || 'Add'}
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push('/your-target-route')}
              >
                Yes, redirect me
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Business Details Section */}
      <div className='space-y-3'>
        <Label className='text-xs  text-gray-500'>
          Business Details: <span className='text-red-500'>*</span>
        </Label>

        {!selectedBusinessDetails ? (
          <div className='space-y-2'>
            <Select
              open={selectOpen}
              onOpenChange={setSelectOpen}
              value={formik.values.business_detail_id || ''}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className='bg-blue-50'>
                <SelectValue placeholder={t('invoices.form.searchBusiness')} />
              </SelectTrigger>

              <SelectContent>
                {businessOptions.map((b) => {
                  const id = b.id || b._id || '';
                  const primary =
                    b.companyName || b.displayName || b.name || id;
                  const secondary = [b.email || b.phoneNumber]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <SelectItem
                      key={id}
                      value={id}
                    >
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>{primary}</span>
                        {secondary && (
                          <span className='text-xs text-gray-500'>
                            {secondary}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {formik.touched.business_detail_id &&
            formik.errors.business_detail_id ? (
              <div className='text-sm text-red-500'>
                {String(formik.errors.business_detail_id)}
              </div>
            ) : null}
          </div>
        ) : (
          <div className='flex gap-2 items-center'>
            <Badge
              variant='secondary'
              className='bg-blue-50 text-gray-700 text-xs font-medium py-2 px-3'
            >
              <span>{displayName}</span>
              {displaySecondary && (
                <span className='text-gray-500 ml-2'>| {displaySecondary}</span>
              )}
              <button
                type='button'
                onClick={handleClear}
                className='ml-2 text-gray-400 hover:text-gray-600'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Identification Section */}
      {selectedBusinessDetails && (
        <div className='space-y-3'>
          <Label className='text-sm font-semibold text-gray-700'>
            Identification:
          </Label>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Input
                className='bg-blue-50 h-10 border-gray-200 text-sm'
                placeholder={t('invoices.form.identificationType') || 'Type'}
                value={identificationType}
                onChange={(e) => setIdentificationType(e.target.value)}
              />
            </div>
            <div>
              <Input
                className='bg-blue-50 h-10 border-gray-200 text-sm'
                placeholder={
                  t('invoices.form.identificationNumber') || 'Number'
                }
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      {selectedBusinessDetails && (
        <div className='border border-gray-200 rounded-md overflow-hidden'>
          <div className='divide-y divide-gray-200'>
            {(() => {
              const rows = [
                {
                  label:
                    t('invoices.form.identificationType') ||
                    'Identification Type',
                  value: identificationType,
                },
                {
                  label:
                    t('invoices.form.identificationNumber') ||
                    'Identification Number',
                  value: identificationNumber,
                },
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
                  <div className='w-2/3 text-gray-700 wrap-break-word'>
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
