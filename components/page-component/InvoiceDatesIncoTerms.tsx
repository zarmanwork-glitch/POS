import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { incoTerms } from '@/enums/incoTerms';
import { InvoiceDatesIncoTermsProps } from '@/types/componentTypes';

export const InvoiceDatesIncoTerms = ({
  formik,
  t,
}: InvoiceDatesIncoTermsProps) => {
  return (
    <div>
      <Label className='block text-sm text-gray-700 mb-1'>
        {t('invoices.form.incoTerms')}:
      </Label>
      <div className='flex items-center gap-3'>
        <Select
          value={formik.values.incoterms}
          onValueChange={(v) => formik.setFieldValue('incoterms', v)}
        >
          <SelectTrigger className='bg-blue-50 h-10 w-28'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {incoTerms.map((it) => (
              <SelectItem
                key={it.value}
                value={it.value}
              >
                {it.displayText}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className='bg-blue-50 h-10 flex-1'
          placeholder={t('invoices.form.location')}
          name='location'
          value={formik.values.location}
          onChange={formik.handleChange}
        />
      </div>
    </div>
  );
};
