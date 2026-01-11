'use client';

import { Button } from '@/components/ui/button';
import { ToggleButton } from '@/components/base-components/ToggleButton';
import { Input } from '@/components/ui/input';
import { exportTypeOptions } from '@/enums/exportType';
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
import { ItemDetailsSectionProps } from '@/types/itemTypes';
import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';

export default function ItemDetailsSection({
  items,
  unitOfMeasures,
  taxCodes,
  updateItem,
  removeItem,
  addItemDetail,
  itemOptions,
  itemSearch,
  setItemSearch,
}: ItemDetailsSectionProps) {
  const [activeDescriptionIdx, setActiveDescriptionIdx] = useState<
    number | null
  >(null);
  const [activeTaxCodeIdx, setActiveTaxCodeIdx] = useState<number | null>(null);
  const [activeExportIdx, setActiveExportIdx] = useState<number | null>(null);

  const taxCodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside any tax code dropdown
      if (activeTaxCodeIdx !== null) {
        const taxRef = taxCodeRefs.current[activeTaxCodeIdx];
        if (taxRef && !taxRef.contains(target)) {
          setActiveTaxCodeIdx(null);
        }
      }

      // Check if click is outside any export dropdown
      if (activeExportIdx !== null) {
        const exportRef = exportRefs.current[activeExportIdx];
        if (exportRef && !exportRef.contains(target)) {
          setActiveExportIdx(null);
        }
      }

      // Check if click is outside any description dropdown
      if (activeDescriptionIdx !== null) {
        const descRef = descriptionRefs.current[activeDescriptionIdx];
        if (descRef && !descRef.contains(target)) {
          setActiveDescriptionIdx(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTaxCodeIdx, activeExportIdx, activeDescriptionIdx]);

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
      setActiveDescriptionIdx(null);
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

      {/* Desktop Table - Hidden on mobile */}
      <div className='hidden lg:block border rounded-lg'>
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
              const { vatAmount, totalAmount } = calculateItemRow(row);

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
                    <div
                      className='flex flex-col gap-1 relative'
                      ref={(el) => {
                        descriptionRefs.current[idx] = el;
                      }}
                    >
                      <Input
                        className='bg-blue-50 h-9 text-xs w-full'
                        placeholder='Description'
                        value={row.description}
                        onChange={(e) => {
                          updateItem(idx, 'description', e.target.value);
                          setItemSearch(e.target.value);
                        }}
                        onFocus={() => setActiveDescriptionIdx(idx)}
                        onBlur={() => {
                          setTimeout(() => setActiveDescriptionIdx(null), 200);
                        }}
                      />
                      {activeDescriptionIdx === idx &&
                        itemOptions.length > 0 && (
                          <div className='absolute z-[100] w-full mt-10 bg-white border rounded-md shadow-lg h-32 overflow-y-auto flex flex-col'>
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
                        className='bg-blue-50 h-9 text-xs w-full'
                        placeholder='Service Code'
                        value={row.serviceCode}
                        onChange={(e) =>
                          updateItem(idx, 'serviceCode', e.target.value)
                        }
                      />
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
                          {row.discountType === 'PERC' ? '%' : '#'}
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
                    <div
                      className='relative'
                      ref={(el) => {
                        taxCodeRefs.current[idx] = el;
                      }}
                    >
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 min-w-[120px] hover:bg-blue-50'
                        onClick={() =>
                          setActiveTaxCodeIdx(
                            activeTaxCodeIdx === idx ? null : idx
                          )
                        }
                        tabIndex={0}
                      >
                        {row.taxCode ? (
                          <span className='font-bold truncate'>
                            {row.taxCode}
                          </span>
                        ) : (
                          <span className='text-gray-400 truncate'>
                            Select tax code
                          </span>
                        )}
                        <ChevronDown className='ml-2 w-4 h-4 text-gray-400 flex-shrink-0' />
                      </Button>
                      {activeTaxCodeIdx === idx && (
                        <div className=' absolute z-50 min-w-[300px] flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
                          {taxCodes.map((tc) => (
                            <button
                              type='button'
                              key={tc.value}
                              className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                              onClick={() => {
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
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* VATAX-SA-32 dropdown, only show if taxCode is 'Z' */}
                    {row.taxCode === 'Z' && (
                      <div className='mt-2'>
                        <div
                          className='relative'
                          ref={(el) => {
                            exportRefs.current[idx] = el;
                          }}
                        >
                          <Input
                            className='bg-blue-50 h-9 text-xs w-full pr-8 relative'
                            value={
                              exportTypeOptions.find(
                                (opt) => opt.value === row.vatSa32
                              )?.displayText || 'Export of goods'
                            }
                            readOnly
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-9 text-xs flex justify-between items-center px-2 rounded-l-none bg-blue-50 border border-l-0 border-gray-200 hover:bg-blue-50'
                            onClick={() =>
                              setActiveExportIdx(
                                activeExportIdx === idx ? null : idx
                              )
                            }
                            tabIndex={0}
                          >
                            <ChevronDown className='ml-2 w-4 h-4' />
                          </Button>
                          {activeExportIdx === idx && (
                            <div className='absolute z-50 min-w-[300px] flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
                              {exportTypeOptions.map((opt) => (
                                <button
                                  type='button'
                                  key={opt.value}
                                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                                  onClick={() => {
                                    updateItem(idx, 'vatSa32', opt.value);
                                    setActiveExportIdx(null);
                                  }}
                                >
                                  <div>
                                    <span className='font-bold'>
                                      {opt.value}
                                    </span>
                                    {opt.displayText && (
                                      <div className='text-gray-700 mt-0.5 mb-0.5 whitespace-normal break-words'>
                                        {opt.displayText}
                                      </div>
                                    )}
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
                    <div className='flex flex-col gap-1'>
                      <Input
                        className='bg-gray-100 h-9 text-xs font-semibold'
                        value={formatNumber(totalAmount)}
                        readOnly
                        disabled
                      />
                      <Input
                        className='bg-gray-100 h-9 text-xs'
                        value={formatNumber(vatAmount)}
                        readOnly
                        disabled
                      />
                    </div>
                  </TableCell>
                  {/* Remove */}
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
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

      {/* Mobile Cards - Visible on mobile */}
      <div className='lg:hidden flex flex-col gap-4'>
        {items.map((row, idx) => {
          const { vatAmount, totalAmount } = calculateItemRow(row);

          return (
            <div
              key={idx}
              className='border rounded-lg p-4 bg-white'
            >
              {/* Item Number and Delete */}
              <div className='flex justify-between items-center mb-4'>
                <span className='font-semibold text-sm'>Item {idx + 1}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                >
                  <X className='h-4 w-4 text-red-500' />
                </Button>
              </div>

              {/* Description */}
              <div className='mb-3'>
                <Label className='text-xs font-semibold text-gray-700 mb-1'>
                  Item / Service Description
                </Label>
                <div
                  className='relative'
                  ref={(el) => {
                    descriptionRefs.current[idx] = el;
                  }}
                >
                  <Input
                    className='bg-blue-50 h-9 text-xs w-full'
                    placeholder='Description'
                    value={row.description}
                    onChange={(e) => {
                      updateItem(idx, 'description', e.target.value);
                      setItemSearch(e.target.value);
                    }}
                    onFocus={() => setActiveDescriptionIdx(idx)}
                    onBlur={() => {
                      setTimeout(() => setActiveDescriptionIdx(null), 200);
                    }}
                  />
                  {activeDescriptionIdx === idx && itemOptions.length > 0 && (
                    <div className='absolute z-[100] w-full mt-1 bg-white border rounded-md shadow-lg max-h-32 overflow-y-auto flex flex-col'>
                      {(itemSearch ? filteredItems : itemOptions).map(
                        (item) => (
                          <Button
                            key={item.id || item._id}
                            type='button'
                            variant='ghost'
                            className='w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b last:border-b-0 whitespace-nowrap overflow-hidden text-ellipsis justify-start'
                            onClick={() => {
                              handleSelectItem(item.id || item._id || '', idx);
                            }}
                          >
                            {item.description}
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Service Code */}
              <div className='mb-3'>
                <Label className='text-xs text-gray-500 mb-1'>
                  Material / Service Code
                </Label>
                <Input
                  className='bg-blue-50 h-9 text-xs w-full'
                  placeholder='Service Code'
                  value={row.serviceCode}
                  onChange={(e) =>
                    updateItem(idx, 'serviceCode', e.target.value)
                  }
                />
              </div>

              {/* Reporting Tags */}
              <div className='mb-3'>
                <Label className='text-xs text-gray-500 mb-1'>
                  Reporting Tags : (Used for tracking purposes.)
                </Label>
                <Input
                  className='bg-blue-50 h-9 text-xs w-full'
                  placeholder='Tag Name Here'
                />
              </div>

              {/* Quantity & UOM */}
              <div className='grid grid-cols-2 gap-3 mb-3'>
                <div>
                  <Label className='text-xs font-semibold text-gray-700 mb-1'>
                    Quantity
                  </Label>
                  <Input
                    type='number'
                    className='bg-blue-50 h-9 text-xs'
                    value={row.quantity}
                    onChange={(e) =>
                      updateItem(idx, 'quantity', parseNumber(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500 mb-1'>UOM</Label>
                  <Select
                    value={row.unitOfMeasure}
                    onValueChange={(v) => updateItem(idx, 'unitOfMeasure', v)}
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
              </div>

              {/* Unit Rate */}
              <div className='mb-3'>
                <Label className='text-xs font-semibold text-gray-700 mb-1'>
                  Unit Rate
                </Label>
                <Input
                  type='number'
                  className='bg-blue-50 h-9 text-xs'
                  value={row.unitRate}
                  onChange={(e) => updateItem(idx, 'unitRate', e.target.value)}
                />
              </div>

              {/* Discount */}
              <div className='mb-3'>
                <Label className='text-xs font-semibold text-gray-700 mb-1'>
                  Discount
                </Label>
                <div className='flex items-center gap-2 mb-1'>
                  <ToggleButton
                    value={row.discountType}
                    onChange={(val) => updateItem(idx, 'discountType', val)}
                    optionA={{ value: 'PERC', label: '%' }}
                    optionB={{ value: 'NUMBER', label: '#' }}
                    className='w-12 bg-transparent p-0'
                  />
                  <span className='text-xs font-semibold'>
                    {row.discountType === 'PERC' ? '%' : '#'}
                  </span>
                </div>
                <Input
                  type='number'
                  className='bg-blue-50 h-9 text-xs w-full'
                  value={row.discount}
                  onChange={(e) => updateItem(idx, 'discount', e.target.value)}
                />
              </div>

              {/* Tax Rate */}
              <div className='mb-3'>
                <Label className='text-xs font-semibold text-gray-700 mb-1'>
                  Tax Rate
                </Label>
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
              </div>

              {/* Tax Code */}
              <div className='mb-3'>
                <Label className='text-xs font-semibold text-gray-700 mb-1'>
                  Tax Code
                </Label>
                <div
                  className='relative'
                  ref={(el) => {
                    taxCodeRefs.current[idx] = el;
                  }}
                >
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 hover:bg-blue-50'
                    onClick={() =>
                      setActiveTaxCodeIdx(
                        activeTaxCodeIdx === idx ? null : idx
                      )
                    }
                    tabIndex={0}
                  >
                    {row.taxCode ? (
                      <span className='font-bold truncate'>{row.taxCode}</span>
                    ) : (
                      <span className='text-gray-400 truncate'>
                        Select tax code
                      </span>
                    )}
                    <ChevronDown className='ml-2 w-4 h-4 text-gray-400 flex-shrink-0' />
                  </Button>
                  {activeTaxCodeIdx === idx && (
                    <div className='absolute z-50 w-full flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
                      {taxCodes.map((tc) => (
                        <button
                          type='button'
                          key={tc.value}
                          className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                          onClick={() => {
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
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* VATAX-SA-32 dropdown, only show if taxCode is 'Z' */}
                {row.taxCode === 'Z' && (
                  <div className='mt-2'>
                    <Label className='text-xs text-gray-500 mb-1'>
                      VAT Exemption Reason
                    </Label>
                    <div
                      className='relative'
                      ref={(el) => {
                        exportRefs.current[idx] = el;
                      }}
                    >
                      <Input
                        className='bg-blue-50 h-9 text-xs w-full pr-8 relative'
                        value={
                          exportTypeOptions.find(
                            (opt) => opt.value === row.vatSa32
                          )?.displayText || 'Export of goods'
                        }
                        readOnly
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-9 text-xs flex justify-between items-center px-2 rounded-l-none bg-blue-50 border border-l-0 border-gray-200 hover:bg-blue-50'
                        onClick={() =>
                          setActiveExportIdx(
                            activeExportIdx === idx ? null : idx
                          )
                        }
                        tabIndex={0}
                      >
                        <ChevronDown className='ml-2 w-4 h-4' />
                      </Button>
                      {activeExportIdx === idx && (
                        <div className='absolute z-50 w-full flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
                          {exportTypeOptions.map((opt) => (
                            <button
                              type='button'
                              key={opt.value}
                              className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                              onClick={() => {
                                updateItem(idx, 'vatSa32', opt.value);
                                setActiveExportIdx(null);
                              }}
                            >
                              <div>
                                <span className='font-bold'>{opt.value}</span>
                                {opt.displayText && (
                                  <div className='text-gray-700 mt-0.5 mb-0.5 whitespace-normal break-words'>
                                    {opt.displayText}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Total and VAT Amount */}
              <div className='grid grid-cols-2 gap-3 pt-3 border-t'>
                <div>
                  <Label className='text-xs font-semibold text-gray-700 mb-1'>
                    Total
                  </Label>
                  <Input
                    className='bg-gray-100 h-9 text-xs font-semibold'
                    value={formatNumber(totalAmount)}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <Label className='text-xs text-gray-500 mb-1'>
                    VAT Amount
                  </Label>
                  <Input
                    className='bg-gray-100 h-9 text-xs'
                    value={formatNumber(vatAmount)}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <Button
        variant='outline'
        size='sm'
        onClick={addItemDetail}
      >
        <Plus className='h-4 w-4 mr-2' />
        Add Item
      </Button>
    </div>
  );
}
