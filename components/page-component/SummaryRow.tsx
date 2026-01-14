import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export type SummaryRowProps = {
  label: string;
  value: string;
  bold?: boolean;
  editable?: boolean;
  tooltip?: string;
};

export function SummaryRow({
  label,
  value,
  bold = false,
  editable = false,
  tooltip,
}: SummaryRowProps) {
  return (
    <div className='grid grid-cols-[1fr_80px_140px] items-center gap-4 py-3 text-sm'>
      {/* Label */}
      <div className='flex items-center gap-2 text-muted-foreground'>
        {tooltip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='h-4 w-4 text-blue-600' />
              </TooltipTrigger>
              <TooltipContent
                side='right'
                sideOffset={5}
                className='w-48 bg-[#555] text-white rounded-md text-xs p-2 opacity-100 transition-opacity duration-300'
              >
                <p className='leading-snug text-center'>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Info className='h-4 w-4' />
        )}
        <span className={bold ? 'font-semibold text-foreground' : undefined}>
          {label}
        </span>
      </div>

      {/* Currency */}
      <span className={`text-center ${bold ? 'font-semibold' : ''}`}>SAR</span>

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
