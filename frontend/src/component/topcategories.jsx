import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopCategories = () => {
  // Giữ lại 10 danh mục chính (theo yêu cầu)
  const categories = [
    { id: 1, slug: 'cpu', name: 'CPU - Vi xử lý', image: 'https://nguyencongpc.vn/media/product/250-25081-cpu-intel-core-i9-13900k.png' },
    { id: 2, slug: 'mainboard', name: 'Mainboard', image: 'https://nguyencongpc.vn/media/product/250-24699-mainboard-gigabyte-z790-aorus-elite-ax.png' },
    { id: 3, slug: 'ram', name: 'RAM', image: 'https://nguyencongpc.vn/media/product/250-22288-ram-corsair-dominator-platinum-rgb-32gb.png' },
    { id: 4, slug: 'ssd', name: 'SSD', image: 'https://nguyencongpc.vn/media/product/250-23743-ssd-samsung-990-pro-2tb.png' },
    { id: 5, slug: 'hdd', name: 'HDD', image: 'https://via.placeholder.com/120?text=HDD' },
    { id: 6, slug: 'nguon', name: 'Nguồn (PSU)', image: 'https://nguyencongpc.vn/media/product/250-24436-nguon-may-tinh-corsair-rm1000x-shift-80-plus-gold-fully-modular-cp-9020253-na.png' },
    { id: 7, slug: 'vga', name: 'VGA - Card màn hình', image: 'https://nguyencongpc.vn/media/product/250-24955-vga-asus-rog-strix-rtx-4090-24g-gaming.png' },
    { id: 8, slug: 'case', name: 'Case - Vỏ máy', image: 'https://via.placeholder.com/120?text=Case' },
    { id: 9, slug: 'monitor', name: 'Màn hình (Monitor)', image: 'https://via.placeholder.com/120?text=Monitor' },
    { id: 10, slug: 'mouse', name: 'Chuột (Mouse)', image: 'https://via.placeholder.com/120?text=Mouse' }
  ];

  const navigate = useNavigate();

  const onCategoryClick = (slug) => {
    // Điều hướng đến trang Collections với query param `category` để lọc
    navigate(`/collections?category=${encodeURIComponent(slug)}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 mb-12 font-sans">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          Shop From <span className="text-[#0088cc]">Top Categories</span>
        </h2>
        <a href="/collections" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0088cc] transition-colors">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>

      <div className="w-full h-[2px] bg-gray-100 mb-8 relative">
        <div className="absolute top-0 left-0 h-full w-56 bg-[#0088cc]"></div>
      </div>

      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 pt-2 no-scrollbar">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => onCategoryClick(category.slug)}
            className="flex flex-col items-center flex-none cursor-pointer group"
          >
            <div 
              className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-[#f3f5f7] transition-all duration-300 border border-transparent group-hover:border-[#0088cc] group-hover:shadow-md`}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
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