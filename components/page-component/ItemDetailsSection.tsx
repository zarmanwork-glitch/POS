'use client';

import { ToggleButton } from '@/components/base-components/ToggleButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  exemptOptions,
  exportTypeOptions,
  outOfScopeOptions,
} from '@/enums/exportType';
import { formatNumber, parseNumber } from '@/lib/number';
import { ItemDetailsSectionProps } from '@/types/itemTypes';
import { calculateItemRow } from '@/utils/itemCalculations';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ItemDetailsSection({
  items,
  unitOfMeasures,
  taxCodes,
  updateItem,
  removeItem,
  addItemDetail,
  itemOptions,
}: ItemDetailsSectionProps) {
  const { t } = useTranslation();
  const [activeDescriptionIdx, setActiveDescriptionIdx] = useState<
    number | null
  >(null);
  const [activeTaxCodeIdx, setActiveTaxCodeIdx] = useState<number | null>(null);
  const [activeExportIdx, setActiveExportIdx] = useState<number | null>(null);
  const [activeOutOfScopeIdx, setActiveOutOfScopeIdx] = useState<number | null>(
    null
  );
  const [activeExemptIdx, setActiveExemptIdx] = useState<number | null>(null);

  // Per-row search state for description dropdowns
  const [itemSearches, setItemSearches] = useState<Record<number, string>>({});

  const taxCodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outOfScopeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exemptRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      // Check if click is outside any out of scope dropdown
      if (activeOutOfScopeIdx !== null) {
        const oosRef = outOfScopeRefs.current[activeOutOfScopeIdx];
        if (oosRef && !oosRef.contains(target)) {
          setActiveOutOfScopeIdx(null);
        }
      }

      // Check if click is outside any exempt dropdown
      if (activeExemptIdx !== null) {
        const exemptRef = exemptRefs.current[activeExemptIdx];
        if (exemptRef && !exemptRef.contains(target)) {
          setActiveExemptIdx(null);
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
  }, [
    activeTaxCodeIdx,
    activeExportIdx,
    activeOutOfScopeIdx,
    activeExemptIdx,
    activeDescriptionIdx,
  ]);

  // Filter items by description for a specific row
  const getFilteredItems = (idx: number) => {
    const search = itemSearches[idx] || '';
    if (!search) return itemOptions;

    return Array.isArray(itemOptions)
      ? itemOptions.filter((item) => {
          const query = search.toLowerCase();
          return (
            (item.description &&
              item.description.toLowerCase().includes(query)) ||
            (item.name && item.name.toLowerCase().includes(query))
          );
        })
      : [];
  };

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
      setItemSearches((prev) => ({ ...prev, [itemIndex]: '' }));
      setActiveDescriptionIdx(null);
    }
  };

  const handleTaxCodeChange = (taxCode: string, itemIndex: number) => {
    updateItem(itemIndex, 'taxCode', taxCode);
    if (taxCode === 'S') {
      updateItem(itemIndex, 'taxRate', 15);
      updateItem(itemIndex, 'vatSa32', undefined);
      updateItem(itemIndex, 'outOfScope', undefined);
      updateItem(itemIndex, 'exempt', undefined);
    } else if (taxCode === 'Z') {
      updateItem(itemIndex, 'taxRate', 0);
      updateItem(itemIndex, 'outOfScope', undefined);
      updateItem(itemIndex, 'exempt', undefined);
      // Show VATAX-SA-32 dropdown
    } else if (taxCode === 'O') {
      updateItem(itemIndex, 'taxRate', 0);
      updateItem(itemIndex, 'vatSa32', undefined);
      updateItem(itemIndex, 'exempt', undefined);
      // Show out of scope dropdown
    } else if (taxCode === 'E') {
      updateItem(itemIndex, 'taxRate', 0);
      updateItem(itemIndex, 'vatSa32', undefined);
      updateItem(itemIndex, 'outOfScope', undefined);
      // Show exempt dropdown
    } else {
      updateItem(itemIndex, 'taxRate', 15);
      updateItem(itemIndex, 'vatSa32', undefined);
      updateItem(itemIndex, 'outOfScope', undefined);
      updateItem(itemIndex, 'exempt', undefined);
    }
  };

  return (
    <div className='space-y-3'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
        <Label className='text-xs font-semibold tracking-wide'>
          {t('invoices.form.itemDetails')}
        </Label>
        <div className='flex items-center gap-2'>
          <Label className='text-xs text-gray-500'>
            {t('invoices.form.currencyLabel')}{' '}
            <span className='text-red-500'>*</span>
          </Label>
          <div className='w-44 h-9 bg-blue-50 border rounded-md px-3 flex items-center text-xs font-medium'>
            {t('invoices.form.sarSaudiRiyal')}
          </div>
        </div>
      </div>

      {/* Table */}
      {/* I'm commenting the overflow property for now */}
      <div className='border rounded-lg'>
        <Table className='text-xs min-w-200'>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.no')}
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.itemServiceDescription')}
                <div className='text-[11px] text-gray-400 font-normal'>
                  {t('invoices.form.materialServiceCode')}
                </div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.quantityLabel')}
                <div className='text-[11px] text-gray-400 font-normal'>
                  {t('invoices.form.uom')}
                </div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.unitRateLabel')}
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.discountLabel')}
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.taxRateLabel')}
                <div className='text-[11px] text-gray-400 font-normal'>
                  {t('invoices.form.vatExemptionReason')}
                </div>
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.taxCodeLabel')}
              </TableHead>
              <TableHead className='text-xs font-semibold text-gray-700'>
                {t('invoices.form.totalLabel')}
                <div className='text-[11px] text-gray-400 font-normal'>
                  {t('invoices.form.vatAmountLabel')}
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
                  <TableCell className='font-medium bg-gray-50 align-top'>
                    {idx + 1}
                  </TableCell>
                  {/* Description & Service Code & Reporting Tags */}
                  <TableCell className='align-top'>
                    <div
                      className='flex flex-col gap-1 relative'
                      ref={(el) => {
                        descriptionRefs.current[idx] = el;
                      }}
                    >
                      <Input
                        className='bg-blue-50 h-9 text-xs w-full'
                        placeholder={t('invoices.form.descriptionPlaceholder')}
                        value={row.description}
                        onChange={(e) => {
                          updateItem(idx, 'description', e.target.value);
                          setItemSearches((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }));
                        }}
                        onFocus={() => setActiveDescriptionIdx(idx)}
                        onBlur={() => {
                          setTimeout(() => setActiveDescriptionIdx(null), 200);
                        }}
                      />
                      {activeDescriptionIdx === idx &&
                        itemOptions.length > 0 && (
                          <div className='absolute z-100 w-full mt-10 bg-white border rounded-md shadow-lg h-32 overflow-y-auto flex flex-col'>
                            {getFilteredItems(idx).map((item) => (
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
                            ))}
                          </div>
                        )}
                      <Input
                        className='bg-blue-50 h-9 text-xs w-full'
                        placeholder={t('invoices.form.serviceCodePlaceholder')}
                        value={row.serviceCode}
                        onChange={(e) =>
                          updateItem(idx, 'serviceCode', e.target.value)
                        }
                      />
                      <div className='flex-1'>
                        <Label className='text-xs text-gray-500'>
                          {t('invoices.form.reportingTagsLabel')}
                        </Label>
                        <Input
                          className='bg-blue-50 h-9 text-xs mt-1 w-full'
                          placeholder={t('invoices.form.tagNamePlaceholder')}
                        />
                      </div>
                    </div>
                  </TableCell>
                  {/* Quantity */}
                  <TableCell className='align-top'>
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
                  <TableCell className='align-top'>
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
                  <TableCell className='align-top'>
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
                  <TableCell className='align-top'>
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
                  <TableCell className='align-top'>
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
                        className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 min-w-30 hover:bg-blue-50'
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
                        <ChevronDown className='ml-2 w-4 h-4 text-gray-400 shrink-0' />
                      </Button>
                      {activeTaxCodeIdx === idx && (
                        <div className=' absolute z-50 min-w-30 flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
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
                            <div className='absolute z-50 min-w-75 flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
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
                                      <div className='text-gray-700 mt-0.5 mb-0.5 whitespace-normal wrap-break-word'>
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
                    {/* Out of scope dropdown, only show if taxCode is 'O' */}
                    {row.taxCode === 'O' && (
                      <div className='mt-2'>
                        <div
                          className='relative'
                          ref={(el) => {
                            outOfScopeRefs.current[idx] = el;
                          }}
                        >
                          <Input
                            className='bg-blue-50 h-9 text-xs w-full pr-8 relative'
                            value={
                              outOfScopeOptions.find(
                                (opt) => opt.value === row.outOfScope
                              )?.displayText || 'Not subject to VAT'
                            }
                            readOnly
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-9 text-xs flex justify-between items-center px-2 rounded-l-none bg-blue-50 border border-l-0 border-gray-200 hover:bg-blue-50'
                            onClick={() =>
                              setActiveOutOfScopeIdx(
                                activeOutOfScopeIdx === idx ? null : idx
                              )
                            }
                            tabIndex={0}
                          >
                            <ChevronDown className='ml-2 w-4 h-4' />
                          </Button>
                          {activeOutOfScopeIdx === idx && (
                            <div className='absolute z-50 min-w-75 flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
                              {outOfScopeOptions.map((opt) => (
                                <button
                                  type='button'
                                  key={opt.value}
                                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                                  onClick={() => {
                                    updateItem(idx, 'outOfScope', opt.value);
                                    setActiveOutOfScopeIdx(null);
                                  }}
                                >
                                  <div>
                                    <span className='font-bold'>
                                      {opt.value}
                                    </span>
                                    {opt.displayText && (
                                      <div className='text-gray-700 mt-0.5 mb-0.5 whitespace-normal wrap-break-word'>
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
                    {/* Exempt dropdown, only show if taxCode is 'E' */}
                    {row.taxCode === 'E' && (
                      <div className='mt-2'>
                        <div
                          className='relative'
                          ref={(el) => {
                            exemptRefs.current[idx] = el;
                          }}
                        >
                          <Input
                            className='bg-blue-50 h-9 text-xs w-full pr-8 relative'
                            value={
                              exemptOptions.find(
                                (opt) => opt.value === row.exempt
                              )?.displayText ||
                              'Financial services mentioned in Article 29 of the VAT Regulations'
                            }
                            readOnly
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-9 text-xs flex justify-between items-center px-2 rounded-l-none bg-blue-50 border border-l-0 border-gray-200 hover:bg-blue-50'
                            onClick={() =>
                              setActiveExemptIdx(
                                activeExemptIdx === idx ? null : idx
                              )
                            }
                            tabIndex={0}
                          >
                            <ChevronDown className='ml-2 w-4 h-4' />
                          </Button>
                          {activeExemptIdx === idx && (
                            <div className='absolute z-50 min-w-75 flex flex-col max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg overflow-x-hidden'>
                              {exemptOptions.map((opt) => (
                                <button
                                  type='button'
                                  key={opt.value}
                                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none'
                                  onClick={() => {
                                    updateItem(idx, 'exempt', opt.value);
                                    setActiveExemptIdx(null);
                                  }}
                                >
                                  <div>
                                    <span className='font-bold'>
                                      {opt.value}
                                    </span>
                                    {opt.displayText && (
                                      <div className='text-gray-700 mt-0.5 mb-0.5 whitespace-normal wrap-break-word'>
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
                  <TableCell className='align-top'>
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
                  <TableCell className='align-top'>
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

      {/* Footer */}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={addItemDetail}
      >
        <Plus className='h-4 w-4 mr-2' />
        {t('invoices.form.addItemButton')}
      </Button>
    </div>
  );
}
