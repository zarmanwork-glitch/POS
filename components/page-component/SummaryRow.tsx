import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

export type SummaryRowProps = {
  label: string;
  value: string;
  bold?: boolean;
  editable?: boolean;
};

export function SummaryRow({
  label,
  value,
  bold = false,
  editable = false,
}: SummaryRowProps) {
  return (
    <div className='grid grid-cols-[1fr_80px_140px] items-center py-3 text-sm'>
      {/* Label */}
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Info className='h-4 w-4' />
        <span className={bold ? 'font-semibold text-foreground' : undefined}>
          {label}
        </span>
      </div>

      {/* Currency */}
      <div className={`text-center ${bold ? 'font-semibold' : ''}`}>SAR</div>

      {/* Amount */}
      <div className='text-right'>
        {editable ? (
          <Input
            value={value}
            readOnly
            className='h-10 bg-muted/40 text-right'
          />
        ) : (
          <span className={bold ? 'text-lg font-semibold' : undefined}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
