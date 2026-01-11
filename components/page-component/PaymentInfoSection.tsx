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
import { useRouter } from 'next/navigation';
import { SearchableDropdown } from '@/components/page-component/SearchableDropdown';
import { DetailsDisplayCard } from '@/components/base-components/DetailsDisplayCard';

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

  const handleSelectBank = (bank: BankDetail) => {
    const id = bank.id || bank._id || '';
    formik.setFieldValue('bank_detail_id', id);
    setSelectedBank(bank);
    setBankSearch('');
    setBankFocused(false);
  };

  const handleClear = () => {
    setSelectedBank(null);
    formik.setFieldValue('bank_detail_id', '');
    setBankSearch('');
  };

  const bankOptionsForDropdown: any[] = bankOptions.map((b) => ({
    value: b.id || b._id || '',
    displayText: b.bankName || b.accountNumber,
    description: [
      b.accountNumber && b.accountNumber !== (b.bankName || b.accountNumber)
        ? b.accountNumber
        : null,
      b.country,
    ]
      .filter(Boolean)
      .join(' • '),
    original: b,
  }));

  const displayName =
    selectedBank?.bankName || selectedBank?.accountNumber || 'Bank';

  const bankDetailRows = [
    { label: t('invoices.form.bankName'), value: selectedBank?.bankName },
    {
      label: t('invoices.form.beneficiaryName'),
      value: selectedBank?.beneficiaryName,
    },
    {
      label: t('invoices.form.accountNumber') || 'Account',
      value: selectedBank?.accountNumber,
    },
    { label: t('invoices.form.country'), value: selectedBank?.country },
    { label: t('invoices.form.swiftCode'), value: selectedBank?.swiftCode },
    { label: 'IBAN', value: selectedBank?.iban },
  ];

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

      {/* SearchableDropdown for bank selection */}
      <SearchableDropdown
        label={t('invoices.form.selectPaymentDetails') || 'Payment Profile'}
        placeholder={t('invoices.form.searchBank') || 'Search bank...'}
        value={formik.values.bank_detail_id || ''}
        searchValue={bankSearch}
        isOpen={bankFocused}
        options={bankOptionsForDropdown}
        onSearchChange={setBankSearch}
        onFocus={() => setBankFocused(true)}
        onBlur={() => setTimeout(() => setBankFocused(false), 150)}
        onSelect={(option) => {
          const originalBank = bankOptions.find(
            (b) => (b.id || b._id) === option.value
          );
          if (originalBank) {
            handleSelectBank(originalBank);
          }
        }}
        onClear={handleClear}
        error={
          formik.errors.bank_detail_id
            ? t(String(formik.errors.bank_detail_id))
            : undefined
        }
        touched={formik.touched.bank_detail_id}
        isSelected={!!selectedBank}
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

      {/* Bank Details Display */}
      {selectedBank && (
        <DetailsDisplayCard
          title={t('invoices.form.selectPaymentDetails')}
          displayName={displayName}
          onClear={handleClear}
          detailRows={bankDetailRows}
          showIdentification={false}
        />
      )}
    </div>
  );
}
