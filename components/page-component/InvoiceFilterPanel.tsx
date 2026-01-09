import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface InvoiceFilterPanelProps {
  onReset: () => void;
  onApply: () => void;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>[0];
}

export const InvoiceFilterPanel = ({
  onReset,
  onApply,
  isRTL,
  t,
}: InvoiceFilterPanelProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 z-40 bg-black/20 md:bg-transparent'
        onClick={onApply}
      />

      {/* Panel */}
      <div
        className={`
        fixed md:absolute
        inset-x-0 bottom-0 md:bottom-auto ${isRTL ? 'md:left-0' : 'md:right-0'}
        md:top-[calc(100%+8px)]
        z-50
        w-full md:w-96
        bg-white
        rounded-t-xl md:rounded-md
        shadow-lg
        max-h-[80vh] md:max-h-[50vh]
        overflow-y-auto
        px-4 pb-4 pt-3
      `}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Close */}
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <button
            onClick={onApply}
            className='text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        </div>

        {/* Actions */}
        <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
          <Button
            variant='outline'
            className='flex-1 h-8 text-xs'
            onClick={onReset}
          >
            {t('invoices.reset')}
          </Button>
          <Button
            className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'
            onClick={onApply}
          >
            {t('invoices.apply')}
          </Button>
        </div>
      </div>
    </>
  );
};
