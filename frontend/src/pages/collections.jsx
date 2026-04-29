import React, { useState } from 'react';
import FilterBar from '../component/filterbar';
import FilterDetail from '../component/filterdetail';
import { 
  Home, 
  
  Flame, 
  Gift, 
 
} from 'lucide-react';

const Collections = () => {
  // GIẢ LẬP DỮ LIỆU ĐỘNG: 
  // Nếu khách vào danh mục Laptop, API trả về mảng này:
  const laptopFilters = [
    "Tình trạng sản phẩm", "Giá", "Hãng", "CPU", 
    "Kích thước màn hình", "Nhu cầu sử dụng", "RAM", "SSD", "VGA"
  ];

  const filterOptions = {
    status: ["Sẵn hàng", "Hết hàng"],
    brands: ["Adata", "Corsair", "G.Skill", "GIGABYTE", "KINGMAX", "Kingston", "Patriot", "SSTC", "Team Group", "V-Color"],
    busRam: ["3200MHz", "3600MHz", "5200MHz", "5600MHz", "6000MHz"],
    capacity: ["16 GB (2 × 8 GB)", "32 GB (2 × 16 GB)", "64 GB (2 × 32 GB)", "8 GB (1 × 8 GB)"],
    types: ["DDR4", "DDR5"],
    leds: ["Không", "RGB"]
  };

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: "Sẵn hàng",
    minPrice: 490000,
    maxPrice: 38990000,
    brands: [],
    busRam: [],
    capacity: [],
    ramType: [],
    led: "Không"
  });

  const toggleMultiSelect = (key, value) => {
    setSelectedFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value]
      };
    });
  };

  const setSingleSelect = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilterModal = () => {
    setSelectedFilters({
      status: "Sẵn hàng",
      minPrice: 490000,
      maxPrice: 38990000,
      brands: [],
      busRam: [],
      capacity: [],
      ramType: [],
      led: "Không"
    });
  };

  const handleApplyFilters = () => {
    console.log("Áp dụng bộ lọc:", selectedFilters);
    setIsFilterModalOpen(false);
  };

  const products = [
    {
      id: 1,
      name: "Laptop ASUS ExpertBook P1403CVA-C3U08-50W",
      image: "https://via.placeholder.com/300x200?text=ASUS+ExpertBook",
      isHotDeal: true,
      hasGift: false,
      price: "13.490.000đ",
      isActive: true
    },
    // ... (Giữ nguyên các sản phẩm khác như cũ)
    {
      id: 2,
      name: "Laptop Acer Aspire Lite 14 AL14-52P-309T",
      image: "https://via.placeholder.com/300x200?text=Acer+Aspire",
      isHotDeal: true,
      hasGift: false,
      price: "11.990.000đ",
      isActive: false
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-4 gap-2">
          <a href="/" className="text-blue-600 hover:underline flex items-center gap-1">
            <Home className="w-4 h-4" /> Trang chủ
          </a>
          <span>/</span>
          <span className="text-gray-700">Laptop Học tập và Làm việc (Dưới 15 triệu)</span>
        </nav>

        {/* Banner */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
          <img 
            src="https://via.placeholder.com/1200x300?text=BACK2SCHOOL+BANNER" 
            alt="Back to School Banner" 
            className="w-full h-auto object-cover aspect-[4/1] md:aspect-[5/1] lg:aspect-[6/1]"
          />
        </div>

        {/* ========================================================= */}
        {/* GỌI COMPONENT FILTER BAR ĐÃ TÁCH                            */}
        {/* Truyền mảng dữ liệu laptopFilters vào prop 'filters'      */}
        {/* ========================================================= */}
        <FilterBar 
          filters={laptopFilters} 
          currentSort="Nổi bật"
          onFilterClick={(filterName) => {
            if (filterName === 'all') {
              setIsFilterModalOpen(true);
            } else {
              console.log("Khách vừa click bộ lọc:", filterName);
            }
          }}
        />
        

        {isFilterModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <div
              className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl ring-1 ring-black/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
                  <p className="text-sm text-gray-500">Chọn nhanh điều kiện lọc để tìm đúng RAM bạn cần.</p>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-gray-500 hover:text-gray-900 rounded-full p-2 transition"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-6 px-6 py-5 lg:grid-cols-3 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Tình trạng sản phẩm</h3>
                    <div className="flex flex-wrap gap-3">
                      {filterOptions.status.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSingleSelect('status', option)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                            selectedFilters.status === option
                              ? 'bg-red-50 border-red-500 text-red-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Giá</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={selectedFilters.minPrice}
                          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                        />
                        <input
                          type="number"
                          value={selectedFilters.maxPrice}
                          onChange={(e) => setSelectedFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                        />
                      </div>
                      <div className="rounded-full bg-gray-200 h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((selectedFilters.maxPrice - selectedFilters.minPrice) / 38990000) * 100))}%`,
                            marginLeft: `${Math.min(100, Math.max(0, (selectedFilters.minPrice / 38990000) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Hãng</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.brands.map((brand) => {
                        const active = selectedFilters.brands.includes(brand);
                        return (
                          <button
                            key={brand}
                            onClick={() => toggleMultiSelect('brands', brand)}
                            className={`px-3 py-2 text-sm rounded-xl border text-left transition ${
                              active
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {brand}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Bus RAM</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.busRam.map((speed) => {
                        const active = selectedFilters.busRam.includes(speed);
                        return (
                          <button
                            key={speed}
                            onClick={() => toggleMultiSelect('busRam', speed)}
                            className={`px-4 py-2 rounded-xl border text-sm transition ${
                              active
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {speed}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Dung lượng</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filterOptions.capacity.map((item) => {
                        const active = selectedFilters.capacity.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => toggleMultiSelect('capacity', item)}
                            className={`px-3 py-2 rounded-xl border text-sm text-left transition ${
                              active
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Loại RAM</h3>
                      <div className="flex flex-col gap-2">
                        {filterOptions.types.map((type) => {
                          const active = selectedFilters.ramType.includes(type);
                          return (
                            <button
                              key={type}
                              onClick={() => toggleMultiSelect('ramType', type)}
                              className={`px-3 py-2 rounded-xl border text-sm transition ${
                                active
                                  ? 'bg-red-50 border-red-500 text-red-600'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Đèn LED</h3>
                      <div className="flex flex-col gap-2">
                        {filterOptions.leds.map((item) => (
                          <button
                            key={item}
                            onClick={() => setSingleSelect('led', item)}
                            className={`px-3 py-2 rounded-xl border text-sm transition ${
                              selectedFilters.led === item
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
                <button
                  onClick={resetFilterModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Bỏ chọn
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lưới Sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 relative flex flex-col ${
                product.isActive 
                  ? 'border-2 border-red-500 shadow-md' 
                  : 'border border-gray-200 hover:shadow-lg hover:border-blue-500'
              }`}
            >
              <div className="relative p-4 aspect-square flex items-center justify-center bg-white">
                {product.isHotDeal && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm">
                    <Flame className="w-3 h-3 fill-current" /> HOT DEAL
                  </div>
                )}
                
                {product.isHotDeal && !product.hasGift && (
                  <div className="absolute top-2 right-2 text-orange-500 z-10">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                )}
                {product.hasGift && (
                  <div className="absolute top-2 right-2 text-red-500 z-10">
                    <Gift className="w-5 h-5" />
                  </div>
                )}

                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 pt-0 flex flex-col flex-grow">
                <h3 className="text-sm text-gray-800 font-medium line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-3">
                  <strong className="text-red-600 text-base">{product.price}</strong>
                </div>
              </div>
            </div>
            
          ))}
        </div>

      </div>
    </div>
  );
};
export default Collections;