import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import React from 'react';

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

interface BusinessDetailsTableProps {
  data: BusinessDetail[];
  isLoading: boolean;
  handleEdit: (id: string) => void;
  handleDeleteClick: (id: string, companyName: string) => void;
  t: any;
}

export const BusinessDetailsTable: React.FC<BusinessDetailsTableProps> = ({
  data,
  isLoading,
  handleEdit,
  handleDeleteClick,
  t,
}) => {
  return (
    <div className='border rounded-lg overflow-hidden'>
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
                className='text-center py-10'
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <Spinner className='h-8 w-8' />
                  <span className='text-gray-500'>
                    {t('profile.loading', {
                      defaultValue: 'Loading business details...',
                    })}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='text-center py-10 text-gray-500'
              >
                {t('profile.noDetailsAdded') || 'No business details added yet'}
              </TableCell>
            </TableRow>
          ) : (
            data.map((detail, index) => (
              <TableRow
                key={detail.id}
                className='group hover:bg-gray-50 transition-colors'
              >
                <TableCell className='text-center font-medium group-hover:text-blue-600'>
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
  );
};
