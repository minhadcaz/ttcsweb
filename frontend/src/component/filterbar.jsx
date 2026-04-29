import React from 'react';
import { Filter, ChevronDown, ListOrdered } from 'lucide-react';

const FilterBar = ({ filters = [], currentSort = 'Nổi bật', onFilterClick, onSortChange }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Nút Bộ lọc tổng */}
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => onFilterClick && onFilterClick('all')}
        >
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>

        {/* Render tự động các nút lọc dựa trên props 'filters' truyền vào */}
        {filters.map((option, index) => (
          <button 
            key={index}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:border-blue-500 transition-colors whitespace-nowrap"
            onClick={() => onFilterClick && onFilterClick(option)}
          >
            {option} <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        ))}

        {/* Nút Xếp theo (luôn nằm bên phải) */}
        <div className="ml-auto flex items-center">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onSortChange}
          >
            <ListOrdered className="w-4 h-4" /> 
            Xếp theo: <strong className="font-semibold">{currentSort}</strong> 
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FilterBar;