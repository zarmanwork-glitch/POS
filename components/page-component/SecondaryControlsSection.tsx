import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormikProps } from 'formik';

interface SecondaryControlsSectionProps {
  formik: FormikProps<any>;
  t: (key: string) => string;
}

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
      <div>
        <Label
          htmlFor='paymentMeans'
          className='text-sm text-gray-700'
        >
          Payment Means:
        </Label>
        <Select
          value={formik.values.paymentMeans}
          onValueChange={(v) => formik.setFieldValue('paymentMeans', v)}
        >
          <SelectTrigger className='bg-blue-50 h-10 mt-2'>
            <SelectValue placeholder='Select payment means' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='30'>30</SelectItem>
            <SelectItem value='42'>42</SelectItem>
            <SelectItem value='48'>48</SelectItem>
            <SelectItem value='1'>1</SelectItem>
          </SelectContent>
        </Select>
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
            className='bg-blue-50 mt-2 h-20'
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
