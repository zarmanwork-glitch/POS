'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useBusinessDetailsList } from '@/hooks/useBusinessDetailsList';
import { BusinessDetailsTable } from '@/components/page-component/BusinessDetailsTable';
import { BusinessDetailsPagination } from '@/components/page-component/BusinessDetailsPagination';
import { DeleteBusinessDetailsDialog } from '@/components/page-component/DeleteBusinessDetailsDialog';
export default function BusinessDetailsListPage() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    page,
    setPage,
    limit,
    totalItems,
    hasMore,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteItemId,
    deleteItemName,
    isDeleting,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
  } = useBusinessDetailsList();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('profile.title')}</span>
          <span className='text-gray-800'>
            | {t('profile.businessDetails')}
          </span>
        </h2>
        <Link href='/profile/business-details/business-details-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            {/* Plus icon can be added inside the Button component if needed */}
            {t('profile.addMore')}
          </Button>
        </Link>
      </div>
      {/* Description */}
      <p className='text-sm text-gray-600'>
        {t('profile.showingAll')} ({data.length}
        {data.length === 1 ? 'entry' : 'entries'})
      </p>
      {/* Table */}
      <BusinessDetailsTable
        data={data}
        isLoading={isLoading}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        t={t}
      />
      {/* Pagination */}
      {data.length > 0 && (
        <BusinessDetailsPagination
          page={page}
          setPage={setPage}
          limit={limit}
          totalItems={totalItems}
          hasMore={hasMore}
        />
      )}
      {/* Delete Confirmation Modal */}
      <DeleteBusinessDetailsDialog
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        isDeleting={isDeleting}
        deleteItemName={deleteItemName}
        confirmDelete={confirmDelete}
        t={t}
      />
    </div>
  );
}
