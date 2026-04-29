import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const Footer = () => {
  const categories = [
    'Staples', 'Beverages', 'Personal Care', 'Home Care', 
    'Baby Care', 'Vegetables & Fruits', 'Snacks & Foods', 'Dairy & Bakery'
  ];

  const services = [
    'About Us', 'Terms & Conditions', 'FAQ', 'Privacy Policy', 
    'E-waste Policy', 'Cancellation & Return Policy'
  ];

  return (
    // Sử dụng màu nền xanh đặc trưng giống bản thiết kế
    <footer className="bg-[#008ecc] text-white pt-12 pb-6 px-4 md:px-8 font-sans relative overflow-hidden">
      
      {/* Hiệu ứng vòng tròn mờ ở góc phải (Trang trí thêm cho giống Figma) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Cột 1: Thông tin liên hệ & App (Chiếm 5 phần) */}
        <div className="md:col-span-5">
          <h2 className="text-3xl font-bold mb-6">TrùmLinhKiện</h2>
          
          <h3 className="text-lg font-semibold mb-4"></h3>
          
          <div className="space-y-4 mb-6">
            {/* WhatsApp */}
            <div className="flex items-center gap-3">
              <MessageCircle size={24} />
              <div>
                <p className="text-sm text-blue-100">Fanpage</p>
                <a href="https://www.facebook.com/TrumLinhKien" target="_blank" rel="noopener noreferrer" className="font-medium">
                  https://www.facebook.com/TrumLinhKien
                </a>
              </div>
            </div>
            
            {/* Call Us */}
            <div className="flex items-center gap-3">
              <Phone size={24} />
              <div>
                <p className="text-sm text-blue-100">Hotline</p>
                <p className="font-medium">0866 666 666</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Download App</h3>
          <div className="flex flex-wrap gap-3">
            {/* Nút App Store giả lập (Sau này bạn thay bằng thẻ <img> thật) */}
            <button className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
              <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              <div className="text-left">
                <div className="text-[10px] leading-none">Download on the</div>
                <div className="text-sm font-semibold leading-tight">App Store</div>
              </div>
            </button>
            
            {/* Nút Google Play giả lập */}
            <button className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
               <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
              <div className="text-left">
                <div className="text-[10px] leading-none">GET IT ON</div>
                <div className="text-sm font-semibold leading-tight">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Cột 2: Categories (Chiếm 3 phần) */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold mb-4 inline-block border-b-2 border-white pb-1">
            Most Popular Categories
          </h3>
          <ul className="space-y-3 mt-2">
            {categories.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-blue-50 hover:text-white transition cursor-pointer text-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Customer Services (Chiếm 4 phần) */}
        <div className="md:col-span-4">
          <h3 className="text-lg font-semibold mb-4 inline-block border-b-2 border-white pb-1">
            Customer Services
          </h3>
          <ul className="space-y-3 mt-2">
            {services.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-blue-50 hover:text-white transition cursor-pointer text-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Dòng Copyright dưới cùng */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-blue-400/50 text-center text-sm text-blue-100 relative z-10">
        © 2022 All rights reserved. Reliance Retail Ltd.
      </div>

    </footer>
  );
};

export default Footer;