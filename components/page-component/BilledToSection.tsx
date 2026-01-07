'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Customer {
  id?: string;
  _id?: string;
  companyName?: string;
  displayName?: string;
  name?: string;
  customerNumber?: string;
  address?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  cin?: string;
  vatGstNumber?: string;
}

interface BilledToSectionProps {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  customerSearch: string;
  setCustomerSearch: (search: string) => void;
  customerFocused: boolean;
  setCustomerFocused: (focused: boolean) => void;
  customerOptions: Customer[];
  filteredCustomerOptions: Customer[];
  formik: any;
  t: (key: string) => string;
}

export default function BilledToSection({
  selectedCustomer,
  setSelectedCustomer,
  customerSearch,
  setCustomerSearch,
  customerFocused,
  setCustomerFocused,
  customerOptions,
  filteredCustomerOptions,
  formik,
  t,
}: BilledToSectionProps) {
  const router = useRouter();

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='mb-3'>
          <h3 className='text-sm font-semibold text-gray-700'>
            {t('invoices.form.selectedCustomer')}
          </h3>
          <span className='text-xs text-gray-400'>
            {t('invoices.form.selectCustomer')}
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

      {selectedCustomer && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-sm text-gray-700 font-medium'>
              {t('invoices.form.selectCustomer')}:{' '}
              <span className='text-red-500'>*</span>
            </span>
            <div className='flex items-center gap-2 bg-white border rounded px-2 py-1'>
              <span className='text-sm text-gray-700'>
                {selectedCustomer.companyName ||
                  selectedCustomer.displayName ||
                  selectedCustomer.name ||
                  selectedCustomer.customerNumber}
              </span>
              <button
                type='button'
                onClick={() => {
                  setSelectedCustomer(null);
                  formik.setFieldValue('customer_id', '');
                }}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='mb-3'>
            <div className='text-xs text-gray-600 font-medium mb-2'>
              {t('invoices.form.identification')}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Input
                placeholder={t('invoices.form.identificationType')}
                className='text-xs bg-gray-100'
              />
              <Input
                placeholder={t('invoices.form.identificationNumber')}
                className='text-xs bg-gray-100'
              />
            </div>
          </div>

          <div className='mt-2 border border-gray-200 rounded-md overflow-hidden text-xs'>
            {(() => {
              const rows = [
                {
                  label: t('invoices.form.name'),
                  value: selectedCustomer.name || '-',
                },
                {
                  label: t('invoices.form.companyName'),
                  value: selectedCustomer.companyName || '-',
                },
                {
                  label: t('invoices.form.address'),
                  value: selectedCustomer.address || '-',
                },
                {
                  label: t('invoices.form.country'),
                  value: selectedCustomer.country || '-',
                },
                {
                  label: t('invoices.form.phone'),
                  value: selectedCustomer.phoneNumber || '-',
                },
                {
                  label: t('invoices.form.email'),
                  value: selectedCustomer.email || '-',
                },
                {
                  label: t('invoices.form.cr'),
                  value: selectedCustomer.cin || '-',
                },
                {
                  label: t('invoices.form.vatNo'),
                  value: selectedCustomer.vatGstNumber || '-',
                },
              ];

              return (
                <div className='divide-y divide-gray-200'>
                  {rows.map((r, i) => (
                    <div
                      key={i}
                      className={`flex items-start px-4 py-3 ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className='w-1/3 text-gray-600 font-medium'>
                        {r.label}:
                      </div>
                      <div className='w-2/3 text-gray-700 whitespace-pre-wrap'>
                        {r.value}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {!selectedCustomer && (
        <div className='relative space-y-1'>
          <Label
            htmlFor='business-detail'
            className='text-sm font-medium text-gray-500'
          >
            Choose Customer: <span className='text-red-500'>*</span>
          </Label>
          <Input
            className='bg-blue-50 h-10 pr-10'
            placeholder={t('invoices.form.searchCustomer')}
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            onFocus={() => setCustomerFocused(true)}
            onBlur={() => setTimeout(() => setCustomerFocused(false), 200)}
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

          {customerFocused &&
            (customerSearch
              ? filteredCustomerOptions.length > 0
              : customerOptions.length > 0) && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                {(customerSearch
                  ? filteredCustomerOptions
                  : customerOptions
                ).map((c) => {
                  const id = c.id || c._id || '';
                  const primary =
                    c.companyName ||
                    c.displayName ||
                    c.name ||
                    c.customerNumber ||
                    id;
                  const secondary = [c.email || c.phoneNumber]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <button
                      key={id}
                      type='button'
                      onClick={() => {
                        formik.setFieldValue('customer_id', id);
                        setSelectedCustomer(c);
                        setCustomerSearch('');
                        setCustomerFocused(false);
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
          {customerFocused &&
            customerSearch &&
            filteredCustomerOptions.length === 0 && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
                {t('invoices.form.noResultsFound')}
              </div>
            )}
        </div>
      )}
      {formik.touched.customer_id && formik.errors.customer_id ? (
        <div className='text-sm text-red-500'>
          {String(formik.errors.customer_id)}
        </div>
      ) : null}
    </div>
  );
}
