import React from 'react';
import { Filter, Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  minPriceInput: string;
  setMinPriceInput: (value: string) => void;
  maxPriceInput: string;
  setMaxPriceInput: (value: string) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedConditions: string[];
  setSelectedConditions: (conditions: string[]) => void;
  setCurrentPage: (page: number) => void;
}

const colors = [
  { name: 'Red', count: 56, color: 'bg-red-500' },
  { name: 'Green', count: 78, color: 'bg-green-500' },
  { name: 'Blue', count: 54, color: 'bg-blue-500' },
];

const conditions = [
  { name: 'New', count: 1506 },
  { name: 'Refurbished', count: 27 },
  { name: 'Used', count: 45 },
];

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  minPriceInput,
  setMinPriceInput,
  maxPriceInput,
  setMaxPriceInput,
  selectedColors,
  setSelectedColors,
  selectedConditions,
  setSelectedConditions,
  setCurrentPage,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>

      {/* Search by Name */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Search by Name</h4>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            min="0"
            aria-label="Minimum price"
          />
          <input
            type="number"
            placeholder="Max Price"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            min="0"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Color</h4>
        <div className="space-y-3">
          {colors.map((color) => (
            <label key={color.name} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="mr-3 rounded text-primary-500 focus:ring-primary-500"
                checked={selectedColors.includes(color.name)}
                onChange={() => {
                  setSelectedColors(
                    selectedColors.includes(color.name)
                      ? selectedColors.filter((c) => c !== color.name)
                      : [...selectedColors, color.name]
                  );
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                aria-label={`Filter by color ${color.name}`}
              />
              <div className={`w-4 h-4 rounded-full ${color.color} mr-3 shadow-sm`}></div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {color.name} ({color.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Item Condition */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Item Condition</h4>
        <div className="space-y-3">
          {conditions.map((condition) => (
            <label key={condition.name} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="mr-3 rounded text-primary-500 focus:ring-primary-500"
                checked={selectedConditions.includes(condition.name)}
                onChange={() => {
                  setSelectedConditions(
                    selectedConditions.includes(condition.name)
                      ? selectedConditions.filter((c) => c !== condition.name)
                      : [...selectedConditions, condition.name]
                  );
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                aria-label={`Filter by condition ${condition.name}`}
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {condition.name} ({condition.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
        aria-label="Apply filters"
      >
        <Filter className="h-4 w-4 inline mr-2" />
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;