'use client';

import {
  deleteBusinessDetails,
  getBusinessDetailsList,
} from '@/api/business-details/business-details.api';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Cookies from 'js-cookie';
import { MoreHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface BusinessDetail {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  vatNumber?: string;
  companyRegistrationNumber?: string;
  identificationNumber?: string;
  country: string;
}

export default function BusinessDetailsListPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [data, setData] = useState<BusinessDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!token) {
        setIsLoading(false);
        toast.error('Authentication token not found');
        return;
      }

      try {
        setIsLoading(true);
        const response = await getBusinessDetailsList({
          token,
          offset: 0,
          limit: 10,
        });

        let detailsList: BusinessDetail[] = [];

        // Match the structure from your successful add response
        if (response?.data?.results?.businessDetails) {
          detailsList = response.data.results.businessDetails;
        } else if (response?.data?.data?.results?.businessDetails) {
          detailsList = response.data.data.results.businessDetails;
        } else if (Array.isArray(response?.data?.results)) {
          detailsList = response.data.results;
        } else if (response?.data) {
          detailsList = [response.data];
        }

        setData(detailsList);
      } catch (error: any) {
        console.error('Error fetching business details:', error);
        toast.error('Failed to load business details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [token]);

  const handleEdit = (id: string) => {
    router.push(`/profile/business-details/business-details-form?id=${id}`);
  };

  const handleDeleteClick = (id: string, companyName: string) => {
    setDeleteItemId(id);
    setDeleteItemName(companyName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId || !token) return;

    try {
      setIsDeleting(true);

      // Assuming you have a deleteBusinessDetails API function
      const response = await deleteBusinessDetails({
        token,
        businessDetailsId: deleteItemId,
      });

      if (
        response?.data?.status === 'success' ||
        response?.status === 'success'
      ) {
        toast.success(
          `Business detail "${deleteItemName}" deleted successfully`
        );
        setData(data.filter((item) => item.id !== deleteItemId));
        setDeleteModalOpen(false);
        setDeleteItemId(null);
        setDeleteItemName('');
      } else {
        toast.error('Failed to delete business detail');
      }
    } catch (error: any) {
      console.error('Error deleting business detail:', error);
      toast.error('Error deleting business detail');
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
            | {t('profile.businessDetails')}
          </span>
        </h2>

        <Link href='/profile/business-details/business-details-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            {t('profile.addMore')}
          </Button>
        </Link>
      </div>

      {/* Description */}
      <p className='text-sm text-gray-600'>
        {t('profile.showingAll')} ({data.length}{' '}
        {data.length === 1 ? 'entry' : 'entries'})
      </p>

      {/* Table */}
      <div className=' border rounded-lg overflow-hidden '>
        <Table>
          <TableHeader className='bg-slate-100'>
            <TableRow>
              <TableHead className='w-12 text-center'>No.</TableHead>
              <TableHead>{t('profile.nameCompanyName')}</TableHead>
              <TableHead>{t('profile.contactInfo')}</TableHead>
              <TableHead>{t('profile.taxNumber')}</TableHead>
              <TableHead>{t('profile.country')}</TableHead>
              <TableHead className='w-20 text-center'>
                {t('profile.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-10 text-gray-500'
                >
                  {t('profile.loading', {
                    defaultValue: 'Loading business details...',
                  })}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-10 text-gray-500'
                >
                  {t('profile.noDetailsAdded') ||
                    'No business details added yet'}
                </TableCell>
              </TableRow>
            ) : (
              data.map((detail, index) => (
                <TableRow
                  key={detail.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <TableCell className='text-center font-medium'>
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <div className='font-medium'>{detail.name || 'N/A'}</div>
                    <div className='text-sm text-gray-500'>
                      {detail.companyName || 'N/A'}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='text-sm'>{detail.email || 'N/A'}</div>
                    <div className='text-xs text-gray-500'>
                      {detail.phoneNumber || 'N/A'}
                    </div>
                  </TableCell>

                  <TableCell className='text-sm'>
                    {detail.vatNumber ||
                      detail.companyRegistrationNumber ||
                      detail.identificationNumber ||
                      'N/A'}
                  </TableCell>

                  <TableCell className='text-sm'>
                    {detail.country || 'N/A'}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(detail.id)}>
                          {t('profile.edit', { defaultValue: 'Edit' })}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-600 focus:text-red-600'
                          onClick={() =>
                            handleDeleteClick(detail.id, detail.companyName)
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
                  'Are you sure you want to delete the business detail for',
              })}{' '}
              <strong>{deleteItemName}</strong>?
              <br />
              {t('profile.actionCannotBeUndone', {
                defaultValue: 'This action cannot be undone.',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 mt-4'>
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
              {isDeleting
                ? t('profile.deleting', { defaultValue: 'Deleting...' })
                : t('profile.delete', { defaultValue: 'Delete' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
