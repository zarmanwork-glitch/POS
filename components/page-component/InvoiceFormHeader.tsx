'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

interface InvoiceFormHeaderProps {
  isLoading: boolean;
  isRTL: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  cancelLabel: string;
  saveLabel: string;
  documentLabel: string;
  createLabel: string;
}

export function InvoiceFormHeader({
  isLoading,
  isRTL,
  onSubmit,
  onCancel,
  cancelLabel,
  saveLabel,
  documentLabel,
  createLabel,
}: InvoiceFormHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-3xl font-bold'>
        <span className='text-blue-600'>{documentLabel}</span>
        <span className='text-gray-800'>| {createLabel}</span>
      </h2>
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant='outline'
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type='button'
          className='bg-blue-600 hover:bg-blue-700'
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <Spinner className='h-4 w-4 text-white' />
              <span>{saveLabel}</span>
            </div>
          ) : (
            saveLabel
          )}
        </Button>
      </div>
    </div>
  );
}
