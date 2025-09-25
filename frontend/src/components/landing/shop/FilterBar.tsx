import React from 'react';
import { Filter, Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  minPriceInput: string;
  setMinPriceInput: (value: string) => void;
  maxPriceInput: string;
  setMaxPriceInput: (value: string) => void;
  selectedConditions: string[];
  setSelectedConditions: (conditions: string[]) => void;
  setCurrentPage: (page: number) => void;
}

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
  selectedConditions,
  setSelectedConditions,
  setCurrentPage,

}) => {
  const clearAllFilters = () => {
    setSearchQuery('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSelectedConditions([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || minPriceInput || maxPriceInput || selectedConditions.length > 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 rounded-2xl shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Filter className="h-4 w-4 text-primary-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Search by Name */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Search Products</h4>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Price Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="Min"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                min="0"
                aria-label="Minimum price"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                min="0"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        {/* Item Condition */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Condition</h4>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition.name} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-gray-50/80 transition-all duration-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    checked={selectedConditions.includes(condition.name)}
                    onChange={() => {
                      setSelectedConditions(
                        selectedConditions.includes(condition.name)
                          ? selectedConditions.filter((c) => c !== condition.name)
                          : [...selectedConditions, condition.name]
                      );
                      setCurrentPage(1);
                    }}
                    aria-label={`Filter by condition ${condition.name}`}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm font-medium">
                    {condition.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                  {condition.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <button
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-2.5 px-4 rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 text-sm"
            aria-label="Apply filters"
          >
            <Filter className="h-4 w-4 inline mr-2" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;