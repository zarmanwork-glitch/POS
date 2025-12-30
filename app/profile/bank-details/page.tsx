'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function BankDetailsPage() {
  const { t } = useTranslation();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('profile.title')}</span>
          <span className='text-gray-800'> | {t('profile.bankDetails')}</span>
        </h2>
        <Link href='bank-details/bank-details-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            {t('profile.addBankDetails')}
          </Button>
        </Link>
      </div>

      {/* Description */}
      <p className='text-sm text-gray-600'>{t('profile.showingAll')}</p>

      {/* Empty State */}
      <div className='flex flex-col items-center justify-center min-h-96 bg-linear-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
          {t('profile.noDetailsAdded')}
        </h3>
        <p className='text-gray-600 text-center max-w-md'>
          {t('profile.noDetailsAddedDesc')}
        </p>
      </div>
    </div>
  );
}
