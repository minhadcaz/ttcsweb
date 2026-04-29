import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Calendar, MapPin, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    // Kiểm tra xem user đã login chưa
    const authUser = localStorage.getItem('authUser');
    const token = localStorage.getItem('authToken');
    
    if (!authUser || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(authUser));
    
    // Gọi API lấy danh sách đơn hàng
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setOrders(result.data || []);
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error);
        // Tạo dữ liệu giả nếu API chưa sẵn sàng
        setOrders([
          {
            id: 'ORD001',
            date: new Date(),
            total: 5000000,
            status: 'delivered',
            items: 3
          },
          {
            id: 'ORD002',
            date: new Date(Date.now() - 7*24*60*60*1000),
            total: 12000000,
            status: 'processing',
            items: 5
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: Clock },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Truck }
    };
    
    const info = statusMap[status] || statusMap.pending;
    return info;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Package className="text-blue-500" size={32} />
            Tra cứu đơn hàng
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm mã đơn hàng</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập mã đơn hàng..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo trạng thái</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả đơn hàng</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {orders.length === 0 ? 'Bạn chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
              </p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    
                    {/* Mã đơn hàng */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Mã đơn hàng</p>
                      <p className="text-lg font-bold text-gray-900">{order.id}</p>
                    </div>

                    {/* Ngày đặt */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Ngày đặt</p>
                      <p className="text-gray-800 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        {new Date(order.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    {/* Tổng tiền */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Tổng tiền</p>
                      <p className="text-lg font-bold text-blue-600">
                        {order.total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {/* Trạng thái */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="md:text-right flex-1">
                        <p className="text-xs text-gray-500 uppercase mb-1">Trạng thái</p>
                        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon size={16} />
                          {statusInfo.label}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
