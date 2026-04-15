'use client';

import { deleteCustomer } from '@/api/customers/customer.api';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CustomerTable } from '@/components/page-component/CustomerTable';
import { CustomerListControls } from '@/components/page-component/CustomerListControls';
import { CustomerFiltersPanel } from '@/components/page-component/CustomerFiltersPanel';
import { DeleteCustomerDialog } from '@/components/page-component/DeleteCustomerDialog';
import { useCustomerListData } from '@/hooks/useCustomerListData';
import { useCustomerListFilters } from '@/hooks/useCustomerListFilters';
import Cookies from 'js-cookie';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function CustomerListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [deleteCustomerName, setDeleteCustomerName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    searchCustomer,
    setSearchCustomer,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    searchBy,
    setSearchBy,
    page,
    setPage,
    filters,
    setFilters,
  } = useCustomerListFilters();

  const { customers, setCustomers, isLoading, totalItems } =
    useCustomerListData({
      page,
      limit: 10,
      searchBy,
      search: searchCustomer,
      sortBy,
      orderBy,
      status: filters.status,
      country: filters.country,
    });

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

      const response = await deleteCustomer({
        token,
        customerId: deleteCustomerId,
      });

      const message =
        response?.data?.data?.results?.error?.message ||
        response?.data?.message ||
        '';
      if (message === 'customer_linked_with_invoice') {
        setDeleteModalOpen(false);
        toast.error(
          'This customer cannot be deleted because it is linked to an invoice.',
          { duration: 4000 },
        );
        return;
      }

      toast.success(`Customer "${deleteCustomerName}" deleted successfully`, {
        duration: 2000,
      });
      setCustomers(
        customers.filter((customer) => customer.id !== deleteCustomerId),
      );
      setDeleteModalOpen(false);
      setDeleteCustomerId(null);
      setDeleteCustomerName('');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      const message =
        error?.response?.data?.data?.results?.error?.message ||
        error?.response?.data?.message ||
        '';
      if (message === 'customer_linked_with_invoice') {
        setDeleteModalOpen(false);
        toast.error(
          'This customer cannot be deleted because it is linked to an invoice.',
          { duration: 4000 },
        );
      } else {
        toast.error('Error deleting customer', { duration: 2000 });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold'>
            <span className='text-gradient-brand'>
              {t('sidebar.customers')}
            </span>{' '}
            <span className='text-gray-800'>| {t('customers.listTitle')}</span>
          </h2>
        </div>
        <Link href='/customers/customer-form' className='w-full sm:w-auto'>
          <Button className='gradient-brand hover:opacity-90 transition-opacity gap-2 w-full sm:w-auto shadow-md shadow-blue-600/20'>
            <Plus className='h-4 w-4' />
            {t('customers.addCustomer')}
          </Button>
        </Link>
      </div>

      <p className='text-sm text-gray-600'>
        {t('customers.showingAllCustomers')}
      </p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <CustomerListControls
          searchCustomer={searchCustomer}
          setSearchCustomer={setSearchCustomer}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          setPage={setPage}
          onShowFilters={() => setShowFilters(true)}
          showFilters={showFilters}
          filters={filters}
          setFilters={setFilters}
          t={t}
        />

        {/* Filters Panel */}
        {/* <CustomerFiltersPanel
          showFilters={showFilters}
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
          t={t}
        /> */}

        {/* Table */}
        <CustomerTable
          customers={customers}
          isLoading={isLoading}
          page={page}
          limit={10}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          t={t}
        />
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
                const totalPages = Math.ceil(totalItems / 10);
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
                  ),
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < Math.ceil(totalItems / 10)) setPage(page + 1);
                  }}
                  className={
                    page >= Math.ceil(totalItems / 10)
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
      <DeleteCustomerDialog
        open={deleteModalOpen}
        customerName={deleteCustomerName}
        isDeleting={isDeleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        t={t}
      />
    </div>
  );
}
