import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  ClipboardList,
  Box,
  BarChart3,
  CheckCircle2,
  RefreshCcw,
  AlertCircle,
  Search,
  Bell,
  Globe,
  ChevronDown,
  TrendingUp,
  Plus,
  Edit2,
  Eye,
  Trash2,
  X,
  KeyRound
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const tabs = ['Dashboard', 'Products', 'Inventory', 'Users', 'Stats'];

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSubCategoryFilter, setProductSubCategoryFilter] = useState('all');
  const [productThirdCategoryFilter, setProductThirdCategoryFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Order-related state variables
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const authToken = localStorage.getItem('authToken');

  const authHeaders = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    return headers;
  }, [authToken]);

  // Order-related constants and functions
  const orderStatusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã giao' },
    { value: 'delivered', label: 'Đã nhận' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getOrderStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đã giao',
      'delivered': 'Đã nhận',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status || 'Không xác định';
  };

  const getOrderStatusBadge = (status) => {
    const badgeMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return badgeMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchTerm = orderSearchTerm.toLowerCase();
      const statusMatch = orderStatusFilter === 'all' || (order.orderStatus || order.status) === orderStatusFilter;
      const searchMatch = !searchTerm ||
        (order.orderId || order.id || '').toString().toLowerCase().includes(searchTerm) ||
        (order.name || order.tenKH || '').toLowerCase().includes(searchTerm) ||
        (order.phoneNumber || order.phone_number || order.sdt || '').toLowerCase().includes(searchTerm);

      return statusMatch && searchMatch;
    });
  }, [orders, orderSearchTerm, orderStatusFilter]);

  const handleOrderStatusFilterChange = (value) => {
    setOrderStatusFilter(value);
  };

  const handleViewOrder = (orderId) => {
    const order = orders.find(o => (o.orderId || o.id) === orderId);
    if (order) {
      setSelectedOrderDetail(order);
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      // TODO: Implement delete order API call
      addToast('Tính năng xóa đơn hàng chưa được triển khai', 'warning');
    }
  };

  const productCategoryOptions = useMemo(() => {
    const categories = new Set(products.map((product) => product.category_name || product.nameCate || 'Chưa phân loại'));
    return [
      { value: 'all', label: 'Tất cả danh mục' },
      ...Array.from(categories)
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((category) => ({ value: category, label: category }))
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const normalizedSearch = productSearchTerm.trim().toLowerCase();
      const id = (product.idSP || product.idsp || '').toString().toLowerCase();
      const name = (product.tenSP || product.tensp || '').toString().toLowerCase();
      const category = (product.category_name || product.nameCate || '').toString().toLowerCase();
      const manufacturer = (product.manufacturer_name || product.TenNSX || '').toString().toLowerCase();

      const matchesSearch = normalizedSearch === ''
        || id.includes(normalizedSearch)
        || name.includes(normalizedSearch)
        || category.includes(normalizedSearch)
        || manufacturer.includes(normalizedSearch);

      const matchesCategory = productCategoryFilter === 'all'
        || (product.category_name || product.nameCate || '').toString() === productCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, productSearchTerm, productCategoryFilter]);

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (!authUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(authUser);
    if (!parsedUser.roles || (parsedUser.roles !== 'admin' && parsedUser.roles !== 'ADMIN')) {
      navigate('/');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
    loadProducts(); // Load products always for admin
    if (activeTab === 'Inventory') loadInventory();
    if (activeTab === 'Users') {
      loadUsers();
      loadRoles();
    }
  }, [user, activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [productResp, inventoryResp, userResp] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products/stats`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/inventory/stats`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/admin/stats`, { headers: authHeaders })
      ]);

      const productData = await productResp.json();
      const inventoryData = await inventoryResp.json();
      const userData = await userResp.json();

      setStats({
        products: productData?.data || {},
        inventory: inventoryData?.data || {},
        users: userData?.data || {}
      });
    } catch (err) {
      console.error('Load dashboard failed', err);
      setError('Không thể tải dữ liệu tổng quan.');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`, { headers: authHeaders });
      const data = await res.json();
      setProducts(data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/inventory`, { headers: authHeaders });
      const data = await res.json();
      setInventory(data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, { headers: authHeaders });
      const data = await res.json();
      setUsers(data?.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/roles`, { headers: authHeaders });
      const data = await res.json();
      setRoles(data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshCurrentTab = () => {
    setError('');
    if (activeTab === 'Products') loadProducts();
    if (activeTab === 'Inventory') loadInventory();
    if (activeTab === 'Users') loadUsers();
    if (activeTab === 'Dashboard') loadDashboard();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể xóa sản phẩm.');
        return;
      }
      addToast('Sản phẩm đã được chuyển sang trạng thái ngừng kinh doanh.', 'success', 2000);
      loadProducts();
    } catch (err) {
      console.error(err);
      setError('Lỗi khi xóa sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleViewProduct = (productId) => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, { headers: authHeaders });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Không thể tải chi tiết sản phẩm.');
          return;
        }
        setSelectedProductDetail(data?.data || null);
      } catch (err) {
        console.error(err);
        setError('Lỗi khi tải chi tiết sản phẩm.');
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length && selectedProducts.size > 0) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.idsp || p.idSP)));
    }
  };

  const handleUpdateProductQuantity = async (productId) => {
    const quantityText = window.prompt('Nhập số lượng tồn mới cho sản phẩm:');
    if (quantityText === null) return;

    const quantity = Number(quantityText);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError('Số lượng phải là số nguyên không âm.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/inventory/product/${productId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ soLuongTon: quantity, soLuongNhap: 0, soLuongXuat: 0 })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể cập nhật số lượng.');
        return;
      }
      addToast('Số lượng tồn kho đã được cập nhật.', 'success', 2000);
      loadProducts();
    } catch (err) {
      console.error(err);
      setError('Lỗi khi cập nhật số lượng.');
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryAction = async (productId, quantity, action) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/inventory/product/${productId}/${action}-stock`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ quantity: Number(quantity) || 0 })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể cập nhật tồn kho.');
        return;
      }
      addToast('Tồn kho đã được cập nhật.', 'success', 2000);
      loadInventory();
    } catch (err) {
      console.error(err);
      setError('Lỗi khi cập nhật tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserRole = async (userItem, newRoleId) => {
    try {
      setLoading(true);
      const payload = { roles: newRoleId };
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userItem.idusers || userItem.idUsers}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể cập nhật vai trò.');
        return;
      }
      addToast('Vai trò người dùng đã được cập nhật.', 'success', 2000);
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Lỗi khi cập nhật vai trò người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userItem) => {
    const currentStatus = userItem.tinhtrang || userItem.tinhTrang || 'Hoat dong';
    const newStatus = currentStatus === 'Hoat dong' ? 'Khong hoat dong' : 'Hoat dong';

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userItem.idusers || userItem.idUsers}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ tinhtrang: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể đổi trạng thái user.');
        return;
      }
      addToast('Trạng thái người dùng đã được cập nhật.', 'success', 2000);
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Lỗi khi đổi trạng thái người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserPassword = async (userItem) => {
    const newPassword = window.prompt(`Nhập mật khẩu mới cho user ${userItem.username || userItem.userName}:`);
    if (newPassword === null) return;
    if (newPassword.trim().length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userItem.idusers || userItem.idUsers}/password`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Không thể đổi mật khẩu user.');
        return;
      }
      addToast('Đổi mật khẩu người dùng thành công.', 'success', 2000);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi đổi mật khẩu user.');
    } finally {
      setLoading(false);
    }
  };

  const productCards = (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sản phẩm</p>
            <h2 className="text-2xl font-semibold text-slate-900">Danh sách sản phẩm</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleAddProduct} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              <Plus size={16} /> Thêm sản phẩm mới
            </button>
            <button onClick={loadProducts} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800">
              <RefreshCcw size={18} /> Làm mới
            </button>
          </div>
        </div>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Category By</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
            >
              {productCategoryOptions.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Sub Category By</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              value={productSubCategoryFilter}
              onChange={(e) => setProductSubCategoryFilter(e.target.value)}
              disabled
            >
              <option value="all">Tất cả danh mục con</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Third Level Sub Category By</label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              value={productThirdCategoryFilter}
              onChange={(e) => setProductThirdCategoryFilter(e.target.value)}
              disabled
            >
              <option value="all">Tất cả danh mục cấp 3</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">Tìm kiếm sản phẩm</label>
          <input
            type="text"
            placeholder="Tìm theo mã, tên, danh mục hoặc nhà sản xuất"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-auto rounded-3xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAllProducts}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">PRODUCT</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">SUB CATEGORY</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">SALES</th>
                <th className="px-4 py-3">STOCK</th>
                <th className="px-4 py-3">RATING</th>
                <th className="px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-slate-500">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const productId = product.idsp || product.idSP;
                  const quantity = product.quantity ?? product.soLuongTon ?? product.soluongton ?? product.soluong ?? product.soLuong ?? 0;
                  const price = product.gianiemyet ? `${product.gianiemyet.toLocaleString()}₫` : 'Chưa có';
                  const rawImages = product.hinhAnh ?? product.hinhanh;
                  const imageUrl = Array.isArray(rawImages) ? rawImages[0] : rawImages;
                  return (
                    <tr key={productId} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(productId)}
                          onChange={() => handleSelectProduct(productId)}
                          className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.tensp || product.tenSP || 'Sản phẩm'}
                              className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500 flex-shrink-0">No Img</div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{product.tensp || product.tenSP}</div>
                            <div className="text-xs text-slate-500 truncate">{product.manufacturer_name || product.TenNSX || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{product.category_name || product.nameCate || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">-</td>
                      <td className="px-4 py-3 text-slate-700 font-semibold">{price}</td>
                      <td className="px-4 py-3 text-slate-700">0</td>
                      <td className="px-4 py-3 text-slate-700">{quantity}</td>
                      <td className="px-4 py-3 text-slate-700">★ 0</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditProduct(productId)} title="Chỉnh sửa" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-100">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleViewProduct(productId)} title="Xem" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-100">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDeleteProduct(productId)} title="Ngừng kinh doanh" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const inventorySection = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tồn kho</p>
            <h2 className="text-2xl font-semibold text-slate-900">Quản lý kho</h2>
          </div>
          <button onClick={refreshCurrentTab} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800">
            <RefreshCcw size={18} /> Làm mới
          </button>
        </div>
        <div className="overflow-auto rounded-3xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Tồn</th>
                <th className="px-4 py-3">Nhập</th>
                <th className="px-4 py-3">Xuất</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.idsp || item.idSP || item.idSP} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">{item.product_name}</td>
                  <td className="px-4 py-3">{item.solongton || item.soLuongTon}</td>
                  <td className="px-4 py-3">{item.solongnhap || item.soLuongNhap}</td>
                  <td className="px-4 py-3">{item.solongxuat || item.soLuongXuat}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => handleInventoryAction(item.idsp || item.idSP, 10, 'add')} className="rounded-lg bg-green-600 px-3 py-2 text-white text-xs hover:bg-green-700">+10</button>
                    <button onClick={() => handleInventoryAction(item.idsp || item.idSP, 10, 'remove')} className="rounded-lg bg-red-600 px-3 py-2 text-white text-xs hover:bg-red-700">-10</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const usersSection = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Người dùng</p>
            <h2 className="text-2xl font-semibold text-slate-900">Quản lý users/roles</h2>
          </div>
          <button onClick={refreshCurrentTab} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800">
            <RefreshCcw size={18} /> Làm mới
          </button>
        </div>
        <div className="overflow-auto rounded-3xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">ID User</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.idusers || userItem.idUsers} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">{userItem.idusers || userItem.idUsers}</td>
                  <td className="px-4 py-3">{userItem.username || userItem.userName}</td>
                  <td className="px-4 py-3">{userItem.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={userItem.roles || 'customer'}
                      onChange={(e) => handleChangeUserRole(userItem, e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                    >
                      {roles.map((role) => (
                        <option key={role.idvt || role.idVT} value={role.idvt || role.idVT}>
                          {role.tenvt || role.tenVT || role.idvt || role.idVT}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{userItem.tinhtrang || userItem.tinhTrang}</td>
                  <td className="px-4 py-3">{userItem.ngaytao ? new Date(userItem.ngaytao).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => handleToggleUserStatus(userItem)} className="rounded-lg bg-blue-600 px-3 py-2 text-white text-xs hover:bg-blue-700">
                      Đổi trạng thái
                    </button>
                    <button onClick={() => handleChangeUserPassword(userItem)} className="rounded-lg bg-indigo-600 px-3 py-2 text-white text-xs hover:bg-indigo-700 inline-flex items-center gap-1">
                      <KeyRound size={12} /> Đổi mật khẩu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const productViewModal = selectedProductDetail && (() => {
    const product = selectedProductDetail;
    const rawImages = product.hinhAnh ?? product.hinhanh;
    const images = Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []);
    const specs = product.thongsokythuat && typeof product.thongsokythuat === 'string'
      ? (() => { try { return JSON.parse(product.thongsokythuat); } catch { return null; } })()
      : product.thongsokythuat;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Chi tiết sản phẩm</h3>
            <button onClick={() => setSelectedProductDetail(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold">Mã sản phẩm:</span> {product.idsp || product.idSP}</p>
              <p><span className="font-semibold">Tên:</span> {product.tensp || product.tenSP}</p>
              <p><span className="font-semibold">Danh mục:</span> {product.category_name || product.nameCate || '-'}</p>
              <p><span className="font-semibold">NSX:</span> {product.manufacturer_name || product.TenNSX || '-'}</p>
              <p><span className="font-semibold">Giá niêm yết:</span> {Number(product.gianiemyet || 0).toLocaleString('vi-VN')}₫</p>
              <p><span className="font-semibold">Giá KM:</span> {Number(product.giakm || product.giaKM || 0).toLocaleString('vi-VN')}₫</p>
              <p><span className="font-semibold">Bảo hành:</span> {product.baohanh || product.baoHanh || '-'}</p>
              <p><span className="font-semibold">Tình trạng:</span> {product.tinhtrang || product.tinhTrang || '-'}</p>
              <p><span className="font-semibold">Mô tả:</span> {product.chitietsp || product.chiTietSP || '-'}</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">Hình ảnh</p>
              {images.length === 0 ? (
                <p className="text-sm text-slate-500">Không có hình ảnh</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((src, index) => (
                    <img key={`${src}-${index}`} src={src} alt={`img-${index}`} className="h-32 w-full rounded-xl border border-slate-200 object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-800">Thông số kỹ thuật</p>
            <pre className="max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              {JSON.stringify(specs || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  })();

  const orderViewModal = selectedOrderDetail && (() => {
    const order = selectedOrderDetail;
    const details = Array.isArray(order.details) ? order.details : [];
    const payments = Array.isArray(order.payments) ? order.payments : [];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Chi tiết hóa đơn / đơn hàng</h3>
            <button onClick={() => setSelectedOrderDetail(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <p><span className="font-semibold">Mã đơn:</span> {order.orderId || order.id}</p>
            <p><span className="font-semibold">Mã user:</span> {order.userId || order.user_id || '-'}</p>
            <p><span className="font-semibold">Khách hàng:</span> {order.name || order.tenKH || '-'}</p>
            <p><span className="font-semibold">SĐT:</span> {order.phoneNumber || order.phone_number || '-'}</p>
            <p><span className="font-semibold">Địa chỉ:</span> {order.address || order.diaChi || '-'}</p>
            <p><span className="font-semibold">Email:</span> {order.email || '-'}</p>
            <p><span className="font-semibold">Trạng thái:</span> {getOrderStatusLabel(order.orderStatus || order.status)}</p>
            <p><span className="font-semibold">Tổng tiền:</span> {Number(order.totalAmount || 0).toLocaleString('vi-VN')}₫</p>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-800">Chi tiết sản phẩm trong đơn</p>
            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Mã SP</th>
                    <th className="px-4 py-3">Tên SP</th>
                    <th className="px-4 py-3">SL</th>
                    <th className="px-4 py-3">Đơn giá</th>
                    <th className="px-4 py-3">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Không có chi tiết sản phẩm</td></tr>
                  ) : details.map((detail, idx) => (
                    <tr key={`${detail.productId || detail.idsp}-${idx}`} className="border-t border-slate-100">
                      <td className="px-4 py-3">{detail.productId || detail.idsp}</td>
                      <td className="px-4 py-3">{detail.productName || '-'}</td>
                      <td className="px-4 py-3">{detail.quantity || 0}</td>
                      <td className="px-4 py-3">{Number(detail.unitPrice || 0).toLocaleString('vi-VN')}₫</td>
                      <td className="px-4 py-3">{Number(detail.totalPrice || 0).toLocaleString('vi-VN')}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-800">Thanh toán</p>
            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Mã thanh toán</th>
                    <th className="px-4 py-3">Phương thức</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Chưa có dữ liệu thanh toán</td></tr>
                  ) : payments.map((pay) => (
                    <tr key={pay.idThanhToan || pay.idthanhtoan} className="border-t border-slate-100">
                      <td className="px-4 py-3">{pay.idThanhToan || pay.idthanhtoan}</td>
                      <td className="px-4 py-3">{pay.phuongthuc || '-'}</td>
                      <td className="px-4 py-3">{pay.provider || '-'}</td>
                      <td className="px-4 py-3">{pay.trangthai || '-'}</td>
                      <td className="px-4 py-3">{Number(pay.amount || 0).toLocaleString('vi-VN')}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  })();

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

  const dashboardSummaryCards = [
    {
      label: 'Total User',
      value: stats.users?.total_users || 0,
      note: 'Up from yesterday',
      icon: <Users size={24} className="text-slate-100" />,
      bg: 'bg-blue-600'
    },
    {
      label: 'Total Sales',
      value: formatCurrency(stats.inventory?.total_stock_value || 0),
      note: 'Kho hiện tại',
      icon: <TrendingUp size={24} className="text-slate-100" />,
      bg: 'bg-cyan-600'
    },
    {
      label: 'Active Users',
      value: stats.users?.active_users || 0,
      note: 'Tài khoản đang hoạt động',
      icon: <AlertCircle size={24} className="text-slate-100" />,
      bg: 'bg-orange-500'
    }
  ];

  const dashboardChartData = [20, 35, 30, 50, 42, 60, 55, 70, 64, 72];
  const chartWidth = 700;
  const chartHeight = 220;
  const chartPath = dashboardChartData
    .map((value, index) => {
      const x = (index / (dashboardChartData.length - 1)) * chartWidth;
      const y = chartHeight - (value / Math.max(...dashboardChartData)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const statsSection = (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[
        {
          title: 'Sản phẩm trong hệ thống',
          value: stats.products?.total_products || 0,
          icon: <Box size={24} className="text-blue-600" />
        },
        {
          title: 'Đơn hàng xử lý',
          value: stats.orders?.total_orders || 0,
          icon: <ClipboardList size={24} className="text-emerald-600" />
        },
        {
          title: 'Tổng giá trị kho',
          value: `${Number(stats.inventory?.total_stock_value || 0).toLocaleString()}₫`,
          icon: <BarChart3 size={24} className="text-orange-600" />
        },
        {
          title: 'Số nhân viên',
          value: stats.users?.total_users || 0,
          icon: <Users size={24} className="text-violet-600" />
        },
        {
          title: 'Người dùng kích hoạt',
          value: stats.users?.active_users || 0,
          icon: <CheckCircle2 size={24} className="text-green-600" />
        },
        {
          title: 'Vai trò đang dùng',
          value: stats.users?.total_roles || 0,
          icon: <ShieldCheck size={24} className="text-slate-600" />
        }
      ].map((item) => (
        <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-slate-100 p-3">{item.icon}</div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!user) {
    return <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 py-10 px-4">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white text-xl font-semibold">D</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">DashStack</p>
              <h2 className="text-xl font-semibold text-slate-900">Admin Panel</h2>
            </div>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">Pages</p>
            <div className="space-y-2">
              <button className="w-full rounded-3xl bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100">Pricing</button>
              <button className="w-full rounded-3xl bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100">Calendar</button>
              <button className="w-full rounded-3xl bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100">Contact</button>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
                <h1 className="text-3xl font-semibold text-slate-900">Tổng quan hoạt động</h1>
                <p className="mt-2 text-slate-500">Xem nhanh các chỉ số quan trọng của cửa hàng và tình trạng đơn hàng.</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[340px]">
                  <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-800 outline-none focus:border-slate-400"
                  />
                </div>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-white transition hover:bg-slate-800">
                  <Bell size={18} />
                </button>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-slate-100 px-5 text-slate-700 transition hover:bg-slate-200">
                  <Globe size={18} />
                </button>
                <button className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">M</div>
                  <span>{user.userName || 'Admin'}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'Dashboard' && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardSummaryCards.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.bg}`}>{item.icon}</div>
                    <p className="mt-6 text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sales Details</p>
                      <h2 className="text-2xl font-semibold text-slate-900">Doanh thu</h2>
                    </div>
                    <button className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">October</button>
                  </div>
                  <div className="relative h-[320px] overflow-hidden rounded-[32px] bg-slate-950 p-6 text-white">
                    <svg viewBox="0 0 700 220" className="h-full w-full">
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M0,${chartHeight} ${chartPath}`}
                        fill="url(#salesGradient)"
                        opacity="0.55"
                      />
                      <polyline
                        points={chartPath}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Total revenue</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(stats.orders?.total_revenue || 0)}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Completed orders</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{stats.orders?.completed_orders || 0}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Stock value</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(stats.inventory?.total_stock_value || 0)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Overview</p>
                        <h3 className="text-xl font-semibold text-slate-900">Quick insights</h3>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">+8.5%</span>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">New customers</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.users?.active_users || 0}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Order growth</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.orders?.total_orders || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Notifications</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">Sales spike</p>
                        <p className="mt-1 text-sm text-slate-500">Doanh thu đạt đỉnh vào ngày 20.</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">Inventory alert</p>
                        <p className="mt-1 text-sm text-slate-500">Một số sản phẩm sắp hết hàng.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Products' && productCards}
          {activeTab === 'Inventory' && inventorySection}
          {activeTab === 'Users' && usersSection}
          {activeTab === 'Stats' && statsSection}
        </main>
      </div>
      {productViewModal}
      {orderViewModal}
    </div>
  );
};

export default AdminPage;
