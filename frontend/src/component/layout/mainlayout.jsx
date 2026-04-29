// Đường dẫn: src/layouts/MainLayout.jsx
import React from "react";
import Header from "./header"; 
import Footer from "./footer"; // 1. Import Footer mới tạo
import Collections from "../../pages/collections";
import {Outlet} from 'react-router-dom';
const MainLayout = () => {
  return (
    // min-h-screen: Ép toàn bộ web phải cao ít nhất bằng chiều cao màn hình
    // flex flex-col: Xếp Header, Main, Footer theo chiều dọc
    <div className="min-h-screen flex flex-col">
      
      <Header />
      
      {/* flex-grow: Đây là "ma thuật". Nó sẽ tự động giãn ra chiếm hết khoảng trống còn thừa, đẩy Footer chìm xuống sát đáy màn hình dù trang web chưa có nội dung gì */}
      <main className="flex-grow p-4 bg-gray-50 border-4 border-dashed border-gray-300">
        
        <Outlet />
      </main>
      
      <Footer /> 
      
    </div>
  );
};

export default MainLayout;