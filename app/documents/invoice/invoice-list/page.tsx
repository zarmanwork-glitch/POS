'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { downloadInvoicePdf } from '@/api/invoices/invoice.api';
import { useInvoiceListFilters } from '@/hooks/useInvoiceListFilters';
import { useInvoiceListData } from '@/hooks/useInvoiceListData';
import { InvoiceControlsBar } from '@/components/page-component/InvoiceControlsBar';
import { InvoiceFilterPanel } from '@/components/page-component/InvoiceFilterPanel';
import { InvoiceTable } from '@/components/page-component/InvoiceTable';
import { InvoicePagination } from '@/components/page-component/InvoicePagination';

export default function InvoiceListPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Use custom hooks for filters and data
  const filters = useInvoiceListFilters();
  const { items, loading, totalCount, totalPages, limit } = useInvoiceListData({
    page: filters.page,
    sortBy: filters.sortBy,
    orderBy: filters.orderBy,
    searchBy: filters.searchBy,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
    statusFilter: filters.statusFilter,
    typeFilter: filters.typeFilter,
  });

  const handleDownloadPdf = async (invoiceId: string) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error('Authentication error');
        return;
      }

      const response = await downloadInvoicePdf({
        token,
        invoiceId,
      });

      if (response?.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Invoice PDF downloaded');
      } else {
        toast.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice PDF');
    }
  };

  const handlePreview = (invoiceId: string) => {
    console.log('Preview invoice:', invoiceId);
    toast.info('Preview feature coming soon');
  };

  const handleViewDetails = (invoiceId: string) => {
    console.log('View invoice details:', invoiceId);
    toast.info('View details feature coming soon');
  };

  const handleEmailInvoice = (invoiceId: string) => {
    console.log('Email invoice:', invoiceId);
    toast.info('Email feature coming soon');
  };

  return (
    <div
      className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
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

      {/* Controls and Filters */}
      <div className='space-y-4'>
        <InvoiceControlsBar
          search={filters.search}
          searchBy={filters.searchBy}
          sortBy={filters.sortBy}
          orderBy={filters.orderBy}
          showFilters={filters.showFilters}
          activeFilters={filters.getActiveFilters()}
          loading={loading}
          isRTL={isRTL}
          onSearchChange={filters.setSearch}
          onSearchByChange={(value) =>
            filters.setSearchBy(
              value as
                | 'invoiceNumber'
                | 'customerPoNumber'
                | 'name'
                | 'companyName'
                | 'customerNumber'
            )
          }
          onSortByChange={filters.setSortBy}
          onOrderByChange={() => {
            filters.setOrderBy(filters.orderBy === 'desc' ? 'asc' : 'desc');
            filters.setPage(1);
          }}
          onShowFilters={() => filters.setShowFilters(true)}
          onClearFilter={filters.clearFilter}
          onSearch={() => filters.setPage(1)}
          onDownload={() => {
            console.log('Download invoices');
          }}
          t={t}
        />

        {/* Date Filters */}
        <div className='flex gap-4 items-end'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('invoices.startDate')}
            </label>
            <Input
              type='date'
              value={filters.startDate}
              onChange={(e) => {
                filters.setStartDate(e.target.value);
                filters.setPage(1);
              }}
              className='h-10'
            />
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('invoices.endDate')}
            </label>
            <Input
              type='date'
              value={filters.endDate}
              onChange={(e) => {
                filters.setEndDate(e.target.value);
                filters.setPage(1);
              }}
              className='h-10'
            />
          </div>
        </div>

        {/* Filter Panel */}
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={items}
        loading={loading}
        page={filters.page}
        limit={limit}
        onDownloadPdf={handleDownloadPdf}
        onPreview={handlePreview}
        onViewDetails={handleViewDetails}
        onEmailInvoice={handleEmailInvoice}
        t={t}
      />

      {/* Pagination */}
      {(totalCount ?? items.length) > 0 && (
        <InvoicePagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={filters.setPage}
        />
      )}
    </div>
  );
}
