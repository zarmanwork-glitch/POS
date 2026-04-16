import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleButtonProps } from '@/types/componentTypes';

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
    <div className={`bg-blue-50 rounded-lg ${className}`}>
      <div className='flex items-center justify-between'>
        {label && (
          <Label className='text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </Label>
        )}
        <Switch
          checked={isA}
          onCheckedChange={() => onChange(isA ? optionB.value : optionA.value)}
        />
      </div>
      {showStatusText && (
        <p className='text-sm text-gray-600 mt-2'>
          {isA ? optionA.label : optionB.label}
        </p>
      )}
    </div>
  );
}
