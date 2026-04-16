'use client';

import { ToggleButton } from '@/components/base-components/ToggleButton';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
    null,
  );
  const [activeExemptIdx, setActiveExemptIdx] = useState<number | null>(null);
  const [showNegativeAmountDialog, setShowNegativeAmountDialog] =
    useState(false);
  const hasShownNegativeWarning = useRef(false);

  // Check for negative amounts
  useEffect(() => {
    const hasNegative = items.some((row) => {
      const { vatAmount, totalAmount } = calculateItemRow(row);
      return totalAmount < 0 || vatAmount < 0;
    });

    if (hasNegative && !hasShownNegativeWarning.current) {
      setShowNegativeAmountDialog(true);
      hasShownNegativeWarning.current = true;
    } else if (!hasNegative) {
      hasShownNegativeWarning.current = false;
    }
  }, [items]);

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
    <div className='space-y-3 w-full max-w-full overflow-hidden'>
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

      <div className='border rounded-lg overflow-x-auto'>
        <Table className='text-xs'>
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
                <TableRow key={idx} className='align-top'>
                  <TableCell className='font-medium bg-gray-50 align-top'>
                    {idx + 1}
                  </TableCell>
                  {/* Description & Service Code & Reporting Tags */}
                  <TableCell className='align-top'>
                    <div className='flex flex-col gap-1'>
                      <Popover
                        open={activeDescriptionIdx === idx}
                        onOpenChange={(open) =>
                          setActiveDescriptionIdx(open ? idx : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={activeDescriptionIdx === idx}
                            className='w-full justify-between bg-blue-50 h-9 text-xs font-normal'
                          >
                            {row.description ? (
                              <span className='truncate'>
                                {row.description}
                              </span>
                            ) : (
                              <span className='text-muted-foreground'>
                                {t('invoices.form.descriptionPlaceholder')}
                              </span>
                            )}
                            <ChevronDown className='ml-2 h-3 w-3 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className='w-[--radix-popover-trigger-width] p-0'
                          align='start'
                        >
                          <Command>
                            <CommandInput
                              placeholder={t(
                                'invoices.form.descriptionPlaceholder',
                              )}
                            />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup>
                                {itemOptions.map((item) => (
                                  <CommandItem
                                    key={item.id || item._id}
                                    value={item.description || item.name || ''}
                                    onSelect={() => {
                                      handleSelectItem(
                                        item.id || item._id || '',
                                        idx,
                                      );
                                    }}
                                  >
                                    {item.description}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                            parseNumber(e.target.value),
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
                            <SelectItem key={u.value} value={u.value}>
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
                    <Popover
                      open={activeTaxCodeIdx === idx}
                      onOpenChange={(open) =>
                        setActiveTaxCodeIdx(open ? idx : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          role='combobox'
                          aria-expanded={activeTaxCodeIdx === idx}
                          className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 min-w-30 hover:bg-blue-50'
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
                      </PopoverTrigger>
                      <PopoverContent
                        className='min-w-[200px] p-0'
                        align='start'
                      >
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {taxCodes.map((tc) => (
                                <CommandItem
                                  key={tc.value}
                                  value={tc.value}
                                  onSelect={() => {
                                    handleTaxCodeChange(tc.value, idx);
                                    setActiveTaxCodeIdx(null);
                                  }}
                                >
                                  <div>
                                    <span className='font-bold'>
                                      {tc.value}
                                    </span>
                                    {tc.displayText && (
                                      <div className='text-gray-700 text-xs mt-0.5 mb-0.5'>
                                        {tc.displayText}
                                      </div>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {/* VATAX-SA-32 dropdown, only show if taxCode is 'Z' */}
                    {row.taxCode === 'Z' && (
                      <div className='mt-2'>
                        <Popover
                          open={activeExportIdx === idx}
                          onOpenChange={(open) =>
                            setActiveExportIdx(open ? idx : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 hover:bg-blue-50'
                            >
                              <span className='truncate text-xs'>
                                {exportTypeOptions.find(
                                  (opt) => opt.value === row.vatSa32,
                                )?.displayText || 'Export of goods'}
                              </span>
                              <ChevronDown className='ml-2 w-4 h-4 shrink-0' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='min-w-[300px] p-0'
                            align='start'
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {exportTypeOptions.map((opt) => (
                                    <CommandItem
                                      key={opt.value}
                                      value={opt.value}
                                      onSelect={() => {
                                        updateItem(idx, 'vatSa32', opt.value);
                                        setActiveExportIdx(null);
                                      }}
                                    >
                                      <div>
                                        <span className='font-bold'>
                                          {opt.value}
                                        </span>
                                        {opt.displayText && (
                                          <div className='text-gray-700 text-xs mt-0.5 mb-0.5 whitespace-normal break-words'>
                                            {opt.displayText}
                                          </div>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* Out of scope dropdown, only show if taxCode is 'O' */}
                    {row.taxCode === 'O' && (
                      <div className='mt-2'>
                        <Popover
                          open={activeOutOfScopeIdx === idx}
                          onOpenChange={(open) =>
                            setActiveOutOfScopeIdx(open ? idx : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 hover:bg-blue-50'
                            >
                              <span className='truncate text-xs'>
                                {outOfScopeOptions.find(
                                  (opt) => opt.value === row.outOfScope,
                                )?.displayText || 'Not subject to VAT'}
                              </span>
                              <ChevronDown className='ml-2 w-4 h-4 shrink-0' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='min-w-[300px] p-0'
                            align='start'
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {outOfScopeOptions.map((opt) => (
                                    <CommandItem
                                      key={opt.value}
                                      value={opt.value}
                                      onSelect={() => {
                                        updateItem(
                                          idx,
                                          'outOfScope',
                                          opt.value,
                                        );
                                        setActiveOutOfScopeIdx(null);
                                      }}
                                    >
                                      <div>
                                        <span className='font-bold'>
                                          {opt.value}
                                        </span>
                                        {opt.displayText && (
                                          <div className='text-gray-700 text-xs mt-0.5 mb-0.5 whitespace-normal break-words'>
                                            {opt.displayText}
                                          </div>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {/* Exempt dropdown, only show if taxCode is 'E' */}
                    {row.taxCode === 'E' && (
                      <div className='mt-2'>
                        <Popover
                          open={activeExemptIdx === idx}
                          onOpenChange={(open) =>
                            setActiveExemptIdx(open ? idx : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='bg-blue-50 h-9 text-xs w-full flex justify-between items-center px-2 hover:bg-blue-50'
                            >
                              <span className='truncate text-xs'>
                                {exemptOptions.find(
                                  (opt) => opt.value === row.exempt,
                                )?.displayText ||
                                  'Financial services mentioned in Article 29 of the VAT Regulations'}
                              </span>
                              <ChevronDown className='ml-2 w-4 h-4 shrink-0' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='min-w-[300px] p-0'
                            align='start'
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {exemptOptions.map((opt) => (
                                    <CommandItem
                                      key={opt.value}
                                      value={opt.value}
                                      onSelect={() => {
                                        updateItem(idx, 'exempt', opt.value);
                                        setActiveExemptIdx(null);
                                      }}
                                    >
                                      <div>
                                        <span className='font-bold'>
                                          {opt.value}
                                        </span>
                                        {opt.displayText && (
                                          <div className='text-gray-700 text-xs mt-0.5 mb-0.5 whitespace-normal break-words'>
                                            {opt.displayText}
                                          </div>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
      <Button type='button' variant='outline' size='sm' onClick={addItemDetail}>
        <Plus className='h-4 w-4 mr-2' />
        {t('invoices.form.addItemButton')}
      </Button>

      {/* Negative Amount Dialog */}
      <Dialog
        open={showNegativeAmountDialog}
        onOpenChange={setShowNegativeAmountDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-red-600'>
              {t('invoices.form.negativeAmountTitle') || 'Invalid Total Amount'}
            </DialogTitle>
            <DialogDescription>
              {t('invoices.form.negativeAmountMessage') ||
                'Total cannot be less than 0. Please adjust your deductions.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowNegativeAmountDialog(false)}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {t('invoices.form.ok') || 'OK'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
