'use client';

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
import { X, Plus } from 'lucide-react';
import { formatNumber, parseNumber } from '@/lib/number';

interface Item {
  description: string;
  serviceCode: string;
  unitOfMeasure: string;
  quantity: number | string;
  unitRate: number | string;
  discount: number | string;
  discountType: 'PERC' | 'NUMBER';
  taxRate: number | string;
  taxCode: string;
}

interface ItemDetailsSectionProps {
  items: Item[];
  unitOfMeasures: Array<{ value: string; displayText: string }>;
  taxCodes: Array<{ value: string; displayText: string }>;
  updateItem: (idx: number, field: string, value: any) => void;
  removeItem: (idx: number) => void;
  addItem: () => void;
}

export default function ItemDetailsSection({
  items,
  unitOfMeasures,
  taxCodes,
  updateItem,
  removeItem,
  addItem,
}: ItemDetailsSectionProps) {
  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
        <h3 className='text-xs font-semibold tracking-wide'>ITEM DETAILS</h3>

        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>
            Currency: <span className='text-red-500'>*</span>
          </span>
          <div className='w-44 h-9 bg-blue-50 border rounded-md px-3 flex items-center text-xs font-medium'>
            SAR – Saudi Riyal
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className='hidden md:block border rounded-lg overflow-x-auto'>
        <Table className='text-xs'>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead>No.</TableHead>
              <TableHead>Item / Service</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Rate</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>VAT %</TableHead>
              <TableHead>Tax Code</TableHead>
              <TableHead>Total</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((row, idx) => {
              const quantity = parseNumber(row.quantity) || 0;
              const unitRate = parseNumber(row.unitRate) || 0;
              const discountValue = parseNumber(row.discount) || 0;
              const vatPercent = parseNumber(row.taxRate) || 0;

              const price = quantity * unitRate;
              const discount = quantity * discountValue;

              let discountAmount = 0;
              let vatAmount = 0;
              let totalAmount = 0;
              let taxableAmount = 0;

              // Use formulas depending on discount type
              if (row.discountType === 'PERC') {
                // i) discount in percentage
                // VAT Amount = Price × (1 − Discount%/100) × (VAT%/100)
                // Final Total = Price × (1 − Discount%/100) × (1 + VAT%/100)
                const taxable = price * (1 - discountValue / 100);
                discountAmount = price * (discountValue / 100);
                const vat = 1 + vatPercent / 100;
                vatAmount = taxable * (vatPercent / 100);
                totalAmount = taxable * vat;
                taxableAmount = totalAmount / vat;
              } else {
                // ii) discount is a fixed number
                // VAT Amount = (Price − Discount) × (VAT% / 100)
                // Final Total = (Price − Discount) × (1 + VAT% / 100)
                const taxable = price - discount;
                discountAmount = discount;
                vatAmount = taxable * (vatPercent / 100);
                totalAmount = taxable * (1 + vatPercent / 100);
                taxableAmount = price - discount;
              }

              return (
                <TableRow
                  key={idx}
                  className='align-top'
                >
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  {/* Description */}
                  <TableCell>
                    <div className='space-y-2'>
                      <Input
                        className='bg-blue-50 h-9 text-xs'
                        placeholder='Description'
                        value={row.description}
                        onChange={(e) =>
                          updateItem(idx, 'description', e.target.value)
                        }
                      />
                      <div className='flex gap-2'>
                        <Input
                          className='bg-blue-50 h-9 text-xs'
                          placeholder='Service Code'
                          value={row.serviceCode}
                          onChange={(e) =>
                            updateItem(idx, 'serviceCode', e.target.value)
                          }
                        />
                        <Select
                          value={row.unitOfMeasure}
                          onValueChange={(v) =>
                            updateItem(idx, 'unitOfMeasure', v)
                          }
                        >
                          <SelectTrigger className='bg-blue-50 h-9 text-xs w-24'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOfMeasures.map((u) => (
                              <SelectItem
                                key={u.value}
                                value={u.value}
                              >
                                {u.displayText}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TableCell>
                  {/* Quantity */}
                  <TableCell>
                    <Input
                      type='number'
                      className='bg-blue-50 h-9 text-xs'
                      value={row.quantity}
                      onChange={(e) =>
                        updateItem(idx, 'quantity', parseNumber(e.target.value))
                      }
                    />
                  </TableCell>
                  {/* Rate */}
                  <TableCell>
                    <Input
                      type='number'
                      className='bg-blue-50 h-9 text-xs'
                      value={row.unitRate}
                      onChange={(e) =>
                        updateItem(idx, 'unitRate', e.target.value)
                      }
                    />
                  </TableCell>
                  {/* Discount */}
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() =>
                          updateItem(
                            idx,
                            'discountType',
                            row.discountType === 'PERC' ? 'NUMBER' : 'PERC'
                          )
                        }
                      >
                        {row.discountType === 'PERC' ? 'PERC %' : 'Number #'}
                      </Button>
                      <Input
                        type='number'
                        className='bg-blue-50 h-9 text-xs w-20'
                        value={row.discount}
                        onChange={(e) =>
                          updateItem(idx, 'discount', e.target.value)
                        }
                      />
                    </div>
                  </TableCell>
                  {/* VAT */}
                  <TableCell>
                    <Input
                      type='number'
                      className='bg-blue-50 h-9 text-xs'
                      value={row.taxRate}
                      onChange={(e) =>
                        updateItem(idx, 'taxRate', Number(e.target.value))
                      }
                    />
                  </TableCell>
                  {/* Tax Code */}
                  <TableCell>
                    <Select
                      value={row.taxCode}
                      onValueChange={(v) => updateItem(idx, 'taxCode', v)}
                    >
                      <SelectTrigger className='bg-blue-50 h-9 text-xs'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {taxCodes.map((tc) => (
                          <SelectItem
                            key={tc.value}
                            value={tc.value}
                          >
                            {tc.displayText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/* Total */}
                  <TableCell>
                    <div className='font-semibold text-sm'>
                      {formatNumber(totalAmount)}
                    </div>
                    <div className='text-[11px] text-gray-500'>
                      VAT: {formatNumber(vatAmount)}
                    </div>
                  </TableCell>
                  {/* Remove */}
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => removeItem(idx)}
                    >
                      <X className='h-4 w-4 text-red-500' />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className='md:hidden space-y-3'>
        {items.map((row, idx) => (
          <div
            key={idx}
            className='border rounded-lg p-3 space-y-2 bg-white'
          >
            <div className='flex justify-between text-xs font-semibold'>
              <span>Item #{idx + 1}</span>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => removeItem(idx)}
              >
                <X className='h-4 w-4 text-red-500' />
              </Button>
            </div>

            <Input
              className='bg-blue-50 h-9 text-xs'
              placeholder='Description'
              value={row.description}
              onChange={(e) => updateItem(idx, 'description', e.target.value)}
            />

            <div className='grid grid-cols-2 gap-2'>
              <Input
                type='number'
                className='bg-blue-50 h-9 text-xs'
                placeholder='Qty'
                value={row.quantity}
                onChange={(e) =>
                  updateItem(idx, 'quantity', parseNumber(e.target.value))
                }
              />
              <Input
                type='number'
                className='bg-blue-50 h-9 text-xs'
                placeholder='Rate'
                value={row.unitRate}
                onChange={(e) => updateItem(idx, 'unitRate', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Button
        variant='outline'
        size='sm'
        onClick={addItem}
      >
        <Plus className='h-4 w-4 mr-2' />
        Add Item
      </Button>
    </div>
  );
}
