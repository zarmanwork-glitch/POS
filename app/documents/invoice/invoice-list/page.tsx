'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatNumber } from '@/lib/number';
import {
  MoreHorizontal,
  Plus,
  Download,
  Settings2,
  ChevronDown,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { getInvoicesList } from '@/api/invoices/invoice.api';
import { invoiceStatuses, type InvoiceStatusType } from '@/enums/invoiceStatus';
import { invoiceTypes, type InvoiceTypeType } from '@/enums/invoiceType';

type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  type: InvoiceTypeType;
  customer: string;
  total: number;
  status: InvoiceStatusType;
};

const SAMPLE_INVOICES: Invoice[] = Array.from({ length: 37 }).map((_, i) => ({
  id: `inv-${i + 1}`,
  invoiceNumber: `INV-${1000 + i}`,
  invoiceDate: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  customer: ['Acme Corp', 'Globex', 'Umbrella Ltd', 'Stark Industries'][i % 4],
  type: (i % 2 === 0
    ? invoiceTypes[0].value
    : invoiceTypes[1].value) as InvoiceTypeType,
  total: Math.round(Math.random() * 10000) / 100,
  status: invoiceStatuses[i % 4].value as InvoiceStatusType,
}));

export default function InvoiceListPage() {
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<
    | 'invoiceNumber'
    | 'customerPoNumber'
    | 'name'
    | 'companyName'
    | 'customerNumber'
  >('name');
  const [sortBy, setSortBy] = useState<'createdAt' | 'invoiceDate'>(
    'createdAt'
  );
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatusType>(
    'All'
  );
  const [typeFilter, setTypeFilter] = useState<'All' | InvoiceTypeType>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = items.slice();

    if (statusFilter !== 'All') {
      list = list.filter((i) => i.status === statusFilter);
    }

    if (typeFilter !== 'All') {
      list = list.filter((i) => i.type === typeFilter);
    }

    if (startDate) {
      list = list.filter((i) => i.invoiceDate >= startDate);
    }

    if (endDate) {
      list = list.filter((i) => i.invoiceDate <= endDate);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((inv) => {
        if (searchBy === 'Invoice Number')
          return inv.invoiceNumber.toLowerCase().includes(q);
        if (searchBy === 'Customer')
          return inv.customer.toLowerCase().includes(q);
        if (searchBy === 'Status') return inv.status.toLowerCase().includes(q);
        return false;
      });
    }

    list.sort((a, b) => {
      if (sortBy === 'Creation Date')
        return a.invoiceDate.localeCompare(b.invoiceDate);
      if (sortBy === 'Invoice Number')
        return a.invoiceNumber.localeCompare(b.invoiceNumber);
      return a.customer.localeCompare(b.customer);
    });

    if (orderBy === 'desc') list.reverse();

    return list;
  }, [
    items,
    search,
    searchBy,
    sortBy,
    orderBy,
    statusFilter,
    typeFilter,
    startDate,
    endDate,
  ]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil((totalCount ?? totalItems) / limit));

  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  // Fetch invoices from API with current filters
  const fetchInvoices = async (opts?: { page?: number }) => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      const p = opts?.page ?? page;

      // Send minimal payload: compute offset for requested page and send limit
      const offset = (p - 1) * limit;
      const res = await getInvoicesList({ token: token as any, offset, limit });

      const invoices =
        res?.data?.data?.results?.invoice ??
        res?.data?.data?.results?.invoices ??
        res?.data?.data?.results ??
        res ??
        [];
      // try to extract count if provided (recordsCount / records / count)
      const count =
        res?.data?.data?.results?.recordsCount ??
        res?.data?.data?.results?.totalCount ??
        res?.data?.data?.results?.count ??
        (Array.isArray(invoices) ? invoices.length : null);

      // Map API invoice objects to UI Invoice type
      const mapped = Array.isArray(invoices)
        ? invoices.map((inv: any) => {
            const id = inv.id || inv._id || inv.invoiceId || '';
            const invoiceNumber = inv.invoiceNumber || inv.invoice_no || '';
            const invoiceDate = (inv.invoiceDate || inv.createdAt || '').slice(
              0,
              10
            );
            const customer =
              (inv.customer &&
                (inv.customer.name || inv.customer.companyName)) ||
              inv.customer ||
              '';

            // compute total from items when available
            let total = 0;
            if (Array.isArray(inv.items) && inv.items.length > 0) {
              total = inv.items.reduce((sum: number, it: any) => {
                const q = Number(it.quantity) || 0;
                const r = Number(it.unitRate) || 0;
                const discount = Number(it.discount) || 0;
                const tax = Number(it.taxRate) || 0;
                let sub = q * r;
                if ((it.discountType || '').toUpperCase() === 'PERC') {
                  sub = sub - (sub * discount) / 100;
                } else {
                  sub = sub - discount;
                }
                const lineTotal = sub + (sub * tax) / 100;
                return sum + lineTotal;
              }, 0);
            } else if (typeof inv.totalAmount === 'number') {
              total = inv.totalAmount;
            } else if (typeof inv.AmountPaidToDate === 'number') {
              total = inv.AmountPaidToDate;
            }

            const status = inv.status || inv.invoiceStatus || '—';

            return {
              id,
              invoiceNumber,
              invoiceDate,
              customer,
              total,
              status,
            } as Invoice;
          })
        : [];

      setItems(mapped);
      if (typeof count === 'number') setTotalCount(count);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchInvoices({ page: 1 });
  }, []);

  // refetch when page changes
  useEffect(() => {
    fetchInvoices({ page });
  }, [page]);

  const confirmDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  /* ================= UI ================= */
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Documents</span>
          <span className='text-gray-800'> | Invoice List</span>
        </h2>
        <Link href='/documents/invoice/invoice-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' /> New Invoice
          </Button>
        </Link>
      </div>

      <p className='text-sm text-gray-600'>Showing all sent invoices</p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div className='flex flex-wrap items-center justify-end gap-4'>
          {/* Filters button */}
          <div className='relative mr-auto'>
            <button
              onClick={() => setShowFilters(true)}
              className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
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
                    <label className='text-xs font-medium'>Status</label>
                    <select
                      className='h-8 border rounded-md px-2 text-sm'
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value='All'>All</option>
                      {invoiceStatuses.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.displayText}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Type */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>Type</label>
                    <select
                      className='h-8 border rounded-md px-2 text-sm'
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                    >
                      <option value='All'>All</option>
                      {invoiceTypes.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                        >
                          {type.displayText}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Start Date */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>Start Date</label>
                    <Input
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className='h-8'
                    />
                  </div>
                  {/* End Date */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>End Date</label>
                    <Input
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className='h-8'
                    />
                  </div>
                  {/* Actions */}
                  <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
                    <Button
                      variant='outline'
                      className='flex-1 h-8 text-xs'
                      onClick={() => {
                        setStatusFilter('All');
                        setTypeFilter('All');
                        setStartDate('');
                        setEndDate('');
                        setPage(1);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'
                      onClick={() => setShowFilters(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Active filters preview (below the filter icon) */}
            {!showFilters &&
              (() => {
                const active: Array<{ key: string; label: string }> = [];
                if (statusFilter !== 'All')
                  active.push({
                    key: 'status',
                    label: `Status: ${statusFilter}`,
                  });
                if (typeFilter !== 'All')
                  active.push({
                    key: 'type',
                    label: `Type: ${typeFilter}`,
                  });
                if (startDate)
                  active.push({
                    key: 'invoiceStartDate',
                    label: `From: ${startDate}`,
                  });
                if (endDate)
                  active.push({
                    key: 'invoiceEndDate',
                    label: `To: ${endDate}`,
                  });
                if (search)
                  active.push({
                    key: 'search',
                    label: `${searchBy}: ${search}`,
                  });

                if (active.length === 0) return null;

                const clearFilter = (key: string) => {
                  switch (key) {
                    case 'status':
                      setStatusFilter('All');
                      break;
                    case 'type':
                      setTypeFilter('All');
                      break;
                    case 'invoiceStartDate':
                      setStartDate('');
                      break;
                    case 'invoiceEndDate':
                      setEndDate('');
                      break;
                      break;
                    case 'search':
                      setSearch('');
                      break;
                    default:
                      break;
                  }
                  setPage(1);
                };

                return (
                  <div className='mt-2 w-full max-w-2xl p-2'>
                    <div className='flex flex-wrap gap-2'>
                      {active.map((a) => (
                        <span
                          key={a.key}
                          className='flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full'
                        >
                          <span>{a.label}</span>
                          <button
                            onClick={() => clearFilter(a.key)}
                            aria-label={`Clear ${a.key}`}
                            className='ml-1 text-blue-700 hover:text-blue-900'
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Sort by</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {sortBy === 'createdAt' ? 'Creation Date' : 'Invoice Date'}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
                  Creation Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('invoiceDate')}>
                  Invoice Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              aria-label='Toggle order'
              title={orderBy === 'desc' ? 'Descending' : 'Ascending'}
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

          {/* Search By */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Search By</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {searchBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchBy('invoiceNumber')}>
                  Invoice Number
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSearchBy('customerPoNumber')}
                >
                  Customer PO Number
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('companyName')}>
                  Company Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('customerNumber')}>
                  Customer Number
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className='flex items-center gap-2'>
            <Input
              className='h-9 w-40'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className='h-9 bg-blue-600 hover:bg-blue-700'
              onClick={() => {
                setPage(1);
                fetchInvoices({ page: 1 });
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Go'}
            </Button>
          </div>

          {/* Download */}
          <Button
            variant='outline'
            size='icon'
            className='h-9 w-9'
            title='Download'
            onClick={() => {
              // TODO: Implement download functionality
              console.log('Download invoices');
            }}
          >
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader className='bg-blue-50'>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-center py-8'
                >
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((inv, idx) => (
                <TableRow key={inv.id}>
                  <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                  <TableCell className='font-medium'>
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell>{inv.invoiceDate}</TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{formatNumber(inv.total)}</TableCell>
                  <TableCell>{inv.status}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setDeleteId(inv.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(totalCount ?? items.length) > 0 && (
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
                const siblingCount = 1;
                const left = Math.max(1, page - siblingCount);
                const right = Math.min(totalPages, page + siblingCount);
                const pages: (number | string)[] = [];

                if (left > 1) {
                  pages.push(1);
                  if (left > 2) pages.push('ellipsis');
                }

                for (let i = left; i <= right; i++) pages.push(i);

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
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page >= totalPages ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this invoice?</p>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
