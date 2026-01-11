import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown, SortAsc, SortDesc, CalendarIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InvoiceControlsBarProps {
  search: string;
  searchBy:
    | 'invoiceNumber'
    | 'customerPoNumber'
    | 'name'
    | 'companyName'
    | 'customerNumber';
  sortBy: 'createdAt' | 'invoiceDate';
  orderBy: 'asc' | 'desc';
  showFilters: boolean;
  activeFilters: Array<{ key: string; label: string }>;
  loading: boolean;
  isRTL: boolean;
  startDate: string;
  endDate: string;
  onSearchChange: (value: string) => void;
  onSearchByChange: (value: string) => void;
  onSortByChange: (value: 'createdAt' | 'invoiceDate') => void;
  onOrderByChange: () => void;
  onShowFilters: () => void;
  onClearFilter: (key: string) => void;
  onSearch: () => void;
  onDownload: () => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  t: ReturnType<typeof useTranslation>[0];
}

export const InvoiceControlsBar = ({
  search,
  searchBy,
  sortBy,
  orderBy,
  showFilters,
  activeFilters,
  loading,
  isRTL,
  startDate,
  endDate,
  onSearchChange,
  onSearchByChange,
  onSortByChange,
  onOrderByChange,
  onShowFilters,
  onClearFilter,
  onSearch,
  onDownload,
  onStartDateChange,
  onEndDateChange,
  t,
}: InvoiceControlsBarProps) => {
  return (
    <>
      {/* Controls */}
      <div
        className={`flex flex-wrap items-end justify-between gap-4 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        {/* Date Filters - Left Side */}
        <div className='flex gap-4 items-end'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('invoices.startDate')}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-10 w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {startDate ? (
                    format(new Date(startDate + 'T00:00:00'), 'PPP')
                  ) : (
                    <span>{t('invoices.form.chooseDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={
                    startDate ? new Date(startDate + 'T00:00:00') : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        '0'
                      );
                      const day = String(date.getDate()).padStart(2, '0');
                      onStartDateChange(`${year}-${month}-${day}`);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('invoices.endDate')}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-10 w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {endDate ? (
                    format(new Date(endDate + 'T00:00:00'), 'PPP')
                  ) : (
                    <span>{t('invoices.form.chooseDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={
                    endDate ? new Date(endDate + 'T00:00:00') : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        '0'
                      );
                      const day = String(date.getDate()).padStart(2, '0');
                      onEndDateChange(`${year}-${month}-${day}`);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {(startDate || endDate) && (
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 self-end hover:bg-destructive/10'
              onClick={() => {
                onStartDateChange('');
                onEndDateChange('');
              }}
              title='Clear dates'
            >
              <X className='h-4 w-4 text-destructive' />
            </Button>
          )}
        </div>

        {/* Right Side Controls */}
        <div className='flex flex-wrap items-center gap-4'>
          {/* Sort */}
          <div
            className={`flex items-center gap-2 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <span className='text-sm text-gray-600'>
              {t('invoices.sortBy')}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  {sortBy === 'createdAt'
                    ? t('invoices.creationDate')
                    : t('invoices.invoiceDate')}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onSortByChange('createdAt')}>
                  {t('invoices.creationDate')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortByChange('invoiceDate')}>
                  {t('invoices.invoiceDate')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              aria-label='Toggle order'
              title={orderBy === 'desc' ? 'Descending' : 'Ascending'}
              onClick={onOrderByChange}
              className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
            >
              {orderBy === 'desc' ? (
                <SortDesc className='h-4 w-4 text-gray-600' />
              ) : (
                <SortAsc className='h-4 w-4 text-gray-600' />
              )}
            </button>
          </div>

          {/* Search By */}
          <div
            className={`flex items-center gap-2 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <span className='text-sm text-gray-600'>
              {t('invoices.searchBy')}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  {t(`invoices.${searchBy}`)}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onSearchByChange('invoiceNumber')}
                >
                  {t('invoices.invoiceNumber')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSearchByChange('customerPoNumber')}
                >
                  {t('invoices.customerPoNumber')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSearchByChange('name')}>
                  {t('invoices.name')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSearchByChange('companyName')}
                >
                  {t('invoices.companyName')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSearchByChange('customerNumber')}
                >
                  {t('invoices.customerNumber')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className='flex items-center gap-2'>
            <Input
              className='h-9 w-40'
              placeholder={t('invoices.search')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Button
              className='h-9 bg-blue-600 hover:bg-blue-700'
              onClick={onSearch}
              disabled={loading}
            >
              {loading ? 'Loading...' : t('invoices.go')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
