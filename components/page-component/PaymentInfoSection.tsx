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

interface BankDetail {
  id?: string;
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  beneficiaryName?: string;
  country?: string;
  swiftCode?: string;
  iban?: string;
}

interface PaymentInfoSectionProps {
  selectedBank: BankDetail | null;
  setSelectedBank: (bank: BankDetail | null) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  bankFocused: boolean;
  setBankFocused: (focused: boolean) => void;
  bankOptions: BankDetail[];
  filteredBankOptions: BankDetail[];
  formik: any;
  t: (key: string) => string;
}

export default function PaymentInfoSection({
  selectedBank,
  setSelectedBank,
  bankSearch,
  setBankSearch,
  bankFocused,
  setBankFocused,
  bankOptions,
  filteredBankOptions,
  formik,
  t,
}: PaymentInfoSectionProps) {
  const router = useRouter();

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='mb-3'>
          <h3 className='text-sm font-semibold text-gray-700'>
            {t('invoices.form.selectedPaymentDetails')}
          </h3>
          <span className='text-xs text-gray-400'>
            {t('invoices.form.selectPaymentDetails')}
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

      {selectedBank && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-sm text-gray-700 font-medium'>
              {t('invoices.form.selectPaymentDetails')}:
            </span>
            <div className='flex items-center gap-2 bg-white border rounded px-2 py-1'>
              <span className='text-sm text-gray-700'>
                {selectedBank.bankName || selectedBank.accountNumber || 'Bank'}
              </span>
              <button
                type='button'
                onClick={() => {
                  setSelectedBank(null);
                  formik.setFieldValue('bank_detail_id', '');
                }}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='mt-2 border border-gray-200 rounded-md overflow-hidden text-xs'>
            {(() => {
              const rows = [
                {
                  label: t('invoices.form.bankName'),
                  value: selectedBank.bankName || '-',
                },
                {
                  label: t('invoices.form.beneficiaryName'),
                  value: selectedBank.beneficiaryName || '-',
                },
                {
                  label: t('invoices.form.accountNumber') || 'Account',
                  value: selectedBank.accountNumber || '-',
                },
                {
                  label: t('invoices.form.country'),
                  value: selectedBank.country || '-',
                },
                {
                  label: t('invoices.form.swiftCode'),
                  value: selectedBank.swiftCode || '-',
                },
                { label: 'IBAN', value: selectedBank.iban || '-' },
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

      {!selectedBank && (
        <div className='relative space-y-1'>
          <Label
            htmlFor='payment'
            className='text-sm font-medium text-gray-500'
          >
            Payment Profile:<span className='text-red-500'>*</span>
          </Label>
          <Input
            className='bg-blue-50 h-10 pr-10'
            placeholder={t('invoices.form.searchBank')}
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            onFocus={() => setBankFocused(true)}
            onBlur={() => setTimeout(() => setBankFocused(false), 200)}
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />

          {bankFocused &&
            (bankSearch
              ? filteredBankOptions.length > 0
              : bankOptions.length > 0) && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto'>
                {(bankSearch ? filteredBankOptions : bankOptions).map((b) => {
                  const id = b.id || b._id || '';
                  const primary = b.bankName || b.accountNumber || id;
                  const secondary = [
                    b.accountNumber && b.accountNumber !== primary
                      ? b.accountNumber
                      : null,
                    b.country,
                  ]
                    .filter(Boolean)
                    .join(' • ');

                  return (
                    <button
                      key={id}
                      type='button'
                      onClick={() => {
                        setSelectedBank(b);
                        formik.setFieldValue('bank_detail_id', id);
                        setBankSearch('');
                        setBankFocused(false);
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
          {bankFocused && bankSearch && filteredBankOptions.length === 0 && (
            <div className='absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 px-4 py-2 text-sm text-gray-500'>
              {t('invoices.form.noResultsFound')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
