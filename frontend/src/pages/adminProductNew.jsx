import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Upload, Link2, X, Save, ImagePlus, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Category-specific specs templates
const SPECS_TEMPLATES = {
  CPU: [
    { key: 'dòng_cpu', label: 'Dòng CPU', type: 'text' },
    { key: 'thế_hệ', label: 'Thế hệ', type: 'text' },
    { key: 'kiến_trúc', label: 'Kiến trúc', type: 'text' },
    { key: 'socket', label: 'Socket', type: 'text' },
    { key: 'platform', label: 'Platform', type: 'text' },
    { key: 'l1_cache', label: 'L1 Cache', type: 'text' },
    { key: 'l2_cache', label: 'L2 Cache', type: 'text' },
    { key: 'số_nhân', label: 'Số nhân', type: 'text' },
    { key: 'số_luồng', label: 'Số luồng', type: 'text' },
    { key: 'base_clock', label: 'Base Clock (GHz)', type: 'number' },
    { key: 'turbo_clock', label: 'Turbo Clock (GHz)', type: 'number' },
    { key: 'tdp', label: 'TDP (W)', type: 'number' },
    { key: 'tdp_max', label: 'TDP Max (W)', type: 'number' },
  ],
  MAIN: [
    { key: 'chipset', label: 'Chipset', type: 'text' },
    { key: 'socket', label: 'Socket', type: 'text' },
    { key: 'kích_thước', label: 'Kích thước', type: 'text' },
    { key: 'kiểu_ram', label: 'Kiểu RAM', type: 'text' },
    { key: 'num_sata', label: 'Số cổng SATA', type: 'number' },
    { key: 'num_m2_slots', label: 'Số khe M.2', type: 'number' },
    { key: 'pcie_generation', label: 'PCIe Gen (tách bằng dấu phẩy)', type: 'text' },
    { key: 'vrm_phase', label: 'VRM Phase', type: 'text' },
    { key: 'wifi', label: 'Wi-Fi', type: 'text' },
    { key: 'bluetooth', label: 'Bluetooth', type: 'text' },
    { key: 'usb_ports', label: 'Số cổng USB', type: 'number' },
    { key: 'max_ram_capacity', label: 'RAM Max (GB)', type: 'number' },
    { key: 'max_ram_slots', label: 'Khe RAM Max', type: 'number' },
  ],
  RAM: [
    { key: 'thương_hiệu', label: 'Thương hiệu', type: 'text' },
    { key: 'loại_ram', label: 'Loại RAM', type: 'text' },
    { key: 'bus_ram', label: 'Bus RAM (MHz)', type: 'number' },
    { key: 'dung_lượng', label: 'Dung lượng (GB)', type: 'number' },
    { key: 'cas_latency', label: 'CAS Latency', type: 'text' },
    { key: 'form_factor', label: 'Form Factor', type: 'text' },
    { key: 'ecc', label: 'ECC', type: 'text' },
    { key: 'num_sticks', label: 'Số thanh', type: 'number' },
    { key: 'num_channels', label: 'Số kênh', type: 'number' },
    { key: 'rgb_led', label: 'RGB LED', type: 'text' },
    { key: 'điện_áp', label: 'Điện áp (V)', type: 'number' },
  ],
  SSD: [
    { key: 'thương_hiệu', label: 'Thương hiệu', type: 'text' },
    { key: 'dung_lượng', label: 'Dung lượng (GB)', type: 'number' },
    { key: 'loại_ssd', label: 'Loại SSD', type: 'text' },
    { key: 'form_factor', label: 'Form Factor', type: 'text' },
    { key: 'giao_tiếp', label: 'Giao tiếp', type: 'text' },
    { key: 'tốc_độ_đọc', label: 'Tốc độ đọc (MB/s)', type: 'number' },
    { key: 'tốc_độ_ghi', label: 'Tốc độ ghi (MB/s)', type: 'number' },
    { key: 'loại_chip_nhớ', label: 'Loại chip nhớ', type: 'text' },
    { key: 'mtbf', label: 'MTBF (giờ)', type: 'text' },
    { key: 'tbw', label: 'TBW (TB)', type: 'text' },
  ],
  VGA: [
    { key: 'thương_hiệu', label: 'Thương hiệu', type: 'text' },
    { key: 'dòng_vga', label: 'Dòng VGA', type: 'text' },
    { key: 'cuda_cores', label: 'CUDA Cores', type: 'text' },
    { key: 'gpu_base_clock', label: 'GPU Base Clock (MHz)', type: 'number' },
    { key: 'gpu_boost_clock', label: 'GPU Boost Clock (MHz)', type: 'number' },
    { key: 'vram', label: 'VRAM (GB)', type: 'number' },
    { key: 'bus_memory', label: 'Memory Bus', type: 'text' },
    { key: 'memory_type', label: 'Memory Type', type: 'text' },
    { key: 'giao_tiếp', label: 'Giao tiếp', type: 'text' },
    { key: 'num_fans', label: 'Số quạt', type: 'number' },
    { key: 'tdp', label: 'TDP (W)', type: 'number' },
    { key: 'power_connector', label: 'Power Connector', type: 'text' },
    { key: 'dlss_support', label: 'DLSS Support', type: 'text' },
    { key: 'ray_tracing', label: 'Ray Tracing', type: 'text' },
  ],
  PSU: [
    { key: 'thương_hiệu', label: 'Thương hiệu', type: 'text' },
    { key: 'công_suất', label: 'Công suất (W)', type: 'number' },
    { key: 'chứng_nhận', label: 'Chứng nhận', type: 'text' },
    { key: 'hiệu_suất', label: 'Hiệu suất (%)', type: 'number' },
    { key: 'chuẩn', label: 'Chuẩn', type: 'text' },
    { key: 'modular', label: 'Modular', type: 'text' },
    { key: 'kiểu_rail', label: 'Kiểu Rail', type: 'text' },
    { key: 'dạng_dây', label: 'Dạng dây', type: 'text' },
    { key: 'kích_thước_quạt', label: 'Kích thước quạt (mm)', type: 'text' },
    { key: 'màu_sắc', label: 'Màu sắc', type: 'text' },
  ],
  CASE: [
    { key: 'loại', label: 'Loại', type: 'text' },
    { key: 'form_factor', label: 'Form Factor', type: 'text' },
    { key: 'hỗ_trợ_bo_mạch', label: 'Hỗ trợ bo mạch (tách bằng dấu phẩy)', type: 'text' },
    { key: 'khe_ổ_đĩa_35', label: 'Khe ổ đĩa 3.5"', type: 'number' },
    { key: 'khe_ổ_đĩa_25', label: 'Khe ổ đĩa 2.5"', type: 'number' },
    { key: 'quạt_trước', label: 'Quạt trước', type: 'text' },
    { key: 'quạt_sau', label: 'Quạt sau', type: 'text' },
    { key: 'khe_mở_rộng', label: 'Khe mở rộng', type: 'number' },
    { key: 'hỗ_trợ_vga_tối_đa', label: 'Hỗ trợ VGA tối đa (mm)', type: 'text' },
    { key: 'dung_tích', label: 'Dung tích (L)', type: 'number' },
    { key: 'vật_liệu', label: 'Vật liệu', type: 'text' },
  ],
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error(`Không thể đọc file ${file.name}`));
  reader.readAsDataURL(file);
});

