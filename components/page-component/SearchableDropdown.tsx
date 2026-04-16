'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownOption,
  SearchableDropdownProps,
} from '@/types/componentTypes';

export function SearchableDropdown({
  label,
  placeholder,
  value,
  searchValue,
  isOpen,
  options,
  onSearchChange,
  onFocus,
  onBlur,
  onSelect,
  onClear,
  error,
  touched,
  renderOption,
  isSelected,
  selectedDisplayValue,
}: SearchableDropdownProps) {
  return (
    <div className='space-y-2'>
      <Label className='text-xs text-gray-500'>
        {label}
        <span className='text-red-500'>*</span>
      </Label>

      {!isSelected ? (
        <div className='space-y-2'>
          <Popover open={isOpen}>
            <PopoverTrigger asChild>
              <div className='relative'>
                <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10' />
                <input
                  autoComplete='off'
                  className='flex h-9 w-full rounded-md border border-gray-200 bg-blue-50 pl-8 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200'
                  placeholder={placeholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className='p-0 w-[var(--radix-popover-trigger-width)]'
              align='start'
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList className='max-h-40 sm:max-h-48'>
                  <CommandEmpty className='py-2 text-center text-xs text-gray-500'>
                    No results found.
                  </CommandEmpty>
                  <CommandGroup>
                    {options
                      .filter(
                        (option) =>
                          searchValue === '' ||
                          option.value
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) ||
                          (option.displayText &&
                            option.displayText
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())),
                      )
                      .map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onMouseDown={(e) => e.preventDefault()}
                          onSelect={() => onSelect(option)}
                          className='text-xs cursor-pointer'
                        >
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <div>
                              <span className='font-bold'>{option.value}</span>
                              {option.displayText && (
                                <div className='text-gray-700 mt-0.5 mb-0.5'>
                                  {option.displayText}
                                </div>
                              )}
                              {option.description && (
                                <p className='text-gray-500 mt-0.5'>
                                  {option.description}
                                </p>
                              )}
                            </div>
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {touched && error ? (
            <div className='text-sm text-red-500'>{error}</div>
          ) : null}
        </div>
      ) : (
        <Badge
          variant='secondary'
          className='bg-blue-50 text-gray-700 text-xs font-medium py-2 px-3 w-fit'
        >
          <span>{selectedDisplayValue || value}</span>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='ml-1 h-4 w-4 p-0 text-gray-400 hover:text-gray-600'
            onClick={onClear}
          >
            <X className='h-3 w-3' />
          </Button>
        </Badge>
      )}
    </div>
  );
}
