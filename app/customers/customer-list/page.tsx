'use client';

import { deleteCustomer, getCustomersList } from '@/api/customers/customer.api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Cookies from 'js-cookie';
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Settings2,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { customerStatusFilters } from '@/enums/customerStatus';
import { countries } from '@/enums/country';

export default function CustomerListPage() {
  const { t } = useTranslation();
  const [searchCustomer, setSearchCustomer] = useState('');
  const [sortBy, setSortBy] = useState('Chronological');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [searchBy, setSearchBy] = useState('Name');
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [deleteCustomerName, setDeleteCustomerName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: 'Both',
    country: 'All',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const offset = Math.max(0, (page - 1) * limit);

        const payloadToSend: any = {
          token,
          offset,
          limit,
        };

        if (searchCustomer)
          Object.assign(payloadToSend, { searchBy, search: searchCustomer });
        if (sortBy) Object.assign(payloadToSend, { sortBy });
        if (orderBy) Object.assign(payloadToSend, { orderBy });
        if (filters.status && filters.status !== 'Both')
          Object.assign(payloadToSend, { status: filters.status });
        if (filters.country && filters.country !== 'All')
          Object.assign(payloadToSend, { country: filters.country });

        const response = await getCustomersList(payloadToSend);

        const fetchedCustomers =
          response?.data?.data?.results?.customers ||
          response?.data?.results?.customers ||
          response?.data?.data?.results?.items ||
          response?.data?.results?.items ||
          response?.data?.items ||
          [];

        const fetched = Array.isArray(fetchedCustomers) ? fetchedCustomers : [];

        setCustomers(fetched);

        const results =
          response?.data?.data?.results ||
          response?.data?.results ||
          response?.data ||
          {};

        const total =
          results?.total ||
          results?.totalCount ||
          results?.totalRecords ||
          results?.count ||
          results?.recordsCount ||
          response?.data?.total ||
          0;

        if (typeof total === 'number' && total > 0) {
          setTotalItems(total);
        } else if (Array.isArray(fetched) && fetched.length > 0) {
          setTotalItems((page - 1) * limit + fetched.length);
        } else {
          setTotalItems(0);
        }

        setHasMore(Array.isArray(fetched) ? fetched.length >= limit : false);
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast.error('Error fetching customers', { duration: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [page, searchCustomer, sortBy, filters, searchBy, orderBy]);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name || '')
        .toLowerCase()
        .includes(searchCustomer.toLowerCase()) ||
      (customer.email || '')
        .toLowerCase()
        .includes(searchCustomer.toLowerCase())
  );

  const handleEdit = (customerId: string) => {
    router.push(`/customers/customer-form?id=${customerId}`);
  };

  const handleDeleteClick = (customerId: string, customerName: string) => {
    setDeleteCustomerId(customerId);
    setDeleteCustomerName(customerName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteCustomerId) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      await deleteCustomer({
        token,
        customerId: deleteCustomerId,
      });

      toast.success(`Customer "${deleteCustomerName}" deleted successfully`, {
        duration: 2000,
      });
      setCustomers(
        customers.filter((customer) => customer.id !== deleteCustomerId)
      );
      setDeleteModalOpen(false);
      setDeleteCustomerId(null);
      setDeleteCustomerName('');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer', { duration: 2000 });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with breadcrumb and action button */}

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>{t('sidebar.customers')}</span>{' '}
            <span className='text-gray-800'>| {t('customers.listTitle')}</span>
          </h2>
        </div>
        <Link href='/customers/customer-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            {t('customers.addCustomer')}
          </Button>
        </Link>
      </div>

      {/* Header */}

      <p className='text-sm text-gray-600'>
        {t('customers.showingAllCustomers')}
      </p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div className='flex flex-wrap items-center justify-end gap-4'>
          {/* Filters button */}
          <div className='relative mr-auto'>
            <button
              onClick={() => setShowFilters(true)}
              className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200 '
            >
              <Settings2 className='h-4 w-4 text-gray-600' />
            </button>

            {/* FILTER PANEL */}
            {showFilters && (
              <>
                {/* Overlay */}
                <div
                  className='fixed inset-0 z-40 bg-black/20 md:bg-transparent'
                  onClick={() => setShowFilters(false)}
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
                      onClick={() => setShowFilters(false)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      ✕
                    </button>
                  </div>
                  {/* Status */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>
                      {t('profile.status')}
                    </label>
                    <Select
                      value={filters.status}
                      onValueChange={(v) =>
                        setFilters({ ...filters, status: v })
                      }
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
                    <label className='text-xs font-medium'>
                      {t('profile.country')}
                    </label>
                    <Select
                      value={filters.country}
                      onValueChange={(v) =>
                        setFilters({ ...filters, country: v })
                      }
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
                      onClick={() =>
                        setFilters({ status: 'Both', country: 'All' })
                      }
                    >
                      {t('customers.reset')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search By */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>
              {t('customers.searchBy')}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {searchBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchBy('Name')}>
                  {t('customers.searchOptions.name')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Email')}>
                  {t('customers.searchOptions.email')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Phone')}>
                  {t('customers.searchOptions.phone')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Company Name')}>
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
            <span className='text-sm text-gray-600'>
              {t('customers.sortBy')}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {sortBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Chronological')}>
                  {t('customers.sortOptions.chronological')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Name')}>
                  {t('customers.sortOptions.name')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Company Name')}>
                  {t('customers.sortOptions.companyName')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Email')}>
                  {t('customers.sortOptions.email')}
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
                setOrderBy((o) => (o === 'desc' ? 'asc' : 'desc'));
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

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-blue-50'>
              <TableRow>
                <TableHead>{t('customers.table.no')}</TableHead>
                <TableHead>{t('profile.name')}</TableHead>
                <TableHead>{t('profile.email')}</TableHead>
                <TableHead>{t('profile.phoneNumber')}</TableHead>
                <TableHead>{t('customers.table.address')}</TableHead>
                <TableHead>{t('profile.country')}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>
                      {t('customers.loadingCustomers')}
                    </span>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>
                      {t('customers.noCustomersFound')}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      {customer.addressStreet}
                      {customer.buildingNumber &&
                        `, ${customer.buildingNumber}`}
                    </TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreHorizontal className='h-5 w-5' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => handleEdit(customer.id)}
                          >
                            {t('profile.edit')}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() =>
                              handleDeleteClick(customer.id, customer.name)
                            }
                          >
                            {t('profile.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className='flex flex-col gap-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(totalItems / limit);
                const siblingCount = 1;
                const left = Math.max(1, page - siblingCount);
                const right = Math.min(totalPages, page + siblingCount);
                const pages: (number | string)[] = [];

                if (left > 1) {
                  pages.push(1);
                  if (left > 2) pages.push('ellipsis');
                }

                for (let i = left; i <= right; i++) {
                  pages.push(i);
                }

                if (right < totalPages) {
                  if (right < totalPages - 1) pages.push('ellipsis');
                  pages.push(totalPages);
                }

                return pages.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href='#'
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(p as number);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < Math.ceil(totalItems / limit)) setPage(page + 1);
                  }}
                  className={
                    page >= Math.ceil(totalItems / limit)
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.confirmDeleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('customers.confirmDeleteDesc', { name: deleteCustomerName })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              {t('profile.cancel')}
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('profile.deleting') : t('customers.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
