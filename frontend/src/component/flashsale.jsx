import React from 'react';
import { ChevronRight } from 'lucide-react';

const FlashSale = () => {
  // Dữ liệu mẫu thay thế bằng Linh Kiện PC
  const products = [
    {
      id: 1,
      name: "VGA ASUS ROG Strix RTX 4090",
      image: "https://nguyencongpc.vn/media/product/250-24955-vga-asus-rog-strix-rtx-4090-24g-gaming.png",
      currentPrice: "45.990.000đ",
      originalPrice: "55.000.000đ",
      discount: "16%",
      save: "9.010.000đ",
      isActive: false // Trạng thái thẻ bình thường
    },
    {
      id: 2,
      name: "CPU Intel Core i9 14900K",
      image: "https://nguyencongpc.vn/media/product/250-25081-cpu-intel-core-i9-13900k.png",
      currentPrice: "14.500.000đ",
      originalPrice: "16.000.000đ",
      discount: "10%",
      save: "1.500.000đ",
      isActive: true // Trạng thái thẻ đang được chọn (viền xanh) giống trong Figma
    },
    {
      id: 3,
      name: "Mainboard GIGABYTE Z790 AORUS",
      image: "https://nguyencongpc.vn/media/product/250-24699-mainboard-gigabyte-z790-aorus-elite-ax.png",
      currentPrice: "8.990.000đ",
      originalPrice: "10.500.000đ",
      discount: "15%",
      save: "1.510.000đ",
      isActive: false
    },
    {
      id: 4,
      name: "RAM Corsair Dominator 32GB",
      image: "https://nguyencongpc.vn/media/product/250-22288-ram-corsair-dominator-platinum-rgb-32gb.png",
      currentPrice: "4.500.000đ",
      originalPrice: "5.200.000đ",
      discount: "13%",
      save: "700.000đ",
      isActive: false
    },
    {
      id: 5,
      name: "SSD Samsung 990 PRO 2TB",
      image: "https://nguyencongpc.vn/media/product/250-23743-ssd-samsung-990-pro-2tb.png",
      currentPrice: "4.200.000đ",
      originalPrice: "5.000.000đ",
      discount: "16%",
      save: "800.000đ",
      isActive: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-10 mb-12 font-sans">
      
      {/* 1. Phần Tiêu đề (Header) */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          Grab the best deal on <span className="text-[#0088cc]">PC Parts</span>
        </h2>
        <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0088cc] transition-colors">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>

      {/* Đường kẻ gạch dưới tiêu đề (Có phần màu xanh lam mồi ở đầu) */}
      <div className="w-full h-[2px] bg-gray-100 mb-6 relative">
        <div className="absolute top-0 left-0 h-full w-48 bg-[#0088cc]"></div>
      </div>

      {/* 2. Danh sách sản phẩm trượt ngang (Carousel) */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar">
        {products.map((product) => (
          <div 
            key={product.id}
            // Thẻ card: rộng cố định để không bị ép nhỏ, bo góc, có viền xanh nếu isActive = true
            className={`flex-none w-[240px] md:w-[260px] bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
              product.isActive 
                ? 'border-2 border-[#0088cc] shadow-md' 
                : 'border border-gray-100 hover:border-[#0088cc] hover:shadow-md'
            }`}
          >
            {/* Vùng Ảnh Sản Phẩm */}
            <div className="relative h-48 bg-[#f8f9fa] p-6 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              {/* Tag Giảm giá (Góc phải trên cùng) */}
              <div className="absolute top-0 right-0 bg-[#0088cc] text-white text-xs font-bold px-3 py-2 rounded-bl-xl">
                {product.discount}<br/>OFF
              </div>
            </div>

            {/* Vùng Thông Tin Sản Phẩm */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 truncate" title={product.name}>
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">{product.currentPrice}</span>
                <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
              </div>
              
              <div className="text-sm font-medium text-[#28a745]">
                Save - {product.save}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FlashSale;