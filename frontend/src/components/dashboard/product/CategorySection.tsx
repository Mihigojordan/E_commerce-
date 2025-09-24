
import React from 'react';
import { Layers, X } from 'lucide-react';
import { type Category } from '../../../services/categoryService';

interface CategorySectionProps {
  categoryId: number;
  categories: Category[];
  errors: { categoryId?: string | null };
  handleInputChange: (field: string, value: number) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryId,
  categories,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-50 rounded-lg">
          <Layers className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Category</h3>
          <p className="text-xs text-gray-500">Choose product category</p>
        </div>
      </div>
      
      <select
        value={categoryId}
        onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
        className="w-full px-3 py-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      >
        <option value="0">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.categoryId && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <X className="h-4 w-4" />
          {errors.categoryId}
        </p>
      )}
    </div>
  );
};

export default CategorySection;