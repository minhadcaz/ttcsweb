import React from 'react';
import { ChevronRight } from 'lucide-react';

const SpecialPromotions = () => {
  // Dữ liệu các danh mục khuyến mãi của cửa hàng linh kiện
  const promotions = [
    {
      id: 1,
      category: "Combo Main + CPU",
      discount: "UP to 35% OFF",
      // Thay bằng ảnh combo hoặc linh kiện tương ứng
      image: "https://nguyencongpc.vn/media/product/250-24699-mainboard-gigabyte-z790-aorus-elite-ax.png", 
      isActive: true // Thẻ đang được chọn (viền xanh)
    },
    {
      id: 2,
      category: "Gaming Gear",
      discount: "UP to 50% OFF",
      image: "https://nguyencongpc.vn/media/product/250-22288-ram-corsair-dominator-platinum-rgb-32gb.png",
      isActive: false
    },
    {
      id: 3,
      category: "Màn Hình PC",
      discount: "UP to 20% OFF",
      image: "https://nguyencongpc.vn/media/product/250-24955-vga-asus-rog-strix-rtx-4090-24g-gaming.png",
      isActive: false
    },
    {
      id: 4,
      category: "Ổ cứng SSD",
      discount: "UP to 40% OFF",
      image: "https://nguyencongpc.vn/media/product/250-23743-ssd-samsung-990-pro-2tb.png",
      isActive: false
    },
    {
      id: 5,
      category: "Tản Nhiệt",
      discount: "UP to 25% OFF",
      image: "https://nguyencongpc.vn/media/product/250-22922-tan-nhiet-nuoc-corsair-icue-h150i-elite-lcd-xt.png",
      isActive: false
    },
    {
      id: 6,
      category: "Ghế Công Thái Học",
      discount: "UP to 30% OFF",
      image: "https://nguyencongpc.vn/media/product/250-24436-nguon-may-tinh-corsair-rm1000x-shift-80-plus-gold-fully-modular-cp-9020253-na.png",
      isActive: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 mb-12 font-sans">
      
      {/* 1. Tiêu đề Khu vực Khuyến mãi */}
      <div className="flex justify-between items-end mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
           <span className="text-[#0088cc]">Khuyến mãi sốc</span>
        </h2>
        <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0088cc] transition-colors">
          Xem tất cả <ChevronRight size={16} className="ml-1" />
        </a>
      </div>

      {/* Đường kẻ mồi màu xanh */}
      <div className="w-full h-[2px] bg-gray-100 mb-8 relative">
        <div className="absolute top-0 left-0 h-full w-40 bg-[#0088cc]"></div>
      </div>

      {/* 2. Danh sách các thẻ khuyến mãi trượt ngang */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar">
        {promotions.map((promo) => (
          <div 
            key={promo.id}
            className="flex flex-col items-center flex-none cursor-pointer group w-[130px] md:w-[150px]"
          >
            {/* Khối hình vuông chứa ảnh */}
            <div 
              className={`w-full aspect-square rounded-2xl flex items-center justify-center p-4 transition-all duration-300 ${
                promo.isActive 
                  ? 'border border-[#0088cc] shadow-[0_8px_20px_rgb(0,136,204,0.15)] bg-white' 
                  : 'bg-[#f4f5f7] border border-transparent group-hover:border-[#0088cc] group-hover:shadow-md group-hover:bg-white'
              }`}
            >
              <img 
                src={promo.image} 
                alt={promo.category} 
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Tên danh mục khuyến mãi */}
            <span className="mt-4 text-xs md:text-sm font-medium text-gray-500 group-hover:text-[#0088cc] transition-colors text-center w-full truncate">
              {promo.category}
            </span>
            
            {/* Mức giảm giá */}
            <span className="mt-1 text-sm md:text-base font-bold text-gray-800 text-center w-full">
              {promo.discount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SpecialPromotions;