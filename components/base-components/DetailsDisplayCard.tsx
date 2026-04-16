'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import { DetailRow, DetailsDisplayCardProps } from '@/types/componentTypes';

export type { DetailRow };

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
    <Card className='overflow-hidden'>
      <CardHeader className='bg-gray-50 px-4 py-3 flex flex-row items-center justify-between space-y-0'>
        <span className='text-sm text-gray-700 font-medium'>
          {title}
          <span className='text-red-500 ml-1'>*</span>
        </span>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-700'>{displayName}</span>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-gray-400 hover:text-gray-600'
            onClick={onClear}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className='p-4 space-y-3'>
        {showIdentification && (
          <div>
            <Label className='text-xs text-gray-600 font-medium mb-2'>
              {identificationLabel}
            </Label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
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
          <Table>
            <TableBody>
              {detailRows.map((row, i) => (
                <TableRow
                  key={i}
                  className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <TableCell className='w-1/3 text-gray-600 font-medium py-3'>
                    {row.label}:
                  </TableCell>
                  <TableCell className='w-2/3 text-gray-700 whitespace-pre-wrap py-3'>
                    {row.value || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
