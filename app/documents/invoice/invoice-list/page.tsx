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
import { useTranslation } from 'react-i18next';
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

export default function InvoiceListPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;

  // BACKEND-DRIVEN FILTER STATE
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');

      const payload = {
        offSet: (page - 1) * limit,
        limit,
        sortBy,
        orderBy,
        searchBy,
        search,
        invoiceStartDate: startDate || undefined,
        invoiceEndDate: endDate || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        type: typeFilter !== 'All' ? typeFilter : undefined,
      };

      const res = await getInvoicesList({
        token: token as any,
        ...payload,
      });

      const results =
        res?.data?.data?.results?.invoice ??
        res?.data?.data?.results?.invoices ??
        [];

      const count =
        res?.data?.data?.results?.recordsCount ??
        res?.data?.data?.results?.totalCount ??
        0;

      const mapped: Invoice[] = results.map((inv: any) => ({
        id: inv.id || inv._id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: (inv.invoiceDate || inv.createdAt)?.slice(0, 10),
        customer:
          inv.customer?.name || inv.customer?.companyName || inv.customer || '',
        total: inv.totalAmount ?? inv.AmountPaidToDate ?? 0,
        status: inv.status,
      }));

      setItems(mapped);
      setTotalCount(count);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, sortBy, orderBy]);

  const confirmDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  return (
    <div
      className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('invoices.documents')}</span>
          <span className='text-gray-800'> | {t('invoices.invoiceList')}</span>
        </h2>
        <Link href='/documents/invoice/invoice-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' /> {t('invoices.newInvoice')}
          </Button>
        </Link>
      </div>

      <p className='text-sm text-gray-600'>{t('invoices.showingAllSent')}</p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div
          className={`flex flex-wrap items-center justify-end gap-4 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Filters button */}
          <div className={`relative ${isRTL ? 'ml-auto' : 'mr-auto'}`}>
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
                  className={`
                  fixed md:absolute
                  inset-x-0 bottom-0 md:bottom-auto ${
                    isRTL ? 'md:left-0' : 'md:right-0'
                  }
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
                  <div
                    className={`flex ${
                      isRTL ? 'justify-start' : 'justify-end'
                    }`}
                  >
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
                      {t('invoices.status')}
                    </label>
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
                    <label className='text-xs font-medium'>
                      {t('invoices.type')}
                    </label>
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
                    <label className='text-xs font-medium'>
                      {t('invoices.startDate')}
                    </label>
                    <Input
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className='h-8'
                    />
                  </div>
                  {/* End Date */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>
                      {t('invoices.endDate')}
                    </label>
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
                      {t('invoices.reset')}
                    </Button>
                    <Button
                      className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'
                      onClick={() => setShowFilters(false)}
                    >
                      {t('invoices.apply')}
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
                    label: `${t('invoices.status')}: ${statusFilter}`,
                  });
                if (typeFilter !== 'All')
                  active.push({
                    key: 'type',
                    label: `${t('invoices.type')}: ${typeFilter}`,
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
                  <div
                    className={`mt-2 w-full max-w-2xl p-2 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`flex flex-wrap gap-2 ${
                        isRTL ? 'justify-end' : 'justify-start'
                      }`}
                    >
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
                <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
                  {t('invoices.creationDate')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('invoiceDate')}>
                  {t('invoices.invoiceDate')}
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
                <DropdownMenuItem onClick={() => setSearchBy('invoiceNumber')}>
                  {t('invoices.invoiceNumber')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSearchBy('customerPoNumber')}
                >
                  {t('invoices.customerPoNumber')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('name')}>
                  {t('invoices.name')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('companyName')}>
                  {t('invoices.companyName')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('customerNumber')}>
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
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className='h-9 bg-blue-600 hover:bg-blue-700'
              onClick={() => {}}
              disabled={loading}
            >
              {loading ? 'Loading...' : t('invoices.go')}
            </Button>
          </div>

          {/* Download */}
          <Button
            variant='outline'
            size='icon'
            className='h-9 w-9'
            title={t('invoices.download')}
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
              <TableHead>{t('invoices.table.no')}</TableHead>
              <TableHead>{t('invoices.table.invoice')}</TableHead>
              <TableHead>{t('invoices.table.date')}</TableHead>
              <TableHead>{t('invoices.table.customer')}</TableHead>
              <TableHead>{t('invoices.table.total')}</TableHead>
              <TableHead>{t('invoices.table.status')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-center py-8'
                >
                  {loading ? 'Loading…' : t('invoices.noInvoicesFound')}
                </TableCell>
              </TableRow>
            ) : (
              items.map((inv, idx) => (
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
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{t('invoices.confirmDelete')}</DialogTitle>
          </DialogHeader>
          <p>{t('invoices.deleteInvoiceMessage')}</p>
          <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
            >
              {t('invoices.cancel')}
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
            >
              {t('invoices.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
