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

export default function BankDetailsListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchBankDetails = async () => {
      if (!token) {
        setIsLoading(false);
        toast.error('Authentication token not found');
        return;
      }

      try {
        const response = await getBankDetailsList({
          token,
          offset: 1,
          limit: 10,
        });

        // Try both possible response structures
        if (response?.data?.data?.results?.bankDetails) {
          setData(response.data.data.results.bankDetails);
        } else if (response?.data?.results?.bankDetails) {
          setData(response.data.results.bankDetails);
        } else {
          toast.error('Failed to fetch bank details');
        }
      } catch (error: any) {
        console.error('Error fetching bank details:', error);
        toast.error('Error fetching bank details', { duration: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, [token]);

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
          <span className='text-gray-800'> | {t('Bank Details')}</span>
        </h2>
        <Link href='bank-details-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            {t('Add Bank Details') || t('bankDetails.add')}
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
                <TableHead>{t('Country')}</TableHead>
                <TableHead>{t('Account Number')}</TableHead>
                <TableHead>{t('Iban')}</TableHead>
                <TableHead>{t('Bank Name')}</TableHead>
                <TableHead>{t('Swift Code')}</TableHead>
                <TableHead>{t('Beneficiary Name')}</TableHead>
                <TableHead className='w-10'>{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-center py-8'
                >
                  <span className='text-gray-500'>Loading bank details...</span>
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
                <TableHead>{t('Country')}</TableHead>
                <TableHead>{t('Account Number')}</TableHead>
                <TableHead>{t('Iban')}</TableHead>
                <TableHead>{t('Bank Name')}</TableHead>
                <TableHead>{t('Swift Code')}</TableHead>
                <TableHead>{t('Beneficiary Name')}</TableHead>
                <TableHead className='w-10'>{t('Actions')}</TableHead>
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
                    <TableCell className='font-medium'>{index + 1}</TableCell>
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
                            {t('Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() =>
                              handleDeleteClick(row.id, row.beneficiaryName)
                            }
                          >
                            {t('Delete')}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Confirm Delete')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete the bank detail for')}{' '}
              <strong>{deleteItemName}</strong>?{' '}
              {t('This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              {t('Cancel')}
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('Deleting...') : t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
