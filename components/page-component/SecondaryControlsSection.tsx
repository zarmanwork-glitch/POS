import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ToggleButton } from '@/components/base-components/ToggleButton';
import { paymentMeans } from '@/enums/paymentMeans';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SecondaryControlsSectionProps } from '@/types/paymentMeansTypes';

export default function SecondaryControlsSection({
  formik,
  t,
}: SecondaryControlsSectionProps) {
  const [paymentMeansOpen, setPaymentMeansOpen] = useState(false);

  return (
    <div className='space-y-4'>
      {/* Pre Payment Invoice Toggle */}
      <div className='flex items-center gap-3'>
        <ToggleButton
          value={formik.values.prePaymentInvoice}
          onChange={(value) => formik.setFieldValue('prePaymentInvoice', value)}
          optionA={{ value: true, label: t('invoices.form.yes') }}
          optionB={{ value: false, label: t('invoices.form.no') }}
          showStatusText={false}
          className='bg-transparent'
        />
        <Label className='text-sm text-gray-700'>
          {t('invoices.form.prePaymentInvoice')}:
        </Label>
        <p className='text-sm text-gray-600'>
          {formik.values.prePaymentInvoice
            ? t('invoices.form.yes')
            : t('invoices.form.no')}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Payment Terms */}
        <div>
          <Label htmlFor='paymentTerms' className='text-sm text-gray-700'>
            {t('invoices.form.paymentTermsLabel')}
          </Label>
          <Input
            id='paymentTerms'
            className='bg-blue-50 h-10 mt-2'
            placeholder={t('invoices.form.termsPlaceholder')}
            name='paymentTerms'
            value={formik.values.paymentTerms}
            onChange={formik.handleChange}
          />
        </div>

        {/* Payment Means */}
        <div>
          <Label htmlFor='paymentMeans' className='text-sm text-gray-700'>
            {t('invoices.form.paymentMeansLabel')}
          </Label>
          <Popover open={paymentMeansOpen} onOpenChange={setPaymentMeansOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={paymentMeansOpen}
                className='w-full justify-between bg-blue-50 h-10 mt-2 text-xs font-normal'
              >
                {formik.values.paymentMeans ? (
                  <span className='truncate'>
                    {formik.values.paymentMeans}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>
                    {t('invoices.form.searchByCode')}
                  </span>
                )}
                <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
              <Command>
                <CommandInput placeholder={t('invoices.form.searchByCode')} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {paymentMeans.map((pm) => (
                      <CommandItem
                        key={pm.value}
                        value={pm.value}
                        onSelect={() => {
                          formik.setFieldValue('paymentMeans', pm.value);
                          setPaymentMeansOpen(false);
                        }}
                      >
                        <div>
                          <span className='font-bold'>{pm.value}</span>
                          {pm.displayText && (
                            <div className='text-gray-700 text-xs mt-0.5 mb-0.5'>
                              {pm.displayText}
                            </div>
                          )}
                          {pm.description && (
                            <p className='text-gray-500 text-xs mt-0.5'>
                              {pm.description}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {formik.touched.paymentMeans && formik.errors.paymentMeans ? (
            <div className='text-sm text-red-500 mt-1'>
              {t(String(formik.errors.paymentMeans))}
            </div>
          ) : null}
        </div>

        {/* Special Tax Treatment & Pre-Payment Invoice */}
        <div className='space-y-3'>
          <div>
            <Label
              htmlFor='specialTaxTreatment'
              className='text-sm text-gray-700'
            >
              {t('invoices.form.specialTaxTreatment')}:
            </Label>
            <Textarea
              id='specialTaxTreatment'
              className='bg-blue-50 mt-2'
              placeholder={t('invoices.form.specialTaxTreatment')}
              name='specialTaxTreatment'
              value={formik.values.specialTaxTreatment}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
