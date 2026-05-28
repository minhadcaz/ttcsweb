import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Layout & Toast
import MainLayout from './component/layout/mainlayout';
import Toast from './component/Toast';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/home';
import RegisterPage from './pages/register'; 
import LoginPage from './pages/login'; 
import AdminPage from './pages/admin';
import AdminProductNew from './pages/adminProductNew';
import Collections from './pages/collections';
import ProductDetail from './pages/product';
import ProfilePage from './pages/profile';

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
            <Route path="/build-pc" element={<PCBuilder />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Non-layout Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products/new" element={<AdminProductNew />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductNew />} />
          
          {/* Catch all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;