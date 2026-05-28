import React, { useState, useEffect, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

import { 
  MapPin, 
  Truck, 
  Home,
  Search, 
  List, 
  User, 
  ShoppingCart, 
  ChevronDown,
  Menu,
  X,
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Speaker,
  Keyboard,
  Mouse,
  Headphones,
  Gamepad2,
  Printer,
  Package,
  Gift,
  LogOut,
  FileText,
  UserCircle,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const logo1 = new URL('../../assets/logo1.png', import.meta.url).href;
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setIsNavMenuOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      setShowSuggestions(true);
      // Generate suggestions based on common products
      const suggestions = [
        'CPU Intel',
        'CPU AMD Ryzen',
        'Mainboard ASUS',
        'RAM DDR5',
        'SSD NVMe',
        'VGA RTX 4070',
        'PSU 750W',
        'Monitor 27 inch'
      ].filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSearchSuggestions(suggestions);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/collections?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigationItems = [
    { name: 'CPU - Vi xử lý', slug: 'cpu', icon: Cpu },
    { name: 'Mainboard', slug: 'mainboard', icon: Monitor },
    { name: 'RAM', slug: 'ram', icon: HardDrive },
    { name: 'SSD', slug: 'ssd', icon: HardDrive },
    { name: 'HDD', slug: 'hdd', icon: HardDrive },
    { name: 'Nguồn (PSU)', slug: 'nguon', icon: Package },
    { name: 'VGA - Card màn hình', slug: 'vga', icon: Cpu },
    { name: 'Case - Vỏ máy', slug: 'case', icon: Package },
    { name: 'Màn hình (Monitor)', slug: 'monitor', icon: Monitor },
    { name: 'Chuột (Mouse)', slug: 'mouse', icon: Mouse }
  ];

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
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative" ref={navMenuRef}>
            <button
              type="button"
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-[22px] border border-[#eef4f8] bg-[#f5fafc] text-[#2ea3d4] shadow-[0_1px_6px_rgba(15,23,42,0.06)] transition-colors hover:bg-[#eef7fb] hover:text-[#1f8dbd]"
              aria-label="Mở danh mục sản phẩm"
              aria-expanded={isNavMenuOpen}
            >
              <Menu size={28} strokeWidth={2.2} />
            </button>

            {isNavMenuOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <div className="border-b border-gray-100 bg-white px-4 py-3">
                  <p className="text-sm font-semibold tracking-wide text-gray-900">DANH MỤC SẢN PHẨM</p>
                </div>

                <div className="max-h-[70vh] overflow-y-auto py-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setIsNavMenuOpen(false);
                          // Nếu có slug, điều hướng tới collections với query
                          if (item.slug) navigate(`/collections?category=${encodeURIComponent(item.slug)}`);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-gray-800 transition-colors hover:bg-[#f4f7fb] hover:text-[#d71820]"
                      >
                        <Icon size={18} className="shrink-0 text-gray-500" strokeWidth={1.8} />
                        <span className="flex-1 leading-none">{item.name}</span>
                        <ChevronDown size={16} className="shrink-0 rotate-[-90deg] text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo1} alt="TrùmLinhKiện" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-[#0088cc]">TrùmLinhKiện</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="flex-1 bg-[#f3f5f7] rounded-lg flex items-center px-4 py-2.5">
            <Search size={20} className="text-blue-500 mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, thương hiệu, và hơn thế nữa ..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
            />
            <List 
              size={20} 
              className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleSearch()}
            />
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {searchSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-2"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                >
                  <Search size={16} className="text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
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

                  {user?.roles && (user.roles === 'admin' || user.roles === 'ADMIN') && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ShieldCheck size={18} />
                      <span>Trang Admin</span>
                    </Link>
                  )}

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
          <Link to="/collections" className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
            <ShoppingCart size={20} className="text-blue-500" />
            <span className="hidden sm:inline">Sản phẩm</span>
          </Link>
        </div>
      </div>

    </header>
    
  );
};

export default Header;