import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!credential.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: credential.trim(), pass: password })
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
        addToast(result.message || 'Đăng nhập thất bại!', 'error', 3000);
        setIsLoading(false);
        return;
      }

      if (result.success && result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('authUser', JSON.stringify(result.data.user));
        addToast('Đăng nhập thành công! 🎉', 'success', 2000);
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setErrorMessage(result.message || 'Đăng nhập thất bại.');
        addToast(result.message || 'Đăng nhập thất bại!', 'error', 3000);
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setErrorMessage('Không kết nối được server. Vui lòng thử lại sau.');
      addToast('Không kết nối được server!', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Đăng Nhập</h2>
          <p className="text-gray-500 text-sm mt-2">Chào mừng bạn quay lại với TrùmLinhKiện</p>
        </div>
        <Link 
          to="/" 
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-[#0088cc] hover:bg-blue-50 rounded-full transition-colors flex items-center gap-1 group"
          title="Quay lại trang chủ"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email hoặc Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Nhập email hoặc tên đăng nhập..."
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0088cc] hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">Hoặc đăng nhập với</span>
          <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
        </div>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors shadow-sm">
            <FcGoogle size={20} />
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;