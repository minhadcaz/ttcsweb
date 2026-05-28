import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Package, Eye, LogOut, Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account'); // account, address, orders, viewed, logout
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    postalCode: '',
    isDefault: false
  });
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Kiểm tra xem user đã login chưa
    const authUser = localStorage.getItem('authUser');
    if (!authUser) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(authUser));
    loadAddresses();
    setIsLoading(false);
  }, [navigate]);

  const loadAddresses = () => {
    // Lấy địa chỉ từ localStorage
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  };

  const saveAddresses = (updatedAddresses) => {
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
  };

  const handleAddAddress = () => {
    if (editingAddressId) {
      // Cập nhật địa chỉ
      const updated = addresses.map(addr => 
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
      );
      saveAddresses(updated);
      addToast('Cập nhật địa chỉ thành công! ✏️', 'success', 2000);
    } else {
      // Thêm địa chỉ mới
      const newAddress = {
        id: Date.now(),
        ...addressForm
      };
      saveAddresses([...addresses, newAddress]);
      addToast('Thêm địa chỉ thành công! ✅', 'success', 2000);
    }
    
    resetForm();
    setIsAddingAddress(false);
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    saveAddresses(updated);
    addToast('Xóa địa chỉ thành công! 🗑️', 'success', 2000);
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updated);
    addToast('Đặt làm địa chỉ mặc định thành công! ⭐', 'success', 2000);
  };

  const resetForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      district: '',
      city: '',
      postalCode: '',
      isDefault: false
    });
    setEditingAddressId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    addToast('Đã đăng xuất thành công! 👋', 'success', 2000);
    navigate('/');
  };

  if (isLoading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2">
                <User size={24} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg">{user.userName}</h3>
              <p className="text-sm text-blue-100">{user.Email}</p>
            </div>

            <nav className="py-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === 'account' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={20} />
                <span className="font-medium">Thông tin tài khoản</span>
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === 'address' 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin size={20} />
                <span className="font-medium">Sổ địa chỉ</span>
              </button>

              <button
                onClick={() => setActiveTab('logout')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors border-t"
              >
                <LogOut size={20} />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Tab: Account Info */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-sm text-gray-500 mb-1 block">Tên đăng nhập</label>
                  <p className="text-lg font-semibold text-gray-800">{user.userName}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-sm text-gray-500 mb-1 flex items-center gap-2">Email</label>
                  <p className="text-lg font-semibold text-gray-800">{user.Email || 'Chưa cập nhật'}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-sm text-gray-500 mb-1 block">Ngày tạo tài khoản</label>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-sm text-gray-500 mb-1 block">Trạng thái</label>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {user.tinhTrang === 'Hoat dong' ? 'Hoạt động' : user.tinhTrang}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">
                  Lần đăng nhập cuối: <span className="font-semibold">
                    {user.hoatdonggannhat ? new Date(user.hoatdonggannhat).toLocaleDateString('vi-VN') : 'Chưa có dữ liệu'}
                  </span>
                </p>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Quyền hạn</p>
                <span className="inline-block px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                  {user.roles === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </div>
            </div>
          )}

          {/* Tab: Address Book */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sổ địa chỉ</h2>
                <button
                  onClick={() => {
                    resetForm();
                    setIsAddingAddress(!isAddingAddress);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Thêm địa chỉ
                </button>
              </div>

              {/* Form thêm/sửa địa chỉ */}
              {isAddingAddress && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">
                    {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Họ và tên"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Số điện thoại"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Địa chỉ (số nhà, đường phố)"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Quận/Huyện"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Thành phố/Tỉnh"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Mã bưu chính"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">Đặt làm địa chỉ mặc định</span>
                  </label>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      {editingAddressId ? 'Cập nhật' : 'Thêm'}
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setIsAddingAddress(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Danh sách địa chỉ */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
                  </div>
                ) : (
                  addresses.map(address => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800">{address.fullName}</h3>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                ⭐ Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            📱 {address.phone}
                          </p>
                          <p className="text-gray-700">
                            {address.street}, {address.district}, {address.city}
                            {address.postalCode && ` ${address.postalCode}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                          Đặt làm địa chỉ mặc định
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab: Logout */}
          {activeTab === 'logout' && (
            <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-6">
              <div className="text-red-500">
                <LogOut size={64} className="mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Đăng xuất</h2>
              <p className="text-gray-600">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setActiveTab('account')}
                  className="px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
