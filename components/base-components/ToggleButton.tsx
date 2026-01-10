import React from 'react';

interface ToggleButtonProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  optionA: { value: T; label: React.ReactNode };
  optionB: { value: T; label: React.ReactNode };
  label?: string;
  required?: boolean;
  className?: string;
  showStatusText?: boolean;
}

export function ToggleButton<T = string>({
  value,
  onChange,
  optionA,
  optionB,
  label,
  required = false,
  className = '',
  showStatusText = false,
}: ToggleButtonProps<T>) {
  const isA = value === optionA.value;
  return (
    <div className={` bg-blue-50 rounded-lg ${className}`}>
      <div className='flex items-center justify-between'>
        {label && (
          <label className='text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </label>
        )}
        <button
          type='button'
          onClick={() => onChange(isA ? optionB.value : optionA.value)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            isA ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              isA ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {showStatusText && (
        <p className='text-sm text-gray-600 mt-2'>
          {isA ? optionA.label : optionB.label}
        </p>
      )}
    </div>
  );
}