const normalizeImages = (product) => {
  const rawImages = product?.hinhAnh ?? product?.hinhanh ?? [];
  if (Array.isArray(rawImages)) return rawImages;
  if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      return Array.isArray(parsed) ? parsed : [rawImages];
    } catch {
      return [rawImages];
    }
  }
  return rawImages ? [rawImages] : [];
};

const normalizeSpecsText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
};

const SpecsPreview = ({ specs }) => {
  try {
    const parsed = typeof specs === 'string' ? JSON.parse(specs) : specs;
    if (!parsed || Object.keys(parsed).length === 0) {
      return <div className="text-xs text-slate-500">Không có thông số nào</div>;
    }
    return (
      <div className="space-y-2">
        {Object.entries(parsed).map(([key, value]) => (
          <div key={key} className="border-b border-slate-100 pb-2 last:border-0">
            <p className="text-xs font-semibold text-slate-700 capitalize">{key.replace(/_/g, ' ')}</p>
            <p className="text-xs text-slate-600 mt-1">
              {Array.isArray(value) ? value.join(', ') : String(value)}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    return <div className="text-xs text-red-600">Lỗi JSON: {e.message}</div>;
  }
};

const AdminProductNew = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [imageLinkInput, setImageLinkInput] = useState('');
  const [imageSources, setImageSources] = useState([]);
  const [specText, setSpecText] = useState('');

  const [formData, setFormData] = useState({
    idSP: '',
    tenSP: '',
    IdCate: '',
    IdNSX: '',
    chiTietSP: '',
    gianiemyet: '',
    soLuong: '',
    tinhTrang: 'Mới',
    baoHanh: '12 tháng',
    giaKM: '',
  });

  const authToken = localStorage.getItem('authToken');
  const authHeaders = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  };

  const isEditMode = Boolean(productId);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        setLoadingLookups(true);
        setError('');
        const [categoriesRes, manufacturersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`),
          fetch(`${API_BASE_URL}/api/manufacturers`)
        ]);

        const categoriesData = await categoriesRes.json();
        const manufacturersData = await manufacturersRes.json();

        setCategories(categoriesData?.data || []);
        setManufacturers(manufacturersData?.data || []);
      } catch (lookupError) {
        console.error('Lỗi tải dữ liệu phân loại:', lookupError);
        setError('Không thể tải danh mục hoặc nhà sản xuất từ database.');
      } finally {
        setLoadingLookups(false);
      }
    };

    loadLookups();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const loadProduct = async () => {
      try {
        setLoadingLookups(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Không thể tải thông tin sản phẩm.');
          return;
        }

        const product = data?.data || {};
        setFormData({
          idSP: product.idsp || product.idSP || '',
          tenSP: product.tensp || product.tenSP || '',
          IdCate: product.idcate || product.IdCate || '',
          IdNSX: product.idnsx || product.IdNSX || '',
          chiTietSP: product.chitietsp || product.chiTietSP || '',
          gianiemyet: product.gianiemyet || '',
          soLuong: product.quantity ?? product.soluong ?? product.soLuong ?? '',
          tinhTrang: product.tinhtrang || product.tinhTrang || 'Mới',
          baoHanh: product.baohanh || product.baoHanh || '12 tháng',
          giaKM: product.giakm || product.giaKM || '',
        });
        setImageSources(normalizeImages(product));
        setSpecText(normalizeSpecsText(product.thongsokythuat));
      } catch (loadError) {
        console.error('Lỗi tải thông tin sản phẩm:', loadError);
        setError('Không thể tải thông tin sản phẩm để chỉnh sửa.');
      } finally {
        setLoadingLookups(false);
      }
    };

    loadProduct();
  }, [isEditMode, productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addImageLinksFromInput = () => {
    const links = imageLinkInput
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (links.length === 0) {
      return;
    }

    setImageSources((prev) => [...prev, ...links]);
    setImageLinkInput('');
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));
      setImageSources((prev) => [...prev, ...dataUrls]);
    } catch (fileError) {
      console.error(fileError);
      setError(fileError.message || 'Không thể đọc file ảnh.');
    } finally {
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setImageSources((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.idSP.trim() || !formData.tenSP.trim() || !formData.IdCate || !formData.IdNSX) {
      setError('Vui lòng nhập đầy đủ mã sản phẩm, tên, danh mục và nhà sản xuất.');
      return;
    }

    if (formData.soLuong === '' || Number.isNaN(Number(formData.soLuong)) || Number(formData.soLuong) < 0) {
      setError('Vui lòng nhập số lượng tồn hợp lệ.');
      return;
    }

    if (imageSources.length === 0) {
      setError('Hãy thêm ít nhất một ảnh bằng link hoặc chọn tệp.');
      return;
    }

    let parsedSpecs = null;
    if (specText.trim()) {
      try {
        parsedSpecs = JSON.parse(specText);
      } catch (specError) {
        setError('Thông số kỹ thuật phải là JSON hợp lệ.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const endpoint = isEditMode ? `${API_BASE_URL}/api/products/${productId}` : `${API_BASE_URL}/api/products`;
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        gianiemyet: Number(formData.gianiemyet || 0),
        giaKM: Number(formData.giaKM || 0),
        soLuong: Number(formData.soLuong || 0),
        hinhAnh: imageSources,
        thongsokythuat: parsedSpecs
      };

      const response = await fetch(endpoint, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Không thể tạo sản phẩm.');
        return;
      }

      addToast(isEditMode ? 'Đã cập nhật sản phẩm thành công.' : 'Đã tạo sản phẩm mới thành công.', 'success', 2000);
      navigate('/admin');
    } catch (submitError) {
      console.error('Lỗi tạo sản phẩm:', submitError);
      setError('Không thể tạo sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map((item) => ({
    value: item.IdCate || item.idcate,
    label: item.nameCate || item.namecate || item.IdCate || item.idcate
  }));

  const manufacturerOptions = manufacturers.map((item) => ({
    value: item.IdNSX || item.idnsx,
    label: item.TenNSX || item.tennsx || item.IdNSX || item.idnsx
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> Quay lại admin
          </button>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-900">{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 bg-slate-950 px-6 py-5 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">SanPham</p>
            <h2 className="mt-2 text-3xl font-semibold">{isEditMode ? 'Chỉnh sửa dữ liệu giống database' : 'Nhập dữ liệu giống database'}</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Chọn danh mục để khung nhập thông số kỹ thuật riêng. Hỗ trợ nhập JSON tùy chỉnh cho các danh mục con.
              Ảnh & thông số được lưu tùy theo cấu trúc cho từng category trong PostgreSQL.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Thông tin sản phẩm</h3>
                    <p className="text-sm text-slate-500">Mỗi trường tương ứng với cột trong database.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Mã sản phẩm</span>
                    <input
                      name="idSP"
                      value={formData.idSP}
                      onChange={handleChange}
                      readOnly={isEditMode}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 read-only:bg-slate-100"
                      placeholder="VD: CPU-001"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Tên sản phẩm</span>
                    <input name="tenSP" value={formData.tenSP} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Tên sản phẩm" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Danh mục</span>
                    <select name="IdCate" value={formData.IdCate} onChange={handleChange} disabled={loadingLookups} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
                      <option value="">{loadingLookups ? 'Đang tải danh mục...' : 'Chọn danh mục'}</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Nhà sản xuất</span>
                    <select name="IdNSX" value={formData.IdNSX} onChange={handleChange} disabled={loadingLookups} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
                      <option value="">{loadingLookups ? 'Đang tải nhà sản xuất...' : 'Chọn nhà sản xuất'}</option>
                      {manufacturerOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Giá niêm yết</span>
                    <input name="gianiemyet" type="number" min="0" value={formData.gianiemyet} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="0" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Giá khuyến mãi</span>
                    <input name="giaKM" type="number" min="0" value={formData.giaKM} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="0" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Số lượng tồn</span>
                    <input name="soLuong" type="number" min="0" value={formData.soLuong} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="0" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Bảo hành</span>
                    <input name="baoHanh" value={formData.baoHanh} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="VD: 12 tháng" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Tình trạng</span>
                    <select name="tinhTrang" value={formData.tinhTrang} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500">
                      <option value="Mới">Mới</option>
                      <option value="Cũ">Cũ</option>
                      <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                    </select>
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Chi tiết sản phẩm</span>
                  <textarea
                    name="chiTietSP"
                    value={formData.chiTietSP}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    placeholder="Mô tả ngắn gọn hoặc chi tiết sản phẩm"
                  />
                </label>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <ImagePlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Ảnh sản phẩm</h3>
                    <p className="text-sm text-slate-500">Chọn tệp hoặc dán link. Dữ liệu sẽ được lưu dưới dạng mảng URL trong PostgreSQL.</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <span className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"><Link2 size={16} /> Gắn link ảnh</span>
                    <textarea
                      value={imageLinkInput}
                      onChange={(event) => setImageLinkInput(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                      placeholder="Mỗi dòng 1 link, hoặc ngăn cách bằng dấu phẩy"
                    />
                    <button type="button" onClick={addImageLinksFromInput} className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                      <Plus size={16} /> Thêm link
                    </button>
                  </label>

                  <label className="flex cursor-pointer flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div>
                      <span className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700"><Upload size={16} /> Chọn tệp ảnh</span>
                      <p className="text-sm text-slate-500">Ảnh chọn từ máy sẽ được chuyển thành chuỗi dữ liệu để lưu thẳng vào database.</p>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
                  </label>
                </div>

                {imageSources.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {imageSources.map((source, index) => (
                      <div key={`${source.slice(0, 24)}-${index}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <img src={source} alt={`Ảnh ${index + 1}`} className="h-40 w-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-90 transition hover:bg-black">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Chưa có ảnh nào được thêm.
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                    <Save size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Thông số kỹ thuật</h3>
                    <p className="text-sm text-slate-500">Chọn danh mục để xem form riêng, hoặc nhập JSON tùy chỉnh cho các danh mục phụ.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">JSON Tùy chỉnh</label>
                    <textarea
                      value={specText}
                      onChange={(event) => setSpecText(event.target.value)}
                      rows={8}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs outline-none focus:border-blue-500"
                      placeholder='{
  "dòng_cpu": "Core i5",
  "socket": "LGA 1700",
  "num_nhân": "6 cores"
}'
                    />
                  </div>

                  {/* Preview */}
                  {specText.trim() && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 max-h-80 overflow-y-auto">
                      <p className="mb-3 text-sm font-medium text-slate-700">Xem trước thông số</p>
                      <SpecsPreview specs={specText} />
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Preview</p>
                <h3 className="mt-2 text-2xl font-semibold">Kiểm tra trước khi lưu</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-4"><span>Mã SP</span><span className="font-medium text-white">{formData.idSP || '-'}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Tên SP</span><span className="font-medium text-white">{formData.tenSP || '-'}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Danh mục</span><span className="font-medium text-white">{categoryOptions.find((item) => item.value === formData.IdCate)?.label || '-'}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>NSX</span><span className="font-medium text-white">{manufacturerOptions.find((item) => item.value === formData.IdNSX)?.label || '-'}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Số lượng</span><span className="font-medium text-white">{formData.soLuong || 0}</span></div>
                  <div className="flex items-center justify-between gap-4"><span>Số ảnh</span><span className="font-medium text-white">{imageSources.length}</span></div>
                </div>
              </div>

              {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || loadingLookups}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {submitting ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Lưu sản phẩm mới'}
              </button>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Ghi chú</p>
                <ul className="mt-3 space-y-2">
                  <li>• Danh mục và nhà sản xuất được đọc từ database.</li>
                  <li>• Ảnh có thể nhập bằng link hoặc tệp.</li>
                  <li>• Thông số kỹ thuật sẽ được tách theo category sau khi bạn gửi cấu trúc.</li>
                </ul>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductNew;