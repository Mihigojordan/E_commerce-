import React from 'react';
import { Layers, X } from 'lucide-react';

interface SizeOption {
  value: string;
  label: string;
  fullName: string;
}

interface SizeSectionProps {
  size: string;
  errors: { size?: string | null };
  handleSizeChange: (sizeValue: string) => void;
}

const sizeOptions: SizeOption[] = [
  { value: 'XS', label: 'Extra Small', fullName: 'Extra Small' },
  { value: 'S', label: 'Small', fullName: 'Small' },
  { value: 'M', label: 'Medium', fullName: 'Medium' },
  { value: 'L', label: 'Large', fullName: 'Large' },
  { value: 'XL', label: 'Extra Large', fullName: 'Extra Large' },
  { value: 'XXL', label: '2X Large', fullName: '2X Large' },
  { value: 'XXXL', label: '3X Large', fullName: '3X Large' },
];

const SizeSection: React.FC<SizeSectionProps> = ({ size, errors, handleSizeChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Layers className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Size</h3>
          <p className="text-xs text-gray-500">Choose product size</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {sizeOptions.map((option) => (
          <div key={option.value} className="relative">
            <input
              type="radio"
              id={`size-${option.value}`}
              name="size"
              value={option.value}
              checked={size === option.fullName}
              onChange={() => handleSizeChange(option.value)}
              className="sr-only"
            />
            <label
              htmlFor={`size-${option.value}`}
              className={`block w-full py-2.5 text-center text-xs font-medium rounded-lg border-2 cursor-pointer transition-all ${
                size === option.fullName
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.value}
            </label>
          </div>
        ))}
      </div>
      {errors.size && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.size}
        </p>
      )}
    </div>
  );
};

export default SizeSection;