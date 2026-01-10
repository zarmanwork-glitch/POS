'use client';

import { Button } from '@/components/ui/button';
import { ToggleButton } from '@/components/base-components/ToggleButton';
import { Input } from '@/components/ui/input';
import { ExportType, exportTypeOptions } from '@/enums/exportType';
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
import { X, Plus, ChevronDown } from 'lucide-react';
import { formatNumber, parseNumber } from '@/lib/number';
import { calculateItemRow } from '@/utils/itemCalculations';
import {
  Item,
  SelectableItem,
  ItemDetailsSectionProps,
} from '@/types/itemTypes';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

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
  const [activeDescriptionIdx, setActiveDescriptionIdx] = useState<
    number | null
  >(null);
  const [activeTaxCodeIdx, setActiveTaxCodeIdx] = useState<number | null>(null);
  const [activeExportIdx, setActiveExportIdx] = useState<number | null>(null);

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
    if (taxCode === 'S') {
      updateItem(itemIndex, 'taxRate', 15);
      updateItem(itemIndex, 'vatSa32', undefined);
    } else if (taxCode === 'Z') {
      updateItem(itemIndex, 'taxRate', 0);
      // Show VATAX-SA-32 dropdown
    } else {
      const vatMap: { [key: string]: number } = {
        O: 0,
        E: 0,
      };
      updateItem(itemIndex, 'taxRate', vatMap[taxCode] || 15);
      updateItem(itemIndex, 'vatSa32', undefined);
    }
  };

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
        <Label className='text-xs font-semibold tracking-wide'>
          ITEM DETAILS
        </Label>
        <div className='flex items-center gap-2'>
          <Label className='text-xs text-gray-500'>
            Currency: <span className='text-red-500'>*</span>
          </Label>
          <div className='w-44 h-9 bg-blue-50 border rounded-md px-3 flex items-center text-xs font-medium'>
            SAR – Saudi Riyal
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='border rounded-lg'>
        <Table className='text-xs'>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead className='text-xs font-semibold text-gray-700'>
                NO.
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                ITEM / SERVICE DESCRIPTION
                <div className='text-[11px] text-gray-400 font-normal'>
                  MATERIAL / SERVICE CODE
                </div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                QUANTITY
                <div className='text-[11px] text-gray-400 font-normal'>UOM</div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                UNIT RATE
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                DISCOUNT
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                TAX RATE
                <div className='text-[11px] text-gray-400 font-normal'>
                  VAT EXEMPTION REASON
                </div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                TAX CODE
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                TOTAL
                <div className='text-[11px] text-gray-400 font-normal'>
                  VAT AMOUNT
                </div>
              </TableHead>
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
                  <TableCell className='font-medium bg-gray-50'>
                    {idx + 1}
                  </TableCell>
                  {/* Description & Service Code & Reporting Tags */}
                  <TableCell>
                    <div className='flex flex-col gap-2 relative'>
                      <div className='flex gap-2'>
                        <Input
                          className='bg-blue-50 h-9 text-xs flex-1'
                          placeholder='Description'
                          value={row.description}
                          onChange={(e) => {
                            updateItem(idx, 'description', e.target.value);
                            setItemSearch(e.target.value);
                          }}
                          onFocus={() => setActiveDescriptionIdx(idx)}
                          onBlur={() => {
                            setTimeout(
                              () => setActiveDescriptionIdx(null),
                              200
                            );
                          }}
                        />
                        {activeDescriptionIdx === idx &&
                          itemOptions.length > 0 && (
                            <div className='z-50 w-full mt-1 bg-white border rounded-md shadow-lg h-32 overflow-y-auto flex flex-col'>
                              {(itemSearch ? filteredItems : itemOptions).map(
                                (item) => (
                                  <Button
                                    key={item.id || item._id}
                                    type='button'
                                    variant='ghost'
                                    className='w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b last:border-b-0 whitespace-nowrap overflow-hidden text-ellipsis justify-start'
                                    onClick={() => {
                                      handleSelectItem(
                                        item.id || item._id || '',
                                        idx
                                      );
                                    }}
                                  >
                                    {item.description}
                                  </Button>
                                )
                              )}
                            </div>
                          )}
                        <Input
                          className='bg-blue-50 h-9 text-xs flex-1'
                          placeholder='Service Code'
                          value={row.serviceCode}
                          onChange={(e) =>
                            updateItem(idx, 'serviceCode', e.target.value)
                          }
                        />
                      </div>
                      <div className='flex gap-2'>
                        <div className='flex-1'>
                          <Label className='text-xs text-gray-500'>
                            Reporting Tags : (Used for tracking purposes.)
                          </Label>
                          <Input
                            className='bg-blue-50 h-9 text-xs mt-1 w-full'
                            placeholder='Tag Name Here'
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* Quantity */}
                  <TableCell>
                    <div className='flex flex-col gap-1'>
                      <Input
                        type='number'
                        className='bg-blue-50 h-9 text-xs'
                        value={row.quantity}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            'quantity',
                            parseNumber(e.target.value)
                          )
                        }
                      />
                      <Select
                        value={row.unitOfMeasure}
                        onValueChange={(v) =>
                          updateItem(idx, 'unitOfMeasure', v)
                        }
                      >
                        <SelectTrigger className='bg-blue-50 h-9 text-xs w-full'>
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
                  </TableCell>
                  {/* Unit Rate */}
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
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <ToggleButton
                          value={row.discountType}
                          onChange={(val) =>
                            updateItem(idx, 'discountType', val)
                          }
                          optionA={{ value: 'PERC', label: '%' }}
                          optionB={{ value: 'NUMBER', label: '#' }}
                          className='w-12 bg-transparent p-0'
                        />
                        <span className='text-xs font-semibold'>
                          {row.discountType === 'NUMBER' ? '%' : '#'}
                        </span>
                      </div>
                      <Input
                        type='number'
                        className='bg-blue-50 h-9 text-xs w-full'
                        value={row.discount}
                        onChange={(e) =>
                          updateItem(idx, 'discount', e.target.value)
                        }
                      />
                    </div>
                  </TableCell>
                  {/* VAT */}
                  <TableCell>
                    <div className='relative'>
                      <Input
                        type='number'
                        className='bg-blue-50 h-9 text-xs pr-7'
                        value={row.taxRate}
                        readOnly
                        disabled
                      />
                      <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500'>
                        %
                      </span>
                    </div>
                  </TableCell>
                  {/* Tax Code */}
                  <TableCell>
                    <div className='relative'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2'
                        onClick={() =>
                          setActiveTaxCodeIdx(
                            activeTaxCodeIdx === idx ? null : idx
                          )
                        }
                        tabIndex={0}
                      >
                        {row.taxCode ? (
                          <span className='font-bold'>{row.taxCode}</span>
                        ) : (
                          <span className='text-gray-400'>Select tax code</span>
                        )}
                        <ChevronDown className='ml-2 w-4 h-4 text-gray-400' />
                      </Button>
                      {activeTaxCodeIdx === idx && (
                        <div className=' absolute z-50 w-full flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
                          {taxCodes.map((tc) => (
                            <button
                              type='button'
                              key={tc.value}
                              className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                              onMouseDown={() => {
                                handleTaxCodeChange(tc.value, idx);
                                setActiveTaxCodeIdx(null);
                              }}
                            >
                              <div>
                                <span className='font-bold'>{tc.value}</span>
                                {tc.displayText && (
                                  <div className='text-gray-700 mt-0.5 mb-0.5'>
                                    {tc.displayText}
                                  </div>
                                )}
                                {tc.description && (
                                  <p className='text-gray-500 mt-0.5'>
                                    {tc.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* VATAX-SA-32 dropdown, only show if taxCode is 'Z' */}
                    {row.taxCode === 'Z' && (
                      <div className='mt-2'>
                        <div className='relative'>
                          <Input
                            className='bg-blue-50 h-9 text-xs w-full pr-8 relative'
                            value={
                              exportTypeOptions.find(
                                (opt) => opt.value === row.vatSa32
                              )?.label || 'Export of goods'
                            }
                            readOnly
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='absolute right-0 top-0 h-9 text-xs flex justify-between items-center px-2 rounded-l-none'
                            onClick={() =>
                              setActiveExportIdx(
                                activeExportIdx === idx ? null : idx
                              )
                            }
                            tabIndex={0}
                          >
                            <ChevronDown className='ml-2 w-4 h-4 ' />
                          </Button>
                          {activeExportIdx === idx && (
                            <div className='absolute z-50 w-full flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
                              {exportTypeOptions.map((opt) => (
                                <button
                                  type='button'
                                  key={opt.value}
                                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                                  onMouseDown={() => {
                                    updateItem(idx, 'vatSa32', opt.value);
                                    setActiveExportIdx(null);
                                  }}
                                >
                                  <div>
                                    <span className='font-bold'>
                                      {opt.value}
                                    </span>
                                    <div className='text-gray-700 mt-0.5 mb-0.5'>
                                      {opt.label}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
