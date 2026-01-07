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
import { calculateItemRow } from '@/utils/itemCalculations';
import {
  Item,
  SelectableItem,
  ItemDetailsSectionProps,
} from '@/types/itemTypes';
import { useState } from 'react';

export default function ItemDetailsSection({
  items,
  unitOfMeasures,
  taxCodes,
  updateItem,
  removeItem,
  addItem,
  itemOptions,
  itemSearch,
  setItemSearch,
}: ItemDetailsSectionProps) {
  const [focusedItemIdx, setFocusedItemIdx] = useState<number | null>(null);

  // Filter items by description
  const filteredItems = Array.isArray(itemOptions)
    ? itemOptions.filter((item) => {
        const query = itemSearch.toLowerCase();
        return (
          (item.description &&
            item.description.toLowerCase().includes(query)) ||
          (item.name && item.name.toLowerCase().includes(query))
        );
      })
    : [];

  const handleSelectItem = (itemId: string, itemIndex: number) => {
    const selected = itemOptions.find((i) => {
      const id = i.id || i._id;
      return id === itemId;
    });

    if (selected) {
      updateItem(itemIndex, 'description', selected.description || '');
      updateItem(itemIndex, 'serviceCode', selected.materialNo || '');
      updateItem(itemIndex, 'unitOfMeasure', selected.unitOfMeasure || '');
      updateItem(itemIndex, 'unitRate', selected.sellPrice || '');
      updateItem(itemIndex, 'discount', selected.discountPercentage || '');
      setItemSearch('');
      setFocusedItemIdx(null);
    }
  };

  const handleTaxCodeChange = (taxCode: string, itemIndex: number) => {
    updateItem(itemIndex, 'taxCode', taxCode);
    // Set based on tax code
    const vatMap: { [key: string]: number } = {
      S: 15,
      Z: 0,
      O: 0,
      E: 0,
    };
    updateItem(itemIndex, 'taxRate', vatMap[taxCode] || 15);
  };

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

      {/* Table */}
      <div className='border rounded-lg overflow-x-auto'>
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
              const { discountAmount, vatAmount, totalAmount } =
                calculateItemRow(row);

              return (
                <TableRow
                  key={idx}
                  className='align-top'
                >
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  {/* Description */}
                  <TableCell>
                    <div className='space-y-2'>
                      <div className='relative'>
                        <Input
                          className='bg-blue-50 h-9 text-xs'
                          placeholder='Search or type description'
                          value={row.description}
                          onChange={(e) => {
                            updateItem(idx, 'description', e.target.value);
                            setItemSearch(e.target.value);
                          }}
                          onFocus={() => {
                            setFocusedItemIdx(idx);
                          }}
                          onBlur={() => {
                            setTimeout(() => setFocusedItemIdx(null), 200);
                          }}
                        />
                        {/* Item dropdown suggestions - show when focused */}
                        {focusedItemIdx === idx && itemOptions.length > 0 && (
                          <div className='absolute z-20  w-full mt-1 bg-white border rounded-md shadow-lg h-32 overflow-y-auto flex flex-col'>
                            {(itemSearch ? filteredItems : itemOptions).map(
                              (item) => (
                                <button
                                  key={item.id || item._id}
                                  type='button'
                                  className='w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b last:border-b-0 whitespace-nowrap overflow-hidden text-ellipsis'
                                  onClick={() => {
                                    handleSelectItem(
                                      item.id || item._id || '',
                                      idx
                                    );
                                  }}
                                >
                                  {item.description}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
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
                      readOnly
                      disabled
                    />
                  </TableCell>
                  {/* Tax Code */}
                  <TableCell>
                    <Select
                      value={row.taxCode}
                      onValueChange={(v) => handleTaxCodeChange(v, idx)}
                    >
                      <SelectTrigger className='bg-blue-50 h-9 text-xs'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {taxCodes.map((tc) => (
                          <SelectItem
                            key={tc.value}
                            value={tc.value}
                            textValue={`${tc.value} ${tc.displayText}`}
                            className='py-3'
                          >
                            <div className='flex flex-col gap-1'>
                              <span className='font-medium leading-none'>
                                {tc.value}
                              </span>
                              <span className='text-sm text-muted-foreground leading-snug'>
                                {tc.displayText}
                              </span>
                            </div>
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
