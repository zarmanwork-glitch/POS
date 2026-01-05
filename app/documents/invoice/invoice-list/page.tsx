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
    'Invoice Number' | 'Customer' | 'Status'
  >('Invoice Number');
  const [sortBy, setSortBy] = useState<
    'Creation Date' | 'Invoice Number' | 'Customer'
  >('Creation Date');
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

  const [items, setItems] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ================= FILTER + SORT ================= */
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
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

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
                    key: 'startDate',
                    label: `From: ${startDate}`,
                  });
                if (endDate)
                  active.push({
                    key: 'endDate',
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
                    case 'startDate':
                      setStartDate('');
                      break;
                    case 'endDate':
                      setEndDate('');
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
                  {sortBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Creation Date')}>
                  Creation Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Invoice Number')}>
                  Invoice Number
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Customer')}>
                  Customer
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
                <DropdownMenuItem onClick={() => setSearchBy('Invoice Number')}>
                  Invoice Number
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Customer')}>
                  Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Status')}>
                  Status
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
            <Button className='h-9 bg-blue-600 hover:bg-blue-700'>Go</Button>
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

      {totalItems > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
            <PaginationItem>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
            />
          </PaginationContent>
        </Pagination>
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
