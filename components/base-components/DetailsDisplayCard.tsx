'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export interface DetailRow {
  label: string;
  value: string | undefined;
}

interface DetailsDisplayCardProps {
  title: string;
  displayName: string | undefined;
  onClear: () => void;
  detailRows: DetailRow[];
  showIdentification?: boolean;
  identificationLabel?: string;
  identificationTypePlaceholder?: string;
  identificationNumberPlaceholder?: string;
}

export function DetailsDisplayCard({
  title,
  displayName,
  onClear,
  detailRows,
  showIdentification = false,
  identificationLabel,
  identificationTypePlaceholder,
  identificationNumberPlaceholder,
}: DetailsDisplayCardProps) {
  return (
    <div className='border border-gray-200 rounded-lg overflow-hidden'>
      <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
        <span className='text-sm text-gray-700 font-medium'>
          {title}
          <span className='text-red-500 ml-1'>*</span>
        </span>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-700'>{displayName}</span>
          <button
            type='button'
            onClick={onClear}
            className='text-gray-400 hover:text-gray-600'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='p-4 space-y-3'>
        {showIdentification && (
          <div>
            <Label className='text-xs text-gray-600 font-medium mb-2'>
              {identificationLabel}
            </Label>
            <div className='grid grid-cols-2 gap-2'>
              <Input
                placeholder={identificationTypePlaceholder}
                className='text-xs bg-blue-50'
              />
              <Input
                placeholder={identificationNumberPlaceholder}
                className='text-xs bg-blue-50'
              />
            </div>
          </div>
        )}

        <div className='border border-gray-200 rounded-md overflow-hidden text-xs'>
          <div className='divide-y divide-gray-200'>
            {detailRows.map((row, i) => (
              <div
                key={i}
                className={`flex items-start px-4 py-3 ${
                  i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className='w-1/3 text-gray-600 font-medium'>
                  {row.label}:
                </div>
                <div className='w-2/3 text-gray-700 whitespace-pre-wrap'>
                  {row.value || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
