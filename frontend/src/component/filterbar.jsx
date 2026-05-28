import React, { useState, useEffect, useRef } from 'react';
import { Filter, ChevronDown, ListOrdered } from 'lucide-react';

const FilterBar = ({ currentSort = 'Nổi bật', onSortChange, onFilterClick }) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortOptions = ['Nổi bật', 'Giá tăng dần', 'Giá giảm dần'];

  const handleSortSelect = (option) => {
    if (onSortChange) onSortChange(option);
    setIsSortDropdownOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-wrap items-center gap-3">
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => onFilterClick && onFilterClick()}
        >
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>



        {/* Nút Xếp theo (luôn nằm bên phải) */}
        <div className="ml-auto flex items-center relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            <ListOrdered className="w-4 h-4" /> 
            Xếp theo: <strong className="font-semibold">{currentSort}</strong> 
            <ChevronDown className="w-4 h-4" />
          </button>
          {isSortDropdownOpen && (
            <div className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  onClick={() => handleSortSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default FilterBar;