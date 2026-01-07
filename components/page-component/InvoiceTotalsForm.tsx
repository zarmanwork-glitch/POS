import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function InvoiceTotalsForm() {
  return (
    <Card className='max-w-3xl mx-auto shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>
          Total Amount in Words
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Total Amount in Words */}
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label>Total Amount in Words</Label>
            <span className='text-sm text-muted-foreground'>
              Grand Total (in words): SAR – One and fifteen
            </span>
          </div>
          <Textarea
            placeholder='Enter number in Arabic'
            className='min-h-[60px]'
          />
          <p className='text-xs text-muted-foreground'>
            This is a system-generated translation and may not be accurate. We
            recommend you provide the translation yourself.
          </p>
        </div>

        {/* Notes */}
        <div className='space-y-2'>
          <Label>Notes</Label>
          <Textarea
            placeholder='Additional Notes'
            className='min-h-[120px]'
          />
        </div>

        {/* Amount Paid to Date */}
        <div className='space-y-2 max-w-xs'>
          <Label>Amount Paid to Date</Label>
          <Input
            type='number'
            defaultValue={0}
          />
        </div>
      </CardContent>
    </Card>
  );
}
