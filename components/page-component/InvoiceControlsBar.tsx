import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  SortAsc,
  SortDesc,
  Settings2,
  Download,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  onSearchChange: (value: string) => void;
  onSearchByChange: (value: string) => void;
  onSortByChange: (value: 'createdAt' | 'invoiceDate') => void;
  onOrderByChange: () => void;
  onShowFilters: () => void;
  onClearFilter: (key: string) => void;
  onSearch: () => void;
  onDownload: () => void;
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
  onSearchChange,
  onSearchByChange,
  onSortByChange,
  onOrderByChange,
  onShowFilters,
  onClearFilter,
  onSearch,
  onDownload,
  t,
}: InvoiceControlsBarProps) => {
  return (
    <>
      {/* Controls */}
      <div
        className={`flex flex-wrap items-center justify-end gap-4 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        {/* Filters button */}

        {/* Sort */}
        <div
          className={`flex items-center gap-2 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <span className='text-sm text-gray-600'>{t('invoices.sortBy')}</span>
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
              <DropdownMenuItem onClick={() => onSearchByChange('companyName')}>
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
    </>
  );
};
