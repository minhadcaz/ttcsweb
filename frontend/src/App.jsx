import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Layout & Toast
import MainLayout from './component/layout/mainlayout';
import Toast from './component/Toast';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/home';
import RegisterPage from './pages/register'; 
import LoginPage from './pages/login'; 
import Cart from './pages/cart';
import Collections from './pages/collections';
import ProductDetail from './pages/product';
import ProfilePage from './pages/profile';
import OrdersPage from './pages/orders';

const PCBuilder = () => <div className="p-8 text-2xl">Giao diện Lắp ráp PC</div>;
const NotFound = () => <div className="p-10 text-center text-red-500 text-xl">404 - Không tìm thấy trang</div>;

function App() {
  return (
    <ToastProvider>
      <Router>
        <Toast />
        <Routes>
          {/* Layout Route - Wraps all routes that should have Header/Footer */}
          <Route element={<MainLayout w/>}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/build-pc" element={<PCBuilder />} />
            <Route path="/product/" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Non-layout Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Catch all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;