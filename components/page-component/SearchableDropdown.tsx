'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface DropdownOption {
  value: string;
  displayText?: string;
  description?: string;
  [key: string]: any;
}

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  searchValue: string;
  isOpen: boolean;
  options: DropdownOption[];
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: (option: DropdownOption) => void;
  onClear: () => void;
  error?: string;
  touched?: boolean;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  isSelected?: boolean;
  selectedDisplayValue?: string;
}

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
  const filteredOptions = options.filter(
    (option) =>
      searchValue === '' ||
      option.value.toLowerCase().includes(searchValue.toLowerCase()) ||
      (option.displayText &&
        option.displayText.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <div className='relative space-y-2'>
      <Label className='text-xs text-gray-500'>
        {label}
        <span className='text-red-500'>*</span>
      </Label>

      {!isSelected ? (
        <div className='space-y-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
            <Input
              autoComplete='off'
              className='bg-blue-50 h-9 w-full pl-8 pr-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-200'
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {isOpen && options.length > 0 && (
            <div className='absolute z-50 w-full max-h-48 overflow-y-auto text-xs mt-1 rounded border border-gray-200 bg-white shadow-lg'>
              {filteredOptions.map((option) => (
                <button
                  type='button'
                  key={option.value}
                  className='w-full text-left px-2 py-2 hover:bg-blue-50 focus:bg-blue-100 focus:outline-none border-b last:border-b-0'
                  onMouseDown={() => onSelect(option)}
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
                </button>
              ))}
            </div>
          )}

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
          <button
            type='button'
            onClick={onClear}
            className='ml-2 text-gray-400 hover:text-gray-600'
          >
            <X className='h-3 w-3' />
          </button>
        </Badge>
      )}
    </div>
  );
}
