'use client';

import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import {
  getBankDetailsList,
  deleteBankDetails,
} from '@/api/bank-details/bank-details.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BankDetail } from '@/types/bankDetailTypes';
import { Spinner } from '@/components/ui/spinner';

export default function BankDetailsListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<BankDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchBankDetails = async () => {
      const token = Cookies.get('authToken');

      if (!token) {
        setIsLoading(false);
        toast.error('Authentication token not found');
        return;
      }

      try {
        setIsLoading(true);
        const offset = Math.max(0, (page - 1) * limit);
        const response = await getBankDetailsList({
          token,
          offset,
          limit,
        });

        let details: any[] = [];

        if (response?.data?.data?.results?.bankDetails) {
          details = response.data.data.results.bankDetails;
        } else if (response?.data?.results?.bankDetails) {
          details = response.data.results.bankDetails;
        } else if (Array.isArray(response?.data?.results)) {
          details = response.data.results;
        }

        setData(details);

        // extract total if present in various shapes
        const results =
          response?.data?.data?.results || response?.data?.results || {};
        const total =
          results?.total ||
          results?.totalCount ||
          results?.totalRecords ||
          results?.count ||
          results?.recordsCount ||
          response?.data?.total ||
          response?.data?.totalCount ||
          response?.data?.recordsCount ||
          0;

        if (typeof total === 'number' && total > 0) {
          setTotalItems(total);
        } else if (Array.isArray(details) && details.length > 0) {
          // Derive total from current page and fetched items so pagination
          // only shows pages that actually exist
          setTotalItems((page - 1) * limit + details.length);
        } else {
          setTotalItems(0);
        }

        setHasMore(Array.isArray(details) ? details.length >= limit : false);
      } catch (error: any) {
        console.error('Error fetching bank details:', error);
        toast.error('Error fetching bank details', { duration: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, [page]);

  const handleEdit = (id: string) => {
    router.push(`/profile/bank-details/bank-details-form?id=${id}`);
  };

  const handleDeleteClick = (id: string, beneficiaryName: string) => {
    setDeleteItemId(id);
    setDeleteItemName(beneficiaryName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    const token = Cookies.get('authToken');
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteBankDetails({
        token,
        bankDetailsId: deleteItemId,
      });

      if (response?.data?.status === 'success') {
        toast.success(
          `Bank detail for "${deleteItemName}" deleted successfully`,
          {
            duration: 2000,
          }
        );
        setData(data.filter((item) => item.id !== deleteItemId));
        setTotalItems(Math.max(0, totalItems - 1));
        setDeleteModalOpen(false);
        setDeleteItemId(null);
        setDeleteItemName('');
      } else {
        toast.error('Failed to delete bank detail');
      }
    } catch (error: any) {
      console.error('Error deleting bank details:', error);
      toast.error('Error deleting bank detail', { duration: 2000 });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('profile.title')}</span>
          <span className='text-gray-800'>
            {' '}
            | {t('profile.bankDetails.title')}
          </span>
        </h2>
        <Link href='bank-details-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            {t('profile.bankDetails.addBankDetails')}
          </Button>
        </Link>
      </div>

      {/* Description */}
      <p className='text-sm text-gray-600'>{t('profile.showingAll')}</p>

      {/* Loading State */}
      {isLoading ? (
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-slate-100'>
              <TableRow>
                <TableHead className='w-12'>No.</TableHead>
                <TableHead>{t('profile.bankDetails.country')}</TableHead>
                <TableHead>{t('profile.bankDetails.accountNumber')}</TableHead>
                <TableHead>{t('profile.bankDetails.iban')}</TableHead>
                <TableHead>{t('profile.bankDetails.bankName')}</TableHead>
                <TableHead>{t('profile.bankDetails.swiftCode')}</TableHead>
                <TableHead>
                  {t('profile.bankDetails.beneficiaryName')}
                </TableHead>
                <TableHead className='w-10'>{t('profile.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center py-8'
                >
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Spinner className='h-8 w-8' />
                    <span className='text-gray-500'>
                      {t('profile.loading', {
                        defaultValue: 'Loading bank details...',
                      })}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-slate-100'>
              <TableRow>
                <TableHead className='w-12'>No.</TableHead>
                <TableHead>{t('profile.bankDetails.country')}</TableHead>
                <TableHead>{t('profile.bankDetails.accountNumber')}</TableHead>
                <TableHead>{t('profile.bankDetails.iban')}</TableHead>
                <TableHead>{t('profile.bankDetails.bankName')}</TableHead>
                <TableHead>{t('profile.bankDetails.swiftCode')}</TableHead>
                <TableHead>
                  {t('profile.bankDetails.beneficiaryName')}
                </TableHead>
                <TableHead className='w-10'>{t('profile.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-center py-8 text-gray-500'
                  >
                    {t('profile.noDetailsAdded')}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className='hover:bg-gray-50'
                  >
                    <TableCell className='font-medium'>
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.accountNumber}</TableCell>
                    <TableCell>{row.iban}</TableCell>
                    <TableCell>{row.bankName}</TableCell>
                    <TableCell>{row.swiftCode}</TableCell>
                    <TableCell>{row.beneficiaryName}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='p-2 rounded-md hover:bg-gray-100'>
                            <MoreHorizontal className='h-4 w-4' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                            {t('profile.edit', { defaultValue: 'Edit' })}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() =>
                              handleDeleteClick(row.id, row.beneficiaryName)
                            }
                          >
                            {t('profile.delete', { defaultValue: 'Delete' })}
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
      )}

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
            <DialogTitle>
              {t('profile.confirmDelete', { defaultValue: 'Confirm Delete' })}
            </DialogTitle>
            <DialogDescription>
              {t('profile.areYouSureDelete', {
                defaultValue:
                  'Are you sure you want to delete the bank detail for',
              })}{' '}
              <strong>{deleteItemName}</strong>?{' '}
              {t('profile.actionCannotBeUndone', {
                defaultValue: 'This action cannot be undone.',
              })}
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
              {isDeleting ? (
                <>
                  <Spinner className='mr-2 h-4 w-4 text-white' />
                  {t('profile.deleting', { defaultValue: 'Deleting...' })}
                </>
              ) : (
                t('profile.delete', { defaultValue: 'Delete' })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
