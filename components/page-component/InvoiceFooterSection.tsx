'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FormikProps } from 'formik';

interface InvoiceFooterSectionProps {
  formik: FormikProps<any>;
  invoiceTotal: number;
  t: (key: string) => string;
}

/**
 * Convert number to words in English
 */
const numberToWords = (num: number): string => {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  if (num === 0) return 'Zero';

  const parts: string[] = [];
  let scaleIndex = 0;

  while (num > 0) {
    const part = num % 1000;
    if (part !== 0) {
      let partWords = '';

      const hundreds = Math.floor(part / 100);
      if (hundreds > 0) {
        partWords += ones[hundreds] + ' Hundred ';
      }

      const remainder = part % 100;
      if (remainder >= 20) {
        partWords += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) {
          partWords += ' ' + ones[remainder % 10];
        }
      } else if (remainder > 0) {
        partWords += ones[remainder];
      }

      if (scales[scaleIndex]) {
        partWords += ' ' + scales[scaleIndex];
      }

      parts.unshift(partWords.trim());
    }

    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return parts.join(' ').trim();
};

export default function InvoiceFooterSection({
  formik,
  invoiceTotal,
  t,
}: InvoiceFooterSectionProps) {
  const totalInWords = numberToWords(Math.floor(invoiceTotal));
  const cents = Math.round((invoiceTotal % 1) * 100);

  return (
    <div className='space-y-6'>
      {/* Total Amount in Words */}
      <div>
        <Label className='text-sm font-semibold text-gray-700'>
          {t('invoices.form.totalAmountInWords')}
        </Label>
        <Textarea
          className='bg-blue-50 mt-2'
          placeholder={t('invoices.form.amountInWordsPlaceholder')}
          value={
            cents > 0
              ? `SAR - ${totalInWords} and ${cents}`
              : `SAR - ${totalInWords}`
          }
          readOnly
        />
        <p className='text-xs text-gray-500 mt-2'>
          {t('invoices.form.amountInWordsDisclaimer')}
        </p>
      </div>

      {/* Notes */}
      <div>
        <Label
          htmlFor='notes'
          className='text-sm font-semibold text-gray-700'
        >
          {t('invoices.form.notesLabel')}
        </Label>
        <Textarea
          id='notes'
          className='bg-blue-50 mt-2 '
          placeholder={t('invoices.form.additionalNotesPlaceholder')}
          name='notes'
          value={formik.values.notes || ''}
          onChange={formik.handleChange}
        />
      </div>

      {/* Amount Paid to Date */}
      <div>
        <Label
          htmlFor='amountPaidToDate'
          className='text-sm font-semibold text-gray-700'
        >
          {t('invoices.form.amountPaidToDate')}
        </Label>
        <Input
          id='amountPaidToDate'
          type='number'
          className='bg-blue-50 mt-2 h-10 w-2/12'
          placeholder='0'
          name='amountPaidToDate'
          value={formik.values.amountPaidToDate || 0}
          onChange={formik.handleChange}
        />
      </div>
    </div>
  );
}
