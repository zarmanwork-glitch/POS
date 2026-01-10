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
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchableDropdown } from '@/components/page-component/SearchableDropdown';

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

  const handleSelectCustomer = (customer: Customer) => {
    const id = customer.id || customer._id || '';
    formik.setFieldValue('customer_id', id);
    setSelectedCustomer(customer);
    setCustomerSearch('');
    setCustomerFocused(false);
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    formik.setFieldValue('customer_id', '');
    setCustomerSearch('');
  };

  const customerOptionsForDropdown: any[] = customerOptions.map((c) => ({
    value: c.id || c._id || '',
    displayText: c.companyName || c.displayName || c.name || c.customerNumber,
    description: [c.email, c.phoneNumber].filter(Boolean).join(' • '),
    original: c,
  }));

  const displayName =
    selectedCustomer?.companyName ||
    selectedCustomer?.displayName ||
    selectedCustomer?.name ||
    selectedCustomer?.customerNumber;

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

      {/* SearchableDropdown for customer selection */}
      <SearchableDropdown
        label={t('invoices.form.selectCustomer') || 'Choose Customer'}
        placeholder={t('invoices.form.searchCustomer') || 'Search customer...'}
        value={formik.values.customer_id || ''}
        searchValue={customerSearch}
        isOpen={customerFocused}
        options={customerOptionsForDropdown}
        onSearchChange={setCustomerSearch}
        onFocus={() => setCustomerFocused(true)}
        onBlur={() => setTimeout(() => setCustomerFocused(false), 150)}
        onSelect={(option) => {
          const originalCustomer = customerOptions.find(
            (c) => (c.id || c._id) === option.value
          );
          if (originalCustomer) {
            handleSelectCustomer(originalCustomer);
          }
        }}
        onClear={handleClear}
        error={String(formik.errors.customer_id)}
        touched={formik.touched.customer_id}
        isSelected={!!selectedCustomer}
        selectedDisplayValue={displayName}
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

      {/* Customer Details Display */}
      {selectedCustomer && (
        <div className='border border-gray-200 rounded-lg overflow-hidden'>
          <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
            <span className='text-sm text-gray-700 font-medium'>
              {t('invoices.form.selectCustomer')}:{' '}
              <span className='text-red-500'>*</span>
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-700'>{displayName}</span>
              <button
                type='button'
                onClick={handleClear}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='p-4 space-y-3'>
            <div>
              <Label className='text-xs text-gray-600 font-medium mb-2'>
                {t('invoices.form.identification')}
              </Label>
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  placeholder={t('invoices.form.identificationType')}
                  className='text-xs bg-blue-50'
                />
                <Input
                  placeholder={t('invoices.form.identificationNumber')}
                  className='text-xs bg-blue-50'
                />
              </div>
            </div>

            <div className='border border-gray-200 rounded-md overflow-hidden text-xs'>
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
        </div>
      )}
    </div>
  );
}
