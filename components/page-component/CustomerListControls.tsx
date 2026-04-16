import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Settings2, SortAsc, SortDesc } from 'lucide-react';
import { CustomerListControlsProps } from '@/types/componentTypes';

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
  showFilters,
  filters,
  setFilters,
  t,
}: CustomerListControlsProps) => {
  // Map backend field names to display labels
  const getSortByLabel = (value: string) => {
    switch (value) {
      case 'createdAt':
        return t('customers.sortOptions.chronological');
      case 'name':
        return t('customers.sortOptions.name');
      case 'companyName':
        return t('customers.sortOptions.companyName');
      default:
        return value;
    }
  };

  const getSearchByLabel = (value: string) => {
    switch (value) {
      case 'name':
        return t('customers.searchOptions.name');
      case 'email':
        return t('customers.searchOptions.email');
      case 'phoneNumber':
        return t('customers.searchOptions.phone');
      case 'companyName':
        return t('customers.searchOptions.companyName');
      case 'customerNumber':
        return t('customers.searchOptions.customerNumber');
      default:
        return value;
    }
  };

  return (
    <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center sm:justify-end gap-3 sm:gap-4'>
      {/* Filters button */}
      <div className='relative sm:mr-auto'>
        <Button
          variant='ghost'
          size='icon'
          className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
          onClick={onShowFilters}
        >
          <Settings2 className='h-4 w-4 text-gray-600' />
        </Button>

        {/* Active filters preview (below the filter icon) */}
        {!showFilters &&
          (() => {
            const initialFilters = { status: 'Both', country: 'All' };
            const active: Array<{ key: string; label: string }> = [];

            if (filters.status && filters.status !== initialFilters.status)
              active.push({
                key: 'status',
                label: `${t('profile.status')}: ${filters.status}`,
              });

            if (filters.country && filters.country !== initialFilters.country)
              active.push({
                key: 'country',
                label: `${t('profile.country')}: ${filters.country}`,
              });

            if (searchCustomer)
              active.push({
                key: 'search',
                label: `${getSearchByLabel(searchBy)}: ${searchCustomer}`,
              });

            if (sortBy && (sortBy !== 'name' || orderBy !== 'desc'))
              active.push({
                key: 'sort',
                label: `${t('customers.sortBy')}: ${getSortByLabel(sortBy)} ${orderBy}`,
              });

            if (active.length === 0) return null;

            const clearFilter = (key: string) => {
              switch (key) {
                case 'status':
                  setFilters({ ...filters, status: initialFilters.status });
                  break;
                case 'country':
                  setFilters({ ...filters, country: initialFilters.country });
                  break;
                case 'search':
                  setSearchCustomer('');
                  break;
                case 'sort':
                  setSortBy('name');
                  setOrderBy('desc');
                  break;
                default:
                  break;
              }
              setPage(1);
            };

            return (
              <div className='mt-2 w-72 p-2'>
                <div className='flex flex-wrap gap-2'>
                  {active.map((a) => (
                    <span
                      key={a.key}
                      className='flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full'
                    >
                      <span>{a.label}</span>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='ml-1 h-4 w-4 p-0 text-blue-700 hover:text-blue-900'
                        onClick={() => clearFilter(a.key)}
                        aria-label={`Clear ${a.key}`}
                      >
                        ✕
                      </Button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
      </div>

      {/* Search By */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600 hidden sm:inline'>
          {t('customers.searchBy')}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-1 text-sm font-medium'
            >
              {getSearchByLabel(searchBy)}
              <ChevronDown className='h-4 w-4' />
            </Button>
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
        <span className='text-sm text-gray-600 hidden sm:inline'>
          {t('customers.sortBy')}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center gap-1 text-sm font-medium'
            >
              {getSortByLabel(sortBy)}
              <ChevronDown className='h-4 w-4' />
            </Button>
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
        <Button
          variant='ghost'
          size='icon'
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
        </Button>
      </div>

      {/* Search */}
      <div className='flex items-center gap-2 flex-1 sm:flex-initial'>
        <Input
          className='h-9 w-full sm:w-40'
          placeholder={t('customers.searchPlaceholder')}
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
        <Button className='h-9 bg-blue-600 hover:bg-blue-700 shrink-0'>
          {t('profile.go')}
        </Button>
      </div>
    </div>
  );
};
