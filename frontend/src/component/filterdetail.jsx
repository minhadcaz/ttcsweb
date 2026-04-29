import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

const FilterDetail = ({ title, options, totalResults, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // Mảng lưu các tùy chọn đang chọn
  const dropdownRef = useRef(null);

  // Xử lý sự kiện click ra ngoài màn hình để tự động đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm chọn/bỏ chọn một mục
  const toggleOption = (optionValue) => {
    setSelectedOptions((prev) => 
      prev.includes(optionValue)
        ? prev.filter((item) => item !== optionValue) // Nếu đã chọn thì bỏ ra
        : [...prev, optionValue] // Nếu chưa chọn thì thêm vào
    );
  };

  // Hàm bỏ chọn tất cả
  const handleClear = () => {
    setSelectedOptions([]);
  };

  // Hàm áp dụng (khi bấm Xem kết quả)
  const handleApply = () => {
    setIsOpen(false);
    if (onApply) onApply(selectedOptions); // Gửi mảng dữ liệu đã chọn lên component cha
  };

  // Giao diện Nút Toggle bên ngoài
  const hasSelection = selectedOptions.length > 0;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* 1. NÚT KÍCH HOẠT (TRIGGER BUTTON) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm transition-colors ${
          hasSelection || isOpen 
            ? 'border-red-500 text-red-600 bg-red-50 font-medium' // Trạng thái đang chọn hoặc đang mở
            : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400'
        }`}
      >
        {title} <ChevronDown className="w-4 h-4" />
      </button>

      {/* 2. CỬA SỔ POP-OVER (NỘI DUNG BỘ LỌC) */}
      {isOpen && (
        <div className="absolute z-50 mt-2 top-full left-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header Pop-over */}
          <div className="flex justify-between items-center p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Danh sách nút tùy chọn (Grid Layout) */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => {
                const isSelected = selectedOptions.includes(option);
                
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`relative py-2 px-3 border rounded-md text-sm text-center transition-all duration-200 ${
                      isSelected 
                        ? 'border-red-500 text-red-600 font-medium bg-red-50' // Style khi được chọn
                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 bg-white' // Style mặc định
                    }`}
                  >
                    {option}
                    
                    {/* Dấu tick đỏ tuyệt đối ở góc phải trên cùng */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Pop-over (Khu vực nút bấm hành động) */}
          <div className="p-3 border-t border-gray-100 flex gap-3 bg-gray-50">
            <button 
              onClick={handleClear}
              disabled={!hasSelection}
              className={`flex-1 py-2 text-sm font-medium border rounded-md transition-colors ${
                hasSelection 
                  ? 'border-red-500 text-red-500 bg-white hover:bg-red-50' 
                  : 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              Bỏ chọn
            </button>
            
            <button 
              onClick={handleApply}
              className="flex-[2] py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              Xem {totalResults} kết quả
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default FilterDetail;