import React from 'react';
// Import component HeroSlider bạn vừa tạo (Nhớ kiểm tra lại đường dẫn cho đúng với cấu trúc của bạn nhé)
import HeroSlider from '../component/layout/slider'; 
import FlashSale from '../component/flashsale';
import TopCategories from '../component/topcategories';
import TopBrands from '../component/topbrand';
import SpecialPromotions from '../component/promotion';
const Home = () => {
  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* 1. Thanh trượt quảng cáo ở trên cùng của trang chủ */}
      <HeroSlider />
      
      {/* 2. Flash Sale */}
      <FlashSale />
      
      {/* 3. Top Categories */}
      <TopCategories />
      {/* 4. Top Brands */}
      <TopBrands />  
      {/* 5. Khu vực Khuyến mãi đặc biệt */}
      <SpecialPromotions /> 
      {/* 3. Khu vực này sau này chúng ta sẽ code thêm Danh sách sản phẩm (Product Grid) */}
      
    </div>
  );
};

export default Home;