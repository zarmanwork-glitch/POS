import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { customerStatusFilters } from '@/enums/customerStatus';
import { countries } from '@/enums/country';

interface CustomerFiltersPanelProps {
  showFilters: boolean;
  filters: {
    status: string;
    country: string;
  };
  setFilters: (filters: { status: string; country: string }) => void;
  onClose: () => void;
  t: (key: string) => string;
}

export const CustomerFiltersPanel = ({
  showFilters,
  filters,
  setFilters,
  onClose,
  t,
}: CustomerFiltersPanelProps) => {
  if (!showFilters) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 z-40 bg-black/20 md:bg-transparent'
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className='
          fixed md:absolute
          inset-x-0 bottom-0 md:bottom-auto md:right-0
          md:top-[calc(100%+8px)]
          z-50
          w-full md:w-96
          bg-white
          rounded-t-xl md:rounded-md
          shadow-lg
          max-h-[80vh] md:max-h-[50vh]
          overflow-y-auto
          px-4 pb-4 pt-3
        '
      >
        {/* Close */}
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className='space-y-1 flex items-center justify-between'>
          <label className='text-xs font-medium'>{t('profile.status')}</label>
          <Select
            value={filters.status}
            onValueChange={(v) => setFilters({ ...filters, status: v })}
          >
            <SelectTrigger className='h-8'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {customerStatusFilters.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                >
                  {status.displayText}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className='space-y-1 flex items-center justify-between'>
          <label className='text-xs font-medium'>{t('profile.country')}</label>
          <Select
            value={filters.country}
            onValueChange={(v) => setFilters({ ...filters, country: v })}
          >
            <SelectTrigger className='h-8'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem
                  key={country.value}
                  value={country.value}
                >
                  {country.displayText}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
          <Button className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'>
            {t('customers.apply')}
          </Button>
          <Button
            variant='outline'
            className='flex-1 h-8 text-xs'
            onClick={() => setFilters({ status: 'Both', country: 'All' })}
          >
            {t('customers.reset')}
          </Button>
        </div>
      </div>
    </>
  );
};
