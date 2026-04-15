'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { InvoiceFormHeaderProps } from '@/types/componentTypes';

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
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold'>
        <span className='text-blue-600'>{documentLabel}</span>
        <span className='text-gray-800'> | {createLabel}</span>
      </h2>
      <div
        className={`flex gap-3 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Button
          variant='outline'
          onClick={onCancel}
          className='flex-1 sm:flex-initial'
        >
          {cancelLabel}
        </Button>
        <Button
          type='button'
          className='gradient-brand hover:opacity-90 transition-opacity flex-1 sm:flex-initial shadow-md shadow-blue-600/20'
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
