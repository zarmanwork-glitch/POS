import { Button } from '@/components/ui/button';
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
import { Spinner } from '@/components/ui/spinner';
import { Customer } from '@/types/customerTypes';
import { MoreHorizontal } from 'lucide-react';
import { CustomerTableProps } from '@/types/componentTypes';

export const CustomerTable = ({
  customers,
  isLoading,
  page,
  limit,
  onEdit,
  onDelete,
  t,
}: CustomerTableProps) => {
  return (
    <div className='border rounded-lg overflow-x-auto'>
      <Table className='min-w-200'>
        <TableHeader className='bg-blue-50'>
          <TableRow>
            <TableHead>{t('customers.table.no')}</TableHead>
            <TableHead>{t('profile.name')}</TableHead>
            <TableHead>{t('profile.email')}</TableHead>
            <TableHead>{t('profile.phoneNumber')}</TableHead>
            <TableHead>{t('customers.table.address')}</TableHead>
            <TableHead>{t('profile.country')}</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className='text-center py-8'>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <Spinner className='h-8 w-8' />
                  <span className='text-gray-500'>
                    {t('customers.loadingCustomers')}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : customers.length === 0 ? (
            <TableRow>
            <TableCell colSpan={7} className='text-center py-16'>
              <div className='flex flex-col items-center justify-center gap-3'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-slate-100'>
                  <svg className='h-7 w-7 text-slate-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                </div>
                <p className='text-sm font-medium text-slate-600'>No customers found</p>
                <p className='text-xs text-slate-400'>Add your first customer to get started</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
            customers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell className='font-medium'>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  {customer.addressStreet}
                  {customer.buildingNumber && `, ${customer.buildingNumber}`}
                </TableCell>
                <TableCell>{customer.country}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => onEdit(customer.id)}>
                        {t('profile.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => onDelete(customer.id, customer.name)}
                      >
                        {t('profile.delete')}
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
