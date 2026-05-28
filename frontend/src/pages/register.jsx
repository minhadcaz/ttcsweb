import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // State quản lý form data
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State quản lý lỗi validation
  const [errors, setErrors] = useState({});

  // State loading khi submit
  const [isLoading, setIsLoading] = useState(false);

  const [serverMessage, setServerMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Hàm validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate họ và tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    // Validate tên đăng nhập
    if (!formData.userName.trim()) {
      newErrors.userName = 'Vui lòng nhập tên đăng nhập';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Validate xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        userName: formData.userName.trim(),
        fullName: formData.fullName.trim(),
        pass: formData.password,
        Email: formData.email.trim(),
        roles: 'customer'
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        setServerMessage(result.message || 'Đăng ký không thành công. Vui lòng thử lại.');
        addToast(result.message || 'Đăng ký thất bại!', 'error', 3000);
        setIsLoading(false);
        return;
      }

      setServerMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      addToast('Đăng ký thành công! 🎉', 'success', 2000);
      
      setFormData({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setServerMessage('Không thể kết nối server. Vui lòng thử lại sau.');
      addToast('Không kết nối được server!', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tạo Tài Khoản</h2>
          <p className="text-gray-500 text-sm mt-2">Trở thành thành viên để nhận ưu đãi đặc quyền</p>
        </div>
       <Link 
          to="/" 
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-[#0088cc] hover:bg-blue-50 rounded-full transition-colors flex items-center gap-1 group"
          title="Quay lại trang chủ"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>

        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và Tên</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Nhập họ và tên của bạn..."
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.userName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Nhập tên đăng nhập..."
              />
            </div>
            {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Nhập email của bạn..."
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
            {/*xác nhận mật khẩu*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0088cc] hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>

          {serverMessage && (
            <p className="mt-3 text-sm text-center text-gray-700">{serverMessage}</p>
          )}
        </form>

        <div className="mt-8 flex items-center justify-between">
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">Hoặc đăng ký với</span>
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
        </div>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors shadow-sm">
            <FcGoogle size={20} />
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          {/* Nút Redirect ngược về trang Đăng nhập */}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;