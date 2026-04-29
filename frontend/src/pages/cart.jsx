import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, ShoppingBasket, Download, Image as ImageIcon, Printer } from 'lucide-react';

const Cart = () => {
  // 1. STATE QUẢN LÝ GIỎ HÀNG (Mock Data)
  // Để xem giao diện Giỏ Hàng Trống (Ảnh 2), bạn chỉ cần đổi giá trị khởi tạo này thành []
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bộ PC Hatsune Miku Ryzen 7 9800X3D, RAM 32GB, VGA RTX 5080 16GB [Tặng Màn Hình]",
      price: 135990000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=PC+Miku", // Dùng ảnh placeholder tạm
      promo: "Khuyến mãi"
    },
    {
      id: 2,
      name: "RAM GSKILL RIPJAWS V 16GB DDR4 3200MHZ (F4-3200C16S-16GVK)",
      price: 3290000,
      quantity: 1,
      image: "https://via.placeholder.com/80?text=RAM+GSkill",
      promo: "Khuyến mãi"
    }
  ]);

  // 2. CÁC HÀM XỬ LÝ LOGIC
  // Cập nhật số lượng
  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Không cho giảm dưới 1
      }
      return item;
    }));
  };

  // Xóa 1 sản phẩm
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    if(window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      setCartItems([]);
    }
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Format tiền tệ VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
  };

  // 3. RENDER GIAO DIỆN: GIỎ HÀNG TRỐNG (TRẠNG THÁI 2)
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-sm text-gray-500 w-full max-w-4xl mx-auto mb-8">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link> {'>'} Thông tin giỏ hàng
        </div>
        
        <div className="flex flex-col items-center text-center">
          {/* Vòng tròn trang trí & Icon */}
          <div className="w-40 h-40 bg-pink-50 rounded-full flex items-center justify-center mb-6 relative">
            <ShoppingBasket size={80} className="text-red-500 z-10" strokeWidth={1.5} />
            {/* Các chấm trang trí xung quanh (Mô phỏng như ảnh) */}
            <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-4 left-8"></div>
            <div className="absolute w-3 h-3 bg-red-300 rounded-full bottom-8 right-4"></div>
            <div className="absolute w-2 h-2 border border-blue-300 rounded-full top-10 right-10"></div>
          </div>
          
          <p className="text-gray-600 mb-6">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
          
          <Link 
            to="/" 
            className="bg-[#e30019] hover:bg-red-700 text-white font-medium py-2.5 px-8 rounded-md transition-colors"
          >
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      </div>
    );
  }

  // 4. RENDER GIAO DIỆN: CÓ SẢN PHẨM (TRẠNG THÁI 1)
  return (
    <div className="bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200">
        
        {/* HEADER GIỎ HÀNG */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold">Giỏ hàng của bạn</h1>
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
            <ChevronLeft size={16} /> Mua thêm sản phẩm khác
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          {/* NÚT XÓA GIỎ HÀNG */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={clearCart}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
            >
              Xóa giỏ hàng
            </button>
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 relative">
                {/* Ảnh */}
                <div className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                {/* Thông tin */}
                <div className="flex-grow">
                  <h3 className="text-sm font-medium mb-1 pr-6">{item.name}</h3>
                  <div className="text-blue-500 text-xs mb-3 cursor-pointer hover:underline">
                    {item.promo} (Chi tiết) ▾
                  </div>
                </div>

                {/* Cột Số lượng & Giá */}
                <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2 w-full sm:w-32">
                  <div className="font-bold text-red-600 text-base">{formatPrice(item.price)}</div>
                  
                  <div className="flex border border-gray-300 rounded overflow-hidden w-24 h-8">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">-</button>
                    <input type="text" value={item.quantity} readOnly className="w-8 text-center text-sm outline-none border-x border-gray-300 font-medium" />
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">+</button>
                  </div>
                </div>

                {/* Nút thùng rác */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute bottom-6 right-0 sm:top-0 sm:bottom-auto text-gray-400 hover:text-red-500 p-1 bg-gray-100 rounded-full transition-colors"
                  title="Xóa sản phẩm này"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 my-6" />

          {/* THÔNG TIN KHÁCH HÀNG */}
          <div className="mb-8">
            <h2 className="text-blue-600 font-bold mb-4">THÔNG TIN KHÁCH HÀNG</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Họ tên*" className="col-span-1 md:col-span-2 w-full border border-gray-300 rounded p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              <input type="tel" placeholder="Số điện thoại*" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:border-blue-500 outline-none" />
              <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded p-2.5 text-sm focus:border-blue-500 outline-none" />
              <input type="text" placeholder="Địa chỉ*" className="col-span-1 md:col-span-2 w-full border border-gray-300 rounded p-2.5 text-sm focus:border-blue-500 outline-none" />
              
              <div className="relative">
                <select className="w-full border border-gray-300 rounded p-2.5 text-sm appearance-none bg-gray-50 text-gray-500 outline-none">
                  <option value="">Tỉnh/Thành phố</option>
                  <option value="hn">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                </select>
                <ChevronLeft size={16} className="absolute right-3 top-3 text-gray-400 -rotate-90 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-full border border-gray-300 rounded p-2.5 text-sm appearance-none bg-gray-50 text-gray-500 outline-none">
                  <option value="">Quận/Huyện</option>
                </select>
                <ChevronLeft size={16} className="absolute right-3 top-3 text-gray-400 -rotate-90 pointer-events-none" />
              </div>

              <textarea placeholder="Ghi chú" rows="3" className="col-span-1 md:col-span-2 w-full border border-gray-300 rounded p-2.5 text-sm focus:border-blue-500 outline-none"></textarea>
            </div>
            
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" />
              <span className="text-sm text-gray-700">Yêu cầu xuất hóa đơn công ty</span>
            </label>
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="mb-8">
            <h2 className="text-blue-600 font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Thanh toán khi nhận hàng</span>
            </label>
          </div>

          {/* TỔNG TIỀN */}
          <div className="mb-6 space-y-2">
            <h2 className="text-blue-600 font-bold mb-2">TỔNG TIỀN</h2>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Tổng cộng</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm text-gray-600">Thành tiền</span>
              <div className="text-right">
                <span className="text-xl font-bold text-red-600 block">{formatPrice(totalPrice)}</span>
                <span className="text-xs text-gray-500 block mt-1">(Giá đã bao gồm VAT)</span>
              </div>
            </div>
          </div>

          {/* CÁC NÚT HÀNH ĐỘNG */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#e30019] hover:bg-red-700 text-white font-bold py-3.5 rounded transition-colors text-lg uppercase shadow-sm">
              Đặt hàng
            </button>
            <button className="w-full bg-[#f39c12] hover:bg-orange-500 text-white font-bold py-3.5 rounded transition-colors text-lg uppercase shadow-sm">
              Mua trả góp
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded text-sm transition-colors uppercase">
                <Download size={16} /> Tải file Excel
              </button>
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded text-sm transition-colors uppercase">
                <ImageIcon size={16} /> Tải ảnh báo giá
              </button>
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded text-sm transition-colors uppercase">
                <Printer size={16} /> In báo giá
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;