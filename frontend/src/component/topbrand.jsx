import React from 'react';
import { ChevronRight } from 'lucide-react';

const TopBrands = () => {
  // Dữ liệu mẫu thay thế bằng các hãng Linh kiện PC (Màu sắc giữ nguyên theo thiết kế)
  const brands = [
    {
      id: 1,
      tag: "ASUS ROG",
      logoText: "ASUS", // Trong thực tế bạn có thể thay bằng thẻ <img> chứa logo trắng của Asus
      discount: "UP to 30% OFF",
      image: "https://nguyencongpc.vn/media/product/250-24955-vga-asus-rog-strix-rtx-4090-24g-gaming.png",
      bgColor: "bg-[#2d2d2d]", // Màu đen xám (Giống thẻ iPhone)
      textColor: "text-white",
      tagBg: "bg-gray-600/50"
    },
    {
      id: 2,
      tag: "GIGABYTE",
      logoText: "AORUS",
      discount: "UP to 40% OFF",
      image: "https://nguyencongpc.vn/media/product/250-24699-mainboard-gigabyte-z790-aorus-elite-ax.png",
      bgColor: "bg-[#fff3cc]", // Màu vàng nhạt (Giống thẻ Realme)
      textColor: "text-gray-800",
      tagBg: "bg-[#ffe58f]"
    },
    {
      id: 3,
      tag: "CORSAIR",
      logoText: "CORSAIR",
      discount: "UP to 50% OFF",
      image: "https://nguyencongpc.vn/media/product/250-22288-ram-corsair-dominator-platinum-rgb-32gb.png",
      bgColor: "bg-[#ffe0d3]", // Màu cam đào nhạt (Giống thẻ Xiaomi)
      textColor: "text-gray-800",
      tagBg: "bg-[#ffcba4]"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 mb-12 font-sans">
      
      {/* 1. Phần Tiêu đề */}
      <div className="flex justify-between items-end mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
          Top <span className="text-[#0088cc]">PC Brands</span>
        </h2>
        <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0088cc] transition-colors">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>

      {/* Đường kẻ mồi màu xanh */}
      <div className="w-full h-[2px] bg-gray-100 mb-8 relative">
        <div className="absolute top-0 left-0 h-full w-48 bg-[#0088cc]"></div>
      </div>

      {/* 2. Danh sách các thẻ Banner trượt ngang */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
        {brands.map((brand) => (
          <div 
            key={brand.id}
            // Kích thước thẻ cố định, overflow-hidden để cắt các hình tròn trang trí bị tràn
            className={`relative flex-none w-[300px] md:w-[380px] h-[180px] rounded-2xl p-6 overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow snap-start ${brand.bgColor}`}
          >
            {/* Hiệu ứng vòng tròn trang trí mờ ảo ở background (Giống thiết kế) */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none"></div>
            <div className="absolute right-20 -bottom-20 w-48 h-48 border-[20px] border-white opacity-10 rounded-full pointer-events-none"></div>

            {/* Nội dung chữ (Nửa bên trái) */}
            <div className="relative z-10 w-3/5 flex flex-col justify-between h-full">
              {/* Tag tên hãng nhỏ ở trên */}
              <span className={`inline-block px-3 py-1 text-[10px] md:text-xs font-semibold rounded w-max tracking-wider ${brand.tagBg} ${brand.textColor}`}>
                {brand.tag}
              </span>
              
              {/* Logo / Tên hãng to ở giữa */}
              <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${brand.textColor}`}>
                {brand.logoText}
              </h3>
              
              {/* Phần trăm giảm giá ở dưới */}
              <p className={`text-sm md:text-base font-medium opacity-90 ${brand.textColor}`}>
                {brand.discount}
              </p>
            </div>

            {/* Ảnh sản phẩm (Nửa bên phải) */}
            <div className="absolute right-0 top-0 w-1/2 h-full p-2 flex items-center justify-end">
              <img 
                src={brand.image} 
                alt={brand.logoText} 
                className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Thanh dấu chấm điều hướng (Pagination Dots) */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <span className="w-6 h-2 bg-[#0088cc] rounded-full transition-all duration-300"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"></span>
      </div>

    </div>
  );
};

export default TopBrands;