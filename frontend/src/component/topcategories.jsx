import React from 'react';
import { ChevronRight } from 'lucide-react';

const TopCategories = () => {
  // Dữ liệu mẫu thay thế bằng Danh mục Linh Kiện PC
  const categories = [
    {
      id: 1,
      name: "VGA - Card màn hình",
      image: "https://nguyencongpc.vn/media/product/250-24955-vga-asus-rog-strix-rtx-4090-24g-gaming.png",
      isActive: true // Trạng thái được chọn (có viền xanh và bóng mờ)
    },
    {
      id: 2,
      name: "CPU - Vi xử lý",
      image: "https://nguyencongpc.vn/media/product/250-25081-cpu-intel-core-i9-13900k.png",
      isActive: false
    },
    {
      id: 3,
      name: "Mainboard",
      image: "https://nguyencongpc.vn/media/product/250-24699-mainboard-gigabyte-z790-aorus-elite-ax.png",
      isActive: false
    },
    {
      id: 4,
      name: "RAM",
      image: "https://nguyencongpc.vn/media/product/250-22288-ram-corsair-dominator-platinum-rgb-32gb.png",
      isActive: false
    },
    {
      id: 5,
      name: "Ổ cứng SSD",
      image: "https://nguyencongpc.vn/media/product/250-23743-ssd-samsung-990-pro-2tb.png",
      isActive: false
    },
    {
      id: 6,
      name: "Nguồn PSU",
      image: "https://nguyencongpc.vn/media/product/250-24436-nguon-may-tinh-corsair-rm1000x-shift-80-plus-gold-fully-modular-cp-9020253-na.png",
      isActive: false
    },
    {
      id: 7,
      name: "Tản nhiệt",
      image: "https://nguyencongpc.vn/media/product/250-22922-tan-nhiet-nuoc-corsair-icue-h150i-elite-lcd-xt.png",
      isActive: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 mb-12 font-sans">
      
      {/* 1. Phần Tiêu đề (Header) giống hệt Flash Sale */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          Shop From <span className="text-[#0088cc]">Top Categories</span>
        </h2>
        <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0088cc] transition-colors">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>

      {/* Đường kẻ gạch dưới tiêu đề */}
      <div className="w-full h-[2px] bg-gray-100 mb-8 relative">
        <div className="absolute top-0 left-0 h-full w-56 bg-[#0088cc]"></div>
      </div>

      {/* 2. Danh sách hình tròn trượt ngang */}
      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 pt-2 no-scrollbar">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex flex-col items-center flex-none cursor-pointer group"
          >
            {/* Vòng tròn chứa ảnh */}
            <div 
              className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-[#f3f5f7] transition-all duration-300 ${
                category.isActive 
                  ? 'border-2 border-[#0088cc] shadow-lg ring-4 ring-blue-50' 
                  : 'border border-transparent group-hover:border-[#0088cc] group-hover:shadow-md'
              }`}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                // Ảnh thu nhỏ lại một chút để không bị chạm viền tròn
                className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Tên danh mục ở dưới */}
            <span className="mt-4 text-sm font-medium text-gray-700 group-hover:text-[#0088cc] transition-colors text-center w-full max-w-[120px]">
              {category.name}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TopCategories;