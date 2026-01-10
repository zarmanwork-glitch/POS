import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { paymentMeans } from '@/enums/paymentMeans';
import { Search } from 'lucide-react';
import { SecondaryControlsSectionProps } from '@/types/paymentMeansTypes';

export default function SecondaryControlsSection({
  formik,
  t,
}: SecondaryControlsSectionProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
      {/* Payment Terms */}
      <div>
        <Label
          htmlFor='paymentTerms'
          className='text-sm text-gray-700'
        >
          Payment Terms:
        </Label>
        <Input
          id='paymentTerms'
          className='bg-blue-50 h-10 mt-2'
          placeholder='Terms'
          name='paymentTerms'
          value={formik.values.paymentTerms}
          onChange={formik.handleChange}
        />
      </div>

      {/* Payment Means */}
      <div className='relative'>
        <Label
          htmlFor='paymentMeans'
          className='text-sm text-gray-700'
        >
          Payment Means:
        </Label>
        <div className='relative mt-2'>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
          <Input
            id='paymentMeans'
            name='paymentMeans'
            autoComplete='off'
            className='bg-blue-50 h-10 w-full pl-8 pr-2 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200'
            placeholder='Search by code'
            value={formik.values.paymentMeansSearch || ''}
            onChange={(e) => {
              formik.setFieldValue('paymentMeansSearch', e.target.value);
            }}
            onFocus={(e) =>
              formik.setFieldValue('paymentMeansDropdownOpen', true)
            }
            onBlur={(e) =>
              setTimeout(
                () => formik.setFieldValue('paymentMeansDropdownOpen', false),
                150
              )
            }
          />
        </div>
        {formik.values.paymentMeansDropdownOpen && (
          <div className='absolute z-10 w-full max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
            {paymentMeans
              .filter(
                (pm) =>
                  (formik.values.paymentMeansSearch || '') === '' ||
                  pm.value
                    .toLowerCase()
                    .includes(
                      (formik.values.paymentMeansSearch || '').toLowerCase()
                    )
              )
              .map((pm) => (
                <button
                  type='button'
                  key={pm.value}
                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                  onMouseDown={() => {
                    formik.setFieldValue('paymentMeans', pm.value);
                    formik.setFieldValue('paymentMeansSearch', pm.value);
                    formik.setFieldValue('paymentMeansDropdownOpen', false);
                  }}
                >
                  <div>
                    <span className='font-bold'>{pm.value}</span>
                    {pm.displayText && (
                      <div className=' text-gray-700 mt-0.5 mb-0.5'>
                        {pm.displayText}
                      </div>
                    )}
                    {pm.description && (
                      <p className='text-gray-500 mt-0.5'>{pm.description}</p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        )}
        {formik.touched.paymentMeans && formik.errors.paymentMeans ? (
          <div className='text-sm text-red-500 mt-1'>
            {String(formik.errors.paymentMeans)}
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

        {/* Pre Payment Invoice Toggle */}
        <div className='flex items-center gap-3 pt-2'>
          <Label
            htmlFor='prePaymentInvoice'
            className='text-sm text-gray-700'
          >
            {t('invoices.form.prePaymentInvoice')}:
          </Label>
          <Switch
            id='prePaymentInvoice'
            checked={formik.values.prePaymentInvoice}
            onCheckedChange={(checked) =>
              formik.setFieldValue('prePaymentInvoice', checked)
            }
          />
        </div>
        <p className='text-sm text-gray-600'>
          {formik.values.prePaymentInvoice
            ? t('invoices.form.yes')
            : t('invoices.form.no')}
        </p>
      </div>
    </div>
  );
}
