import { Button } from '@/components/ui/button';
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
import { formatNumber } from '@/lib/number';
import { InvoiceTableProps } from '@/types/invoiceTypes';
import { Download, Eye, MoreHorizontal } from 'lucide-react';

export const InvoiceTable = ({
  invoices,
  loading,
  page,
  limit,
  onDownloadPdf,
  onPreview,
  t,
}: InvoiceTableProps) => {
  return (
    <div className='border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader className='bg-blue-50'>
          <TableRow>
            <TableHead className='w-12'>{t('invoices.table.no')}</TableHead>
            <TableHead>{t('invoices.table.invoice')}</TableHead>
            <TableHead>{t('invoices.table.customer')}</TableHead>
            <TableHead>{t('invoices.table.dueDate')}</TableHead>
            <TableHead>{t('invoices.table.amount')}</TableHead>
            <TableHead className='w-12'>
              {t('invoices.table.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='text-center py-8'
              >
                {loading ? 'Loading…' : t('invoices.noInvoicesFound')}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((inv, idx) => (
              <TableRow key={inv.id}>
                <TableCell className='text-center'>
                  {(page - 1) * limit + idx + 1}
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>
                      {inv.invoiceNumber}
                      <span className=''>{inv.invoiceType}</span>
                    </div>
                    <div className='text-xs text-gray-500'>
                      {inv.invoiceDate}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>{inv.customer}</div>
                    <div className='text-xs text-gray-500'>
                      {inv.customerLocation}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{inv.dueDate}</TableCell>
                <TableCell>
                  <div className='font-medium'>
                    {inv.currency} {formatNumber(inv.total)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align='end'
                      className='w-48'
                    >
                      <DropdownMenuItem onClick={() => onDownloadPdf(inv.id)}>
                        <Download className='mr-2 h-4 w-4' />
                        Download PDF
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => onPreview(inv.id)}>
                        <Eye className='mr-2 h-4 w-4' />
                        Preview
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
