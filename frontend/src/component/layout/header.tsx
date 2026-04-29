import React, { useState, useEffect, useRef, RefObject } from 'react';
import logo1 from '../../assets/logo1.png';
import {Link, useNavigate} from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

import { 
  MapPin, 
  Truck, 
  Home,
  Tag, 
  Menu, 
  Search, 
  List, 
  User, 
  ShoppingCart, 
  ChevronDown,
  LogOut,
  FileText,
  UserCircle
} from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
}

// MỚI THÊM: Cập nhật dữ liệu để mỗi danh mục có thêm mảng menu con (subCategories)
const pcCategories = [
  {
    name: "CPU - Bộ vi xử lý",
    subCategories: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"]
  },
  {
    name: "Mainboard - Bo mạch chủ",
    subCategories: ["Mainboard Intel (H610, B760, Z790)", "Mainboard AMD (A620, B650, X670)"]
  },
  {
    name: "VGA - Card màn hình",
    subCategories: ["NVIDIA GeForce RTX 40 Series", "NVIDIA GeForce RTX 30 Series", "AMD Radeon RX 7000 Series"]
  },
  { 
    name: "RAM - Bộ nhớ trong", 
    subCategories: ["RAM DDR4", "RAM DDR5", "RAM Laptop"] 
  },
  { 
    name: "Ổ cứng SSD / HDD", 
    subCategories: ["SSD NVMe (M.2)", "SSD SATA", "HDD Desktop", "HDD Laptop"] 
  },
  { 
    name: "Nguồn máy tính (PSU)", 
    subCategories: ["Dưới 500W", "500W - 650W", "700W - 850W", "Trên 1000W"] 
  },
  { 
    name: "Case - Vỏ máy tính", 
    subCategories: ["Case Mid Tower", "Case Full Tower", "Case Mini ITX"] 
  },
  { 
    name: "Tản nhiệt PC", 
    subCategories: ["Tản nhiệt khí", "Tản nhiệt nước AIO", "Tản nhiệt nước Custom", "Quạt tản nhiệt (Fan)"] 
  },
  {name: "Build PC"}
];

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }

    // Lắng nghe sự thay đổi localStorage (khi đăng nhập/đăng xuất ở tab khác)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('authUser');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsUserMenuOpen(false);
    addToast('Đã đăng xuất thành công! 👋', 'success', 2000);
    navigate('/');
  };

  const categories = [
   { name: '🔥 Khuyến Mãi Hot', active: true, link: '#' },
    { name: 'Lắp Ráp PC (Build PC)', active: false, isBuildPC: true, link: '/build-pc' }, // Đường dẫn chuẩn bị sẵn cho trang Build PC
    { name: 'PC Gaming', active: false, link: '#' },
    { name: 'PC Văn Phòng', active: false, link: '#' },
    { name: 'Linh Kiện Cũ Giá Rẻ', active: false, link: '#' },
    { name: 'Bàn Phím & Chuột', active: false, link: '#' },
    { name: 'Màn Hình', active: false, link: '#' },
    
  ];

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false); // state theo dõi trạng thái đóng mở của bảng danh mục cấp 1
  
  //  State theo dõi người dùng đang hover vào danh mục số mấy
  const [activeHoverCategory, setActiveHoverCategory] = useState<number | null>(null); 
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false); 
        setActiveHoverCategory(null); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  return (
    
    <header className="w-full font-sans bg-white">
      {/* Top bar */}
      <div className="bg-[#f8f9fa] text-gray-500 text-xs sm:text-sm py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center border-b border-gray-100">

        <div className="mb-2 sm:mb-0">
          Chào mừng đến với <strong className="text-blue-600">TrùmLinhKiện</strong> - Cửa hàng linh kiện top 1 H-Town 
        </div>
        
        <div className="flex items-center space-x-4">

          <div className="flex items-center hover:text-blue-600 cursor-pointer transition-colors">
            <MapPin size={16} className="mr-1 text-blue-500" />
            <span>Deliver to <strong className="text-gray-700">423651</strong></span>
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          <div className="flex items-center hover:text-blue-600 cursor-pointer transition-colors">
            <Truck size={16} className="mr-1 text-blue-500" />
            <span>Tra cứu đơn hàng</span>
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          <div className="flex items-center hover:text-blue-600 cursor-pointer transition-colors">
            <Home size={16} className="mr-1 text-blue-500" />
            <span>Hệ thống cửa hàng</span>
          </div>

        </div>

      </div>

      {/* Main Header */}
      <div className="py-4 px-4 md:px-8 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Logo Area & Nút Menu */}
        <div className="flex items-center gap-3">

          <div className="relative" ref={menuRef}>

            <button 
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="p-2 bg-[#f0f8ff] rounded-xl text-blue-500 hover:bg-blue-100 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Bảng danh mục Dropdown Cấp 1 */}
            {isCategoryMenuOpen && (

              <div className="absolute top-full left-0 mt-3 w-72 bg-white border border-gray-100 shadow-xl rounded-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">

               

                <ul className="flex flex-col relative" onMouseLeave={() => setActiveHoverCategory(null)}> {/*thêm onmouseLeave để trượt ra khỏi bảng menu con tự tắt*/}
                  {pcCategories.map((category, index) => (
                    <li 
                      key={index}
                      // MỚI THÊM: Khi chuột trỏ vào thẻ li nào, gán state bằng index của thẻ đó
                      onMouseEnter={() => setActiveHoverCategory(index)}
                      className="relative group"
                    >
                      <a 
                        href="#" 
                        className="flex justify-between items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0088cc] font-medium transition-colors"
                      >
                        {category.name}
                        {/* Biểu tượng mũi tên nhỏ báo hiệu có menu cấp 2 */}
                        {category.subCategories && (
                          <ChevronDown size={16} className="-rotate-90 text-gray-400 group-hover:text-blue-500" />
                        )}
                      </a>

                      {/* MỚI THÊM: Bảng danh mục Sub-menu Cấp 2 */}
                      {/* Chỉ hiển thị khi đang hover đúng vào index này VÀ danh mục đó có subCategories */}
                      {activeHoverCategory === index && category.subCategories && (
                        <div className="absolute top-0 left-full ml-1 w-64 bg-white border border-gray-100 shadow-xl rounded-xl z-50 py-2 min-h-full">
                          <ul className="flex flex-col">
                            {category.subCategories.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <a 
                                  href="#" 
                                  onClick={() => {
                                    setIsCategoryMenuOpen(false); // Đóng bảng lớn
                                    setActiveHoverCategory(null); // Đóng bảng nhỏ
                                  }}
                                  className="block px-5 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0088cc] transition-colors"
                                >
                                  {subItem}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={logo1} alt="TrùmLinhKiện" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-[#0088cc]">TrùmLinhKiện</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl bg-[#f3f5f7] rounded-lg items-center px-4 py-2.5">
          <Search size={20} className="text-blue-500 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, thương hiệu, và hơn thế nữa ..." 
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
          />
          <List size={20} className="text-blue-500 cursor-pointer" />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 font-medium text-gray-700">

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <User size={20} className="text-blue-500" />
                <span className="hidden sm:inline text-blue-600 font-semibold">{user.userName}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.userName}</p>
                    <p className="text-xs text-gray-500">{user.Email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <UserCircle size={18} />
                    <span>Thông tin cá nhân</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FileText size={18} />
                    <span>Tra cứu đơn hàng</span>
                  </Link>

                  <div className="border-t border-gray-100 mt-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
              <User size={20} className="text-blue-500" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}

          <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
          <Link to="/cart" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
            <ShoppingCart size={20} className="text-blue-500" />
            <span className="hidden sm:inline">Giỏ Hàng</span>
          </Link>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-gray-100 px-4 md:px-8 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category.active 
                  ? 'bg-[#0088cc] text-white shadow-sm' 
                  : 'bg-[#f3f5f7] text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <ChevronDown size={16} className={`ml-1 ${category.active ? 'text-white' : 'text-blue-500'}`} />
            </button>
          ))}
        </div>
      </div>
    </header>
    
  );
};

export default Header;