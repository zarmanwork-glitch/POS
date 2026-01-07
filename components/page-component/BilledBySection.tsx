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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';

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

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='mb-3'>
          <h3 className='text-sm font-semibold text-gray-700'>
            {t('invoices.form.selectedBusinessDetails')}
          </h3>
          <span className='text-xs text-gray-400'>
            {t('invoices.form.selectBusinessDetails')}
          </span>
        </div>
        <div>
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
      </div>

      {selectedBusinessDetails && (
        <Card className='mb-4 border-none bg-transparent shadow-none'>
          <CardHeader className='pb-3 px-0'>
            <CardTitle className='text-sm font-medium flex items-center gap-2'>
              {t('invoices.form.selectBusinessDetails')}
              <span className='text-red-500'>*</span>

              <Badge
                variant='outline'
                className='flex items-center gap-2 bg-transparent border-muted'
              >
                <span className='text-foreground text-sm'>
                  {selectedBusinessDetails.companyName ||
                    selectedBusinessDetails.displayName ||
                    selectedBusinessDetails.name}
                </span>

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-4 w-4 text-muted-foreground hover:text-foreground'
                  onClick={() => {
                    setSelectedBusinessDetails(null);
                    formik.setFieldValue('business_detail_id', '');
                  }}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-4 px-0 text-xs'>
            <div>
              <div className='text-muted-foreground font-medium mb-2'>
                {t('invoices.form.identification')}
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Input
                  disabled
                  className='text-xs bg-muted/60 border-muted'
                  placeholder={t('invoices.form.identificationType')}
                  value={selectedBusinessDetails.identificationType || ''}
                />
                <Input
                  disabled
                  className='text-xs bg-muted/60 border-muted'
                  placeholder={t('invoices.form.identificationNumber')}
                  value={selectedBusinessDetails.identificationNumber || ''}
                />
              </div>
            </div>

            <div className='rounded-md overflow-hidden border border-muted'>
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

                if (
                  selectedBusinessDetails.isSaudiVatRegistered !== undefined
                ) {
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
                    className={`flex items-start text-xs px-3 py-2 ${
                      index % 2 === 0 ? 'bg-muted/60' : 'bg-muted/20'
                    }`}
                  >
                    <div className='w-[26%] font-medium bg-gray-200'>
                      {row.label}:
                    </div>

                    <div className='w-[74%] whitespace-pre-wrap  bg-gray-200'>
                      {row.value || '-'}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedBusinessDetails && (
        <div className='relative space-y-1'>
          <Label
            htmlFor='business-detail'
            className='text-sm font-medium text-gray-500'
          >
            Business Details:<span className='text-red-500'>*</span>
          </Label>
          <Input
            className='bg-blue-50 h-10 pr-10'
            placeholder={t('invoices.form.searchBusiness')}
            value={businessSearch}
            onChange={(e) => setBusinessSearch(e.target.value)}
            onFocus={() => setBusinessFocused(true)}
            onBlur={() => setTimeout(() => setBusinessFocused(false), 200)}
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

          {businessFocused &&
            (businessSearch
              ? filteredBusinessOptions.length > 0
              : businessOptions.length > 0) && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                {(businessSearch
                  ? filteredBusinessOptions
                  : businessOptions
                ).map((b) => {
                  const id = b.id || b._id || '';
                  const primary =
                    b.companyName || b.displayName || b.name || id;
                  const secondary = [b.email || b.phoneNumber]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <button
                      key={id}
                      type='button'
                      onClick={() => {
                        formik.setFieldValue('business_detail_id', id);
                        setSelectedBusinessDetails(b);
                        setBusinessSearch('');
                        setBusinessFocused(false);
                      }}
                      className='w-full text-left px-4 py-2 hover:bg-blue-50 border-b last:border-b-0'
                    >
                      <div className='text-sm font-medium text-gray-800'>
                        {primary}
                      </div>
                      {secondary && (
                        <div className='text-xs text-gray-500'>{secondary}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          {businessFocused &&
            businessSearch &&
            filteredBusinessOptions.length === 0 && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
                {t('invoices.form.noResultsFound')}
              </div>
            )}
        </div>
      )}
      {formik.touched.business_detail_id && formik.errors.business_detail_id ? (
        <div className='text-sm text-red-500'>
          {String(formik.errors.business_detail_id)}
        </div>
      ) : null}
    </div>
  );
}
