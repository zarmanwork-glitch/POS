'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/number';

const invoices = [
  {
    id: 'INV-00535',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-20',
    amount: 1496096.09,
    currency: 'SAR',
  },
  {
    id: 'INV-00534',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-20',
    amount: 852313.17,
    currency: 'SAR',
  },
  {
    id: 'INV-00533',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-19',
    amount: 25968.15,
    currency: 'SAR',
  },
  {
    id: 'INV-00532',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-19',
    amount: 1080.6,
    currency: 'SAR',
  },
  {
    id: 'INV-00531',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-18',
    amount: 8224.8,
    currency: 'SAR',
  },

  {
    id: 'INV-00530',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-18',
    amount: 45210.75,
    currency: 'SAR',
  },
  {
    id: 'INV-00529',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-17',
    amount: 234500.0,
    currency: 'SAR',
  },
  {
    id: 'INV-00528',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-17',
    amount: 17890.4,
    currency: 'SAR',
  },
  {
    id: 'INV-00527',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-16',
    amount: 9120.0,
    currency: 'SAR',
  },
  {
    id: 'INV-00526',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-16',
    amount: 60250.99,
    currency: 'SAR',
  },

  {
    id: 'INV-00525',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-15',
    amount: 450000.0,
  },
  {
    id: 'INV-00524',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-15',
    amount: 7340.65,
  },
  {
    id: 'INV-00523',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-14',
    amount: 18990.0,
  },
  {
    id: 'INV-00522',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-14',
    amount: 32110.25,
  },
  {
    id: 'INV-00521',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-13',
    amount: 980000.0,
  },

  {
    id: 'INV-00520',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-13',
    amount: 6450.5,
  },
  {
    id: 'INV-00519',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-12',
    amount: 13450.0,
  },
  {
    id: 'INV-00518',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-12',
    amount: 28760.8,
  },
  {
    id: 'INV-00517',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-11',
    amount: 1496096.09,
  },
  {
    id: 'INV-00516',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-11',
    amount: 852313.17,
  },

  {
    id: 'INV-00515',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-10',
    amount: 25968.15,
  },
  {
    id: 'INV-00514',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-10',
    amount: 1080.6,
  },
  {
    id: 'INV-00513',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-09',
    amount: 8224.8,
  },
  {
    id: 'INV-00512',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-09',
    amount: 41200.0,
  },
  {
    id: 'INV-00511',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-08',
    amount: 675000.0,
  },

  {
    id: 'INV-00510',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-08',
    amount: 9980.3,
  },
  {
    id: 'INV-00509',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-07',
    amount: 14560.0,
  },
  {
    id: 'INV-00508',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-07',
    amount: 38990.45,
  },
  {
    id: 'INV-00507',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-06',
    amount: 520000.0,
  },

  {
    id: 'INV-00506',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-06',
    amount: 7210.0,
  },
  {
    id: 'INV-00505',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-05',
    amount: 16230.75,
  },
  {
    id: 'INV-00504',
    customer: 'Company D - Saudi Arabia',
    date: '2025-12-05',
    amount: 47000.0,
  },
  {
    id: 'INV-00503',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-04',
    amount: 810000.0,
  },
  {
    id: 'INV-00502',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-04',
    amount: 5600.9,
  },

  {
    id: 'INV-00501',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-03',
    amount: 19340.0,
  },
];

export default function InvoicePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const { t } = useTranslation();

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.includes(search) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold'>
            <span className='text-gradient-brand'>
              {t('invoices.documents')}
            </span>
            <span className='text-gray-800'>
              {' '}
              | {t('invoices.invoiceList')}
            </span>
          </h2>
        </div>
        <Button className='gradient-brand hover:opacity-90 transition-opacity shadow-md shadow-blue-600/20'>
          + {t('invoices.newInvoice')}
        </Button>
      </div>

      {/* Filters & Actions */}
      <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center'>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder={t('invoices.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              {t('invoices.status')}:{' '}
              {t('invoices.all', { defaultValue: 'All' })}
            </SelectItem>
            <SelectItem value='paid'>
              {t('invoices.paid', { defaultValue: 'Paid' })}
            </SelectItem>
            <SelectItem value='pending'>
              {t('invoices.pending', { defaultValue: 'Pending' })}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder={t('invoices.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              {t('invoices.type')}: {t('invoices.all', { defaultValue: 'All' })}
            </SelectItem>
            <SelectItem value='standard'>
              {t('invoices.standard', { defaultValue: 'Standard' })}
            </SelectItem>
            <SelectItem value='proforma'>
              {t('invoices.proforma', { defaultValue: 'Proforma' })}
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          type='date'
          className='w-full sm:w-40'
          placeholder={t('invoices.startDate')}
        />

        <Input
          type='date'
          className='w-full sm:w-40'
          placeholder={t('invoices.endDate')}
        />

        <Input
          type='text'
          className='flex-1 min-w-0 sm:min-w-48'
          placeholder={t('invoices.searchInvoiceNumber', {
            defaultValue: 'Search Invoice Number',
          })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className='border rounded-lg overflow-x-auto'>
        <Table>
          <TableHeader className='bg-slate-100'>
            <TableRow>
              <TableHead className='w-12'>{t('invoices.table.no')}</TableHead>
              <TableHead>{t('invoices.table.invoice')}</TableHead>
              <TableHead>{t('invoices.table.customer')}</TableHead>
              <TableHead>{t('invoices.table.dueDate')}</TableHead>
              <TableHead>{t('invoices.table.amount')}</TableHead>
              <TableHead className='w-10'>
                {t('invoices.table.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-6 text-gray-400'
                >
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((inv, idx) => (
                <TableRow key={inv.id} className='hover:bg-gray-50'>
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  <TableCell>
                    <div className='font-medium'>{inv.id}</div>
                    <div className='text-sm text-gray-500'>
                      {t('invoices.standard', { defaultValue: 'standard' })}
                    </div>
                    <div className='text-xs text-gray-400'>{inv.date}</div>
                  </TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell className='font-medium'>
                    {formatCurrency(inv.amount, inv.currency ?? 'SAR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                          {t('invoices.view', { defaultValue: 'View' })}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {t('invoices.edit', { defaultValue: 'Edit' })}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {t('invoices.download')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          {t('invoices.delete')}
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
    </div>
  );
}
