import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = () => {
  // Dữ liệu bây giờ cực kỳ đơn giản, chỉ cần link ảnh banner
  // Gợi ý: Bạn nên thiết kế các ảnh này theo cùng 1 tỷ lệ (ví dụ: 1920x400 hoặc 1200x300)
  const slides = [
    {
      id: 1,
      image: "https://nguyencongpc.vn/media/banner/09_Mar310bba477a9b95028937decba51e815c.jpg", 
    },
    {
      id: 2,
      image: "https://nguyencongpc.vn/media/banner/05_Juna4d65cc940a1d9c49f480f7a9f657d08.jpg", 
    },
    {
      id: 3,
      image: "https://nguyencongpc.vn/media/banner/09_Mar28811bcfb195502b91fb1e1801a10331.jpg",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 mt-6">
      
      {/* Khung chứa Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg  md:aspect-[915/248]">
        
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full bg-gray-100">
              {/* Ảnh Banner Full Khung */}
              <img 
                src={slide.image} 
                alt={`Banner ${slide.id}`} 
                // Dùng object-cover để ảnh lấp đầy khung mà không bị méo tỷ lệ
                className="w-full h-full object-contain cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Thanh dấu chấm điều hướng */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full bg-white shadow-md ${
                currentSlide === index ? "w-8 h-2.5 opacity-100" : "w-2.5 h-2.5 opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Nút Previous */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-white hover:text-blue-600 hover:scale-105 transition-all z-20"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Nút Next */}
      <button 
        onClick={nextSlide}
        className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-white hover:text-blue-600 hover:scale-105 transition-all z-20"
      >
        <ChevronRight size={24} />
      </button>

    </div>
  );
};

export default HeroSlider;