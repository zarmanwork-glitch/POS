import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Settings2, SortAsc, SortDesc } from 'lucide-react';

interface CustomerListControlsProps {
  searchCustomer: string;
  setSearchCustomer: (value: string) => void;
  searchBy: string;
  setSearchBy: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  orderBy: 'asc' | 'desc';
  setOrderBy: (value: 'asc' | 'desc') => void;
  setPage: (value: number) => void;
  onShowFilters: () => void;
  t: (key: string) => string;
}

export const CustomerListControls = ({
  searchCustomer,
  setSearchCustomer,
  searchBy,
  setSearchBy,
  sortBy,
  setSortBy,
  orderBy,
  setOrderBy,
  setPage,
  onShowFilters,
  t,
}: CustomerListControlsProps) => {
  return (
    <div className='flex flex-wrap items-center justify-end gap-4'>
      {/* Filters button */}
      <div className='relative mr-auto'>
        <button
          onClick={onShowFilters}
          className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200 '
        >
          <Settings2 className='h-4 w-4 text-gray-600' />
        </button>
      </div>

      {/* Search By */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600'>{t('customers.searchBy')}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-1 text-sm font-medium'>
              {searchBy}
              <ChevronDown className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSearchBy('name')}>
              {t('customers.searchOptions.name')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchBy('email')}>
              {t('customers.searchOptions.email')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchBy('phoneNumber')}>
              {t('customers.searchOptions.phone')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchBy('companyName')}>
              {t('customers.searchOptions.companyName')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchBy('customerNumber')}>
              {t('customers.searchOptions.customerNumber')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sort */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600'>{t('customers.sortBy')}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-1 text-sm font-medium'>
              {sortBy}
              <ChevronDown className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
              {t('customers.sortOptions.chronological')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')}>
              {t('customers.sortOptions.name')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('companyName')}>
              {t('customers.sortOptions.companyName')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          aria-label='Toggle order'
          title={
            orderBy === 'desc'
              ? t('customers.descending')
              : t('customers.ascending')
          }
          onClick={() => {
            setOrderBy(orderBy === 'desc' ? 'asc' : 'desc');
            setPage(1);
          }}
          className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
        >
          {orderBy === 'desc' ? (
            <SortDesc className='h-4 w-4 text-gray-600' />
          ) : (
            <SortAsc className='h-4 w-4 text-gray-600' />
          )}
        </button>
      </div>

      {/* Search */}
      <div className='flex items-center gap-2'>
        <Input
          className='h-9 w-40'
          placeholder={t('customers.searchPlaceholder')}
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
        <Button className='h-9 bg-blue-600 hover:bg-blue-700'>
          {t('profile.go')}
        </Button>
      </div>
    </div>
  );
};
