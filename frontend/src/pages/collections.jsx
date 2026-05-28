import React, { useEffect, useMemo, useState } from 'react';
import FilterBar from '../component/filterbar';
import { Home, Flame, Gift, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CATEGORY_CONFIGS = {
  cpu: {
    label: 'CPU - Bộ vi xử lý',
    banner: 'https://via.placeholder.com/1200x300?text=CPU+Collection',
    apiCategoryId: 'CPU',
    quickFilters: ['Intel', 'AMD', 'Core i5', 'Core i7', 'Ryzen', 'Socket LGA 1700'],
    sections: [
      { key: 'status', title: 'Tình trạng sản phẩm', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Intel', 'AMD'] },
      { key: 'dong_cpu', title: 'Dòng CPU', type: 'multi', options: ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core Ultra 9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7'] },
      { key: 'socket', title: 'Socket', type: 'multi', options: ['LGA 1700', 'LGA 1851', 'AM4', 'AM5'] },
      { key: 'platform', title: 'Platform', type: 'single', options: ['Desktop'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 50000000 },
      { key: 'the_he_cpu', title: 'Thế hệ CPU', type: 'multi', options: ['Intel Core Ultra', 'Intel 12th Gen', 'Intel 13th Gen', 'Intel 14th Gen', 'AMD 3000 Series', 'AMD 4000 Series'] },
      { key: 'do_hoa_tich_hop', title: 'Đồ họa tích hợp', type: 'single', options: ['Có', 'Không'] },
      
    ],
  },
  mainboard: {
    label: 'Mainboard - Bo mạch chủ',
    banner: 'https://via.placeholder.com/1200x300?text=Mainboard+Collection',
    apiCategoryId: 'MAIN',
    
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['ASUS', 'MSI', 'GIGABYTE', 'ASRock'] },
      { key: 'socket', title: 'Socket', type: 'multi', options: ['LGA 1700', 'AM4', 'AM5', 'LGA 1851'] },
      { key: 'chipset', title: 'Chipset', type: 'multi', options: ['B760', 'Z790', 'B650', 'Z890'] },
      { key: 'kich_thuoc', title: 'Kích thước', type: 'multi', options: ['ATX', 'mATX', 'ITX'] },
      { key: 'kieu_ram_ho_tro', title: 'Kiểu RAM hỗ trợ', type: 'multi', options: ['DDR4', 'DDR5'] },
      { key: 'wifi', title: 'Wi-Fi', type: 'single', options: ['Có', 'Không', 'Wi-Fi 6E'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 50000000 },
    ],
  },
  ram: {
    label: 'RAM - Bộ nhớ trong',
    banner: 'https://via.placeholder.com/1200x300?text=RAM+Collection',
    apiCategoryId: 'RAM',
    quickFilters: ['DDR4', 'DDR5', '3200MHz', '5600MHz', '6000MHz', '16GB', '32GB', '64GB'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'thuong_hieu', title: 'Thương hiệu', type: 'multi', options: ['Corsair', 'G.Skill', 'Kingston', 'Team Group', 'Patriot', 'Adata'] },
      { key: 'loai_ram', title: 'Loại RAM', type: 'multi', options: ['DDR4', 'DDR5'] },
      { key: 'bus_ram', title: 'Bus RAM', type: 'multi', options: ['3200 Mhz', '3600 Mhz', '5200 Mhz', '5600 Mhz', '6000 Mhz'] },
      { key: 'dung_luong', title: 'Dung lượng', type: 'multi', options: ['8 GB', '16 GB', '32 GB', '64 GB'] },
      { key: 'so_luong_thanh', title: 'Số lượng thanh', type: 'single', options: ['1 thanh', '2 thanh'] },
      { key: 'intel_xmp', title: 'Intel XMP', type: 'single', options: ['Có', 'Không'] },
    ],
  },
  ssd: {
    label: 'SSD - Ổ cứng',
    banner: 'https://via.placeholder.com/1200x300?text=SSD+Collection',
    apiCategoryId: 'SSD',
    quickFilters: ['NVMe', 'SATA', '1TB', '2TB', 'M.2 2280', 'PCIe Gen 4'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Kingston', 'Samsung', 'WD', 'Crucial', 'Lexar'] },
      { key: 'interface', title: 'Giao tiếp', type: 'multi', options: ['NVMe PCIe Gen 3', 'NVMe PCIe Gen 4', 'SATA III'] },
      { key: 'capacity', title: 'Dung lượng', type: 'multi', options: ['250GB', '500GB', '1TB', '2TB'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 15000000 },
    ],
  },
  hdd: {
    label: 'HDD - Ổ cứng cơ',
    banner: 'https://via.placeholder.com/1200x300?text=HDD+Collection',
    apiCategoryId: null,
    quickFilters: ['1TB', '2TB', '4TB', '3.5 inch', 'NAS', '7200RPM'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Seagate', 'Western Digital', 'Toshiba', 'Kingston'] },
      { key: 'capacity', title: 'Dung lượng', type: 'multi', options: ['1TB', '2TB', '4TB', '8TB'] },
      { key: 'rpm', title: 'Tốc độ', type: 'multi', options: ['5400RPM', '7200RPM'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 10000000 },
    ],
  },
  nguon: {
    label: 'PSU - Nguồn máy tính',
    banner: 'https://via.placeholder.com/1200x300?text=PSU+Collection',
    apiCategoryId: 'PSU',
    quickFilters: ['550W', '650W', '750W', '80 Plus Bronze', '80 Plus Gold', 'Modular'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Corsair', 'Cooler Master', 'MSI', 'Thermaltake', 'Antec'] },
      { key: 'watt', title: 'Công suất', type: 'multi', options: ['550W', '650W', '750W', '850W', '1000W'] },
      { key: 'efficiency', title: 'Chứng nhận', type: 'multi', options: ['80 Plus Bronze', '80 Plus Gold', '80 Plus Platinum'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 20000000 },
    ],
  },
  vga: {
    label: 'VGA - Card màn hình',
    banner: 'https://via.placeholder.com/1200x300?text=VGA+Collection',
    apiCategoryId: 'VGA',
    quickFilters: ['RTX 3060', 'RTX 4060', 'RTX 4070', 'AMD Radeon', '8GB', '12GB', '16GB'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['ASUS', 'MSI', 'GIGABYTE', 'ZOTAC', 'Sapphire'] },
      { key: 'dong_vga', title: 'Dòng VGA', type: 'multi', options: ['NVIDIA GTX 1660 Series', 'RTX 30 Series', 'RTX 40 Series', 'RX 6000 Series', 'RX 7000 Series'] },
      { key: 'bo_nho_vram', title: 'Bộ nhớ (VRAM)', type: 'multi', options: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '24 GB'] },
      { key: 'ray_tracing', title: 'Hỗ trợ Ray Tracing', type: 'single', options: ['Có', 'Không'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 50000000 },
    ],
  },
  case: {
    label: 'Case - Vỏ máy',
    banner: 'https://via.placeholder.com/1200x300?text=Case+Collection',
    apiCategoryId: 'CASE',
    quickFilters: ['ATX', 'mATX', 'Mini Tower', 'Mid Tower', 'Tempered Glass', 'ARGB'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Cooler Master', 'NZXT', 'Lian Li', 'DeepCool', 'Xigmatek'] },
      { key: 'form', title: 'Kích thước', type: 'multi', options: ['Mini Tower', 'Mid Tower', 'Full Tower'] },
      { key: 'features', title: 'Tính năng', type: 'multi', options: ['Tempered Glass', 'ARGB', 'Airflow'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 20000000 },
    ],
  },
  monitor: {
    label: 'Màn hình (Monitor)',
    banner: 'https://via.placeholder.com/1200x300?text=Monitor+Collection',
    apiCategoryId: null,
    quickFilters: ['24 inch', '27 inch', '144Hz', '165Hz', 'IPS', 'VA', '1ms'],
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Acer', 'LG', 'Samsung', 'ASUS', 'MSI'] },
      { key: 'size', title: 'Kích thước', type: 'multi', options: ['22 inch', '24 inch', '27 inch', '32 inch'] },
      { key: 'panel', title: 'Tấm nền', type: 'multi', options: ['IPS', 'VA', 'TN'] },
      { key: 'refresh', title: 'Tần số quét', type: 'multi', options: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz'] },
    ],
  },
  mouse: {
    label: 'Chuột (Mouse)',
    banner: 'https://via.placeholder.com/1200x300?text=Mouse+Collection',
    apiCategoryId: null,
    sections: [
      { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
      { key: 'brand', title: 'Hãng', type: 'multi', options: ['Logitech', 'Razer', 'Rapoo', 'DareU', 'SteelSeries'] },
      { key: 'connect', title: 'Kết nối', type: 'multi', options: ['Có dây', 'Không dây', 'Bluetooth'] },
      { key: 'dpi', title: 'Độ nhạy', type: 'multi', options: ['800 DPI', '1600 DPI', '3200 DPI', '6400 DPI'] },
      { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 5000000 },
    ],
  },
};

const DEFAULT_CATEGORY = {
  label: 'Sản phẩm',
  banner: 'https://via.placeholder.com/1200x300?text=Product+Collection',
  apiCategoryId: null,
  quickFilters: ['Sẵn hàng', 'Giá tốt', 'Bán chạy'],
  sections: [
    { key: 'status', title: 'Tình trạng', type: 'single', options: ['Sẵn hàng', 'Hết hàng'] },
    { key: 'price', title: 'Mức giá', type: 'range', min: 0, max: 50000000 },
  ],
};

const CATEGORY_ID_TO_SLUG = {
  CPU: 'cpu',
  MAIN: 'mainboard',
  RAM: 'ram',
  VGA: 'vga',
  SSD: 'ssd',
  PSU: 'nguon',
  CASE: 'case',
};

const normalizeText = (value) => (value ?? '').toString().toLowerCase();

const normalizeImage = (value) => {
  if (!value) return 'https://via.placeholder.com/300x200';
  if (Array.isArray(value)) return value[0] || 'https://via.placeholder.com/300x200';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed[0] || 'https://via.placeholder.com/300x200';
    } catch (error) {
      return value;
    }
    return value;
  }
  return 'https://via.placeholder.com/300x200';
};

const getProductCategorySlug = (product) => {
  const rawId = normalizeText(product?.idcate || product?.IdCate).toUpperCase();
  if (CATEGORY_ID_TO_SLUG[rawId]) return CATEGORY_ID_TO_SLUG[rawId];

  const categoryName = normalizeText(product?.category_name || product?.nameCate || product?.loai || product?.category);
  if (categoryName.includes('cpu')) return 'cpu';
  if (categoryName.includes('main')) return 'mainboard';
  if (categoryName.includes('ram')) return 'ram';
  if (categoryName.includes('ssd')) return 'ssd';
  if (categoryName.includes('vga')) return 'vga';
  if (categoryName.includes('psu') || categoryName.includes('nguồn')) return 'nguon';
  if (categoryName.includes('case')) return 'case';
  if (categoryName.includes('monitor') || categoryName.includes('màn hình')) return 'monitor';
  if (categoryName.includes('mouse') || categoryName.includes('chuột')) return 'mouse';
  if (categoryName.includes('hdd')) return 'hdd';
  return '';
};

const Collections = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = (searchParams.get('category') || '').toLowerCase();
  const categoryConfig = CATEGORY_CONFIGS[categoryParam] || DEFAULT_CATEGORY;
  const categoryTitle = categoryConfig.label;
  const priceSection = categoryConfig.sections.find((section) => section.key === 'price');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filterString, setFilterString] = useState('');
  const [currentSort, setCurrentSort] = useState('Nổi bật');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'Sẵn hàng',
    minPrice: priceSection?.min ?? 0,
    maxPrice: priceSection?.max ?? 50000000,
    selectedKeywords: [],
    selectedSingles: {},
  });

  useEffect(() => {
    setSelectedFilters({
      status: 'Sẵn hàng',
      minPrice: priceSection?.min ?? 0,
      maxPrice: priceSection?.max ?? 50000000,
      selectedKeywords: [],
      selectedSingles: {},
    });
  }, [categoryParam, priceSection]);

  // Read search parameter from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setProductSearchTerm(decodeURIComponent(searchParam));
    } else {
      setProductSearchTerm('');
    }
  }, [location.search]);

  const buildFilterString = () => {
    const mergedKeywords = Array.from(
      new Set([
        ...selectedFilters.selectedKeywords,
        ...Object.values(selectedFilters.selectedSingles || {})
      ])
    );
    const parts = [];
    if (categoryParam) parts.push(`category=${categoryParam}`);
    if (productSearchTerm.trim()) parts.push(`search=${encodeURIComponent(productSearchTerm.trim())}`);
    if (selectedFilters.status && selectedFilters.status !== 'Sẵn hàng') parts.push(`status=${encodeURIComponent(selectedFilters.status)}`);
    if (selectedFilters.minPrice) parts.push(`minPrice=${Number(selectedFilters.minPrice)}`);
    if (selectedFilters.maxPrice) parts.push(`maxPrice=${Number(selectedFilters.maxPrice)}`);
    if (mergedKeywords.length) parts.push(`keywords=${mergedKeywords.map((item) => encodeURIComponent(item)).join(',')}`);
    return parts.join('|');
  };

  const buildFilterQueryString = () => {
    const params = new URLSearchParams();
    const mergedKeywords = Array.from(
      new Set([
        ...selectedFilters.selectedKeywords,
        ...Object.values(selectedFilters.selectedSingles || {})
      ])
    );

    // Category
    if (categoryParam && categoryParam !== 'all') {
      params.append('category', categoryParam);
    }

    // Search
    if (productSearchTerm.trim()) {
      params.append('search', productSearchTerm.trim());
    }

    // Status
    if (selectedFilters.status && selectedFilters.status !== 'Sẵn hàng') {
      params.append('status', selectedFilters.status);
    }

    // Price range
    if (selectedFilters.minPrice > 0) {
      params.append('minPrice', selectedFilters.minPrice.toString());
    }
    if (selectedFilters.maxPrice < (priceSection?.max ?? 50000000)) {
      params.append('maxPrice', selectedFilters.maxPrice.toString());
    }

    // Keywords
    if (mergedKeywords.length > 0) {
      params.append('keywords', mergedKeywords.join(','));
    }

    // Sort
    if (currentSort === 'Giá tăng dần') {
      params.append('sort', 'price');
      params.append('order', 'asc');
    } else if (currentSort === 'Giá giảm dần') {
      params.append('sort', 'price');
      params.append('order', 'desc');
    } else {
      params.append('sort', 'name');
      params.append('order', 'asc');
    }

    return params.toString();
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildFilterQueryString();
      const endpoint = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      const data = await res.json();

      // Since backend now handles all filtering and sorting, we just need to map the data
      const mapped = (data?.data || []).map((product, index) => ({
        id: product.idsp || product.idSP || `temp-${index}`,
        name: product.tensp || product.tenSP || product.name || 'Sản phẩm',
        image: normalizeImage(product.hinhAnh || product.hinhanh),
        priceValue: parseFloat(product.gianiemyet || product.price || 0) || 0,
        price: (parseFloat(product.gianiemyet || product.price || 0) || 0).toLocaleString('vi-VN') + 'đ',
        isActive: Number(product.quantity || product.soLuong || 0) > 0,
        isHotDeal: false,
        hasGift: false,
        category: (product.category_name || product.nameCate || product.loai || '').toString(),
        manufacturer: (product.manufacturer_name || product.tenNSX || '').toString(),
        specSummary: (() => {
          try {
            const specs = typeof product.thongsokythuat === 'string' ? JSON.parse(product.thongsokythuat) : product.thongsokythuat;
            if (!specs || typeof specs !== 'object') return '';
            return Object.entries(specs).map(([key, value]) => `${key}:${value}`).join(' ');
          } catch (error) {
            return '';
          }
        })(),
        slugCategory: getProductCategorySlug(product),
      }));

      setProducts(mapped);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(`Không thể tải danh sách sản phẩm: ${err.message}`);
      setProducts([]); // set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterKey = useMemo(() => 
    `${selectedFilters.status}-${selectedFilters.minPrice}-${selectedFilters.maxPrice}-${selectedFilters.selectedKeywords.join(',')}-${JSON.stringify(selectedFilters.selectedSingles || {})}`,
    [selectedFilters]
  );

  useEffect(() => {
    loadProducts();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      // ignore
    }
  }, [categoryParam, productSearchTerm, filterKey, currentSort]);

  useEffect(() => {
    setFilterString(buildFilterString());
  }, [categoryParam, productSearchTerm, selectedFilters]);

  const visibleProducts = products;

  const toggleKeyword = (value) => {
    setSelectedFilters((prev) => {
      const exists = prev.selectedKeywords.includes(value);
      return {
        ...prev,
        selectedKeywords: exists
          ? prev.selectedKeywords.filter((item) => item !== value)
          : [...prev.selectedKeywords, value]
      };
    });
  };

  const toggleStatus = (value) => {
    setSelectedFilters((prev) => ({ ...prev, status: value }));
  };

  const toggleSingleSectionOption = (sectionKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev.selectedSingles?.[sectionKey];
      const nextSingles = { ...(prev.selectedSingles || {}) };
      let nextKeywords = [...prev.selectedKeywords];

      if (current) {
        nextKeywords = nextKeywords.filter((item) => item !== current);
      }

      if (current === value) {
        delete nextSingles[sectionKey];
      } else {
        nextSingles[sectionKey] = value;
        nextKeywords.push(value);
      }

      return {
        ...prev,
        selectedSingles: nextSingles,
        selectedKeywords: Array.from(new Set(nextKeywords)),
      };
    });
  };

  const onSortChange = (sortOption) => {
    setCurrentSort(sortOption);
  };

  const resetFilterModal = () => {
    setSelectedFilters({
      status: 'Sẵn hàng',
      minPrice: priceSection?.min ?? 0,
      maxPrice: priceSection?.max ?? 50000000,
      selectedKeywords: [],
      selectedSingles: {},
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <a href="/" className="flex items-center gap-1 text-blue-600 hover:underline">
            <Home className="h-4 w-4" /> Trang chủ
          </a>
          <span>/</span>
          <span className="text-gray-700">{categoryTitle}</span>
        </nav>

        <div className="mb-5 overflow-hidden rounded-xl shadow-sm">
          <img src={categoryConfig.banner} alt={categoryTitle} className="aspect-[6/1] h-auto w-full object-cover" />
        </div>

        
        <div className="mb-5">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl border border-gray-300 px-4 py-3 shadow-sm hover:border-blue-500 transition-colors">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setProductSearchTerm(productSearchTerm)}
                placeholder={`Tìm kiếm trong ${categoryTitle.toLowerCase()}...`}
                className="flex-1 bg-transparent border-none outline-none text-gray-700"
              />
            </div>
            <button
              onClick={() => setProductSearchTerm(productSearchTerm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Tìm
            </button>
          </div>
          {productSearchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Kết quả tìm kiếm cho: <strong className="text-blue-600">"{productSearchTerm}"</strong>
            </p>
          )}
        </div>

        <FilterBar
          currentSort={currentSort}
          onSortChange={onSortChange}
          onFilterClick={() => setIsFilterModalOpen(true)}
        />

        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Bộ lọc đang dùng:</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Tình trạng: {selectedFilters.status}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Giá: {selectedFilters.minPrice.toLocaleString('vi-VN')}đ - {selectedFilters.maxPrice.toLocaleString('vi-VN')}đ
            </span>
            {[...selectedFilters.selectedKeywords, ...Object.values(selectedFilters.selectedSingles || {})].length > 0 && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                Từ khóa: {Array.from(new Set([...selectedFilters.selectedKeywords, ...Object.values(selectedFilters.selectedSingles || {})])).join(', ')}
              </span>
            )}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              placeholder={`Tìm trong ${categoryTitle.toLowerCase()}`}
            />
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="rounded-xl border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Mở bộ lọc riêng
            </button>
          </div>
          {filterString && <div className="mt-3 break-all rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">{filterString}</div>}
        </div>

        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-6" onClick={() => setIsFilterModalOpen(false)}>
            <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Bộ lọc riêng cho {categoryTitle}</h2>
                  <p className="text-sm text-gray-500">Mỗi danh mục có bộ lọc riêng, và danh sách sẽ tự gọi API theo danh mục đó.</p>
                </div>
                <button onClick={() => setIsFilterModalOpen(false)} className="rounded-full p-2 text-gray-500 transition hover:text-gray-900">✕</button>
              </div>

              <div className="grid gap-6 border-b border-gray-200 px-6 py-5 lg:grid-cols-3">
                {categoryConfig.sections.map((section) => {
                  if (section.type === 'range' && section.key === 'price') {
                    return (
                      <div key={section.key} className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Giá từ"
                              value={selectedFilters.minPrice}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setSelectedFilters((prev) => ({
                                  ...prev,
                                  minPrice: Math.max(section.min ?? 0, Math.min(value, prev.maxPrice - 1))
                                }));
                              }}
                              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                            />
                            <input
                              type="number"
                              placeholder="Giá đến"
                              value={selectedFilters.maxPrice}
                              onChange={(e) => {
                                const value = Number(e.target.value) || (section.max ?? 50000000);
                                setSelectedFilters((prev) => ({
                                  ...prev,
                                  maxPrice: Math.min(section.max ?? 50000000, Math.max(prev.minPrice + 1, value))
                                }));
                              }}
                              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'single') {
                    return (
                      <div key={section.key} className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          {section.options.map((option) => {
                            const isStatusSection = section.key === 'status';
                            const active = isStatusSection
                              ? selectedFilters.status === option
                              : selectedFilters.selectedSingles?.[section.key] === option;

                            return (
                              <button
                                key={option}
                                onClick={() => (isStatusSection ? toggleStatus(option) : toggleSingleSectionOption(section.key, option))}
                                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                  active
                                    ? 'border-red-500 bg-red-50 text-red-600'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'multi') {
                    return (
                      <div key={section.key} className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {section.options.map((option) => {
                            const active = selectedFilters.selectedKeywords.includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => toggleKeyword(option)}
                                className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                                  active
                                    ? 'border-red-500 bg-red-50 text-red-600'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              <div className="flex flex-col gap-3 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={resetFilterModal}
                  className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
                >
                  Bỏ chọn
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="aspect-square bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-auto h-6 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">Không có sản phẩm nào phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 ${
                  product.isActive ? 'border-2 border-red-500 shadow-md' : 'border border-gray-200 hover:border-blue-500 hover:shadow-lg'
                }`}
              >
                <div className="relative flex aspect-square items-center justify-center bg-white p-4">
                  {product.isHotDeal && (
                    <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                      <Flame className="h-3 w-3 fill-current" /> HOT DEAL
                    </div>
                  )}

                  {product.hasGift && (
                    <div className="absolute right-2 top-2 z-10 text-red-500">
                      <Gift className="h-5 w-5" />
                    </div>
                  )}

                  <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="flex flex-grow flex-col p-4 pt-0">
                  <h3 className="min-h-[40px] text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-2">{product.name}</h3>
                  <div className="mt-auto pt-3">
                    <strong className="text-base text-red-600">{product.price}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;