import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Gift, 
  ShoppingCart, 
  CheckCircle2, 
  Package, 
  RefreshCcw, 
  CreditCard ,
  Star,      
  Send,      
  Camera
} from 'lucide-react';

const ProductDetail = () => {
  // Mock data cho danh sách ảnh
  const images = [
    "https://via.placeholder.com/600x400?text=Laptop+Lenovo+LOQ+1",
    "https://via.placeholder.com/600x400?text=Goc+Nghieng+2",
    "https://via.placeholder.com/600x400?text=Mat+Sau+3",
    "https://via.placeholder.com/600x400?text=Ban+Phim+4",
    "https://via.placeholder.com/600x400?text=Cac+Cong+Ket+Noi+5"
  ];

  // State quản lý ảnh đang hiển thị và số lượng mua
  const [activeImage, setActiveImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  // Hàm xử lý tăng giảm số lượng
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <a href="/laptop" className="hover:text-blue-600">LAPTOP</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">LAPTOP GAMING</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CỘT TRÁI: Hình ảnh & Thông số */}
          <div>
            {/* Ảnh chính */}
            <div className="border rounded-lg p-4 mb-4 flex justify-center">
              <img 
                src={activeImage} 
                alt="Laptop Lenovo LOQ" 
                className="max-w-full h-auto object-contain aspect-video"
              />
            </div>
            
            {/* Banner KM */}
            <div className="bg-red-600 text-white p-3 rounded text-center font-bold text-xl mb-4">
              TẶNG NGAY BALO LAPTOP CHUỘT KHÔNG DÂY
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded cursor-pointer w-20 h-20 object-cover hover:border-red-500 transition-colors ${
                    activeImage === img ? 'border-red-500 border-2' : 'border-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Thông số sản phẩm */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3">Thông số sản phẩm</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                <li>CPU: Intel Core i5-12450HX (upto 4.4 GHz, 8 nhân, 12 luồng, 12MB)</li>
                <li>VGA: NVIDIA® GeForce RTX™ 3050 6GB GDDR6, Boost Clock 1432MHz</li>
                <li>Màn hình: 15.6 inch FHD (1920x1080) IPS 300nits Anti-glare, 144Hz</li>
              </ul>
              <button className="text-blue-500 text-sm mt-3 flex items-center hover:underline">
                Xem thêm <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin mua hàng */}
          <div>
            <h1 className="text-2xl font-bold mb-3">
              Lenovo LOQ Essential 15IAX9E | Core i5 12450HX, 16GB, 512GB, RTX 3050 6GB, 15.6" FHD 144Hz, W11, Luna Grey
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
              <span>Mã SP: <span className="text-blue-500 font-medium">LT0000975</span></span>
              <span>Đánh giá: 0</span>
              <span>Bình luận: 0</span>
              <span>Lượt xem: 6224</span>
              <span>Đã bán: 21</span>
            </div>

            <div className="flex items-center text-sm gap-4 mb-4">
              <span>Bảo hành: <span className="text-red-500 font-medium">12 tháng</span></span>
              <span>Tình trạng: <span className="text-green-500 font-medium">Còn hàng</span></span>
            </div>

            {/* Khung Giá */}
            <div className="border-2 border-red-500 bg-red-50 rounded-lg p-4 mb-6">
              <span className="text-4xl font-bold text-red-600">20.590.000đ</span>
            </div>

            {/* Khung Khuyến mãi */}
            <div className="border-2 border-red-600 rounded-lg mb-6 overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-2 font-bold flex items-center gap-2">
                <Gift className="w-5 h-5" /> KHUYẾN MÃI
              </div>
              <div className="p-4 bg-white text-sm">
                <p className="font-bold mb-2">Quà Tặng:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>+ Tặng Balo Nguyễn Công PC trị giá 200.000đ</li>
                  <li>+ Tặng Chuột không dây trị giá: 150.000đ</li>
                  <li>+ Tặng Bàn di chuột trị giá: 50.000đ</li>
                  <li>+ Tặng Bộ vệ sinh Laptop trị giá: 40.000đ</li>
                </ul>
              </div>
            </div>

            {/* Khu vực đặt hàng */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex border rounded overflow-hidden">
                <button onClick={handleDecrease} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors">-</button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly
                  className="w-12 text-center border-l border-r outline-none text-sm font-medium" 
                />
                <button onClick={handleIncrease} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors">+</button>
              </div>
              <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-50 transition-colors font-medium">
                <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
              </button>
            </div>

            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg text-lg mb-3 hover:bg-red-700 transition-colors">
              ĐẶT MUA NGAY
              <span className="block text-sm font-normal mt-1">Giao hàng tận nơi nhanh chóng</span>
            </button>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex flex-col items-center justify-center">
                <span className="font-bold">TRẢ GÓP QUA HỒ SƠ</span>
                <span className="text-xs">Chỉ từ 2.665.000đ/ tháng</span>
              </button>
              <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex flex-col items-center justify-center">
                <span className="font-bold">TRẢ GÓP QUA THẺ</span>
                <span className="text-xs">Chỉ từ 1.332.500đ/ tháng</span>
              </button>
            </div>

            {/* Yên tâm mua hàng */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-md mb-4 text-gray-800">YÊN TÂM MUA HÀNG</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Cam kết giá tốt nhất thị trường.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Sản phẩm mới 100%.</span>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCcw className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Lỗi 1 đổi 1 ngay lập tức.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Hỗ trợ trả góp - Thủ tục nhanh gọn.</span>
                </div>
              </div>
            </div>
              
          </div>
          
        </div>
        <div className="mt-12 border-t pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CỘT TRÁI: Đánh giá & Hỏi đáp */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Khung Bình luận và đánh giá */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Bình luận và đánh giá</h2>
                    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                      <div className="flex flex-col md:flex-row items-center border-b pb-6 mb-6 gap-8">
                        {/* Điểm số tổng quan */}
                        <div className="text-center px-8 md:border-r">
                          <div className="text-5xl font-bold mb-2">0/5</div>
                          <div className="flex text-gray-400 mb-2 justify-center gap-1">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                          <div className="text-sm text-gray-500">0 đánh giá và nhận xét</div>
                        </div>
                        
                        {/* Thanh tiến trình chi tiết */}
                        <div className="flex-1 w-full space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center text-sm text-gray-600 gap-2">
                              <span className="w-3 font-medium">{star}</span>
                              <Star className="w-4 h-4 text-orange-400 fill-current" />
                              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 w-0"></div> {/* Thay đổi w-0 thành % tương ứng sau này có data */}
                              </div>
                              <span className="w-20 text-right text-xs"><strong>0</strong> đánh giá</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Bạn đánh giá sao sản phẩm này</p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-10 rounded-lg transition-colors">
                          Đánh giá ngay
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Khung Hỏi và đáp */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Hỏi và đáp</h2>
                    <div className="relative mb-3">
                      <textarea 
                        className="w-full border border-gray-300 rounded-lg p-4 pr-24 outline-none focus:border-blue-500 resize-none h-28 text-sm"
                        placeholder="Xin mời để lại câu hỏi, Nguyencong sẽ trả lời ngay trong 1h, các câu hỏi sau 22h - 8h sẽ được trả lời vào sáng hôm sau."
                      ></textarea>
                      <button className="absolute right-3 top-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2 text-sm transition-colors font-medium">
                        <Send className="w-4 h-4" /> Gửi
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                      <Camera className="w-4 h-4" /> Đính kèm ảnh
                    </button>
                  </div>

                </div>

                {/* CỘT PHẢI: Thông số kỹ thuật */}
                <div className="lg:col-span-1">
                  <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-bold text-gray-800">Thông số kỹ thuật</h2>
                    </div>
                    
                    <div className="text-sm">
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Hãng sản xuất</div>
                        <div className="col-span-2 p-3 text-gray-800">Laptop Lenovo</div>
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Tên sản phẩm</div>
                        <div className="col-span-2 p-3 text-gray-800">Laptop Lenovo LOQ 15IAX9E 83LK0079VN</div>
                      </div>
                      <div className="bg-gray-50 p-3 font-bold text-gray-800 border-b">
                        Bộ vi xử lý
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Công nghệ CPU</div>
                        <div className="col-span-2 p-3 text-gray-800">Intel Core i5-12450HX</div>
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Số nhân</div>
                        <div className="col-span-2 p-3 text-gray-800">8</div>
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Số luồng</div>
                        <div className="col-span-2 p-3 text-gray-800">12</div>
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Tốc độ tối đa</div>
                        <div className="col-span-2 p-3 text-gray-800">upto 4.4 GHz</div>
                      </div>
                      <div className="grid grid-cols-3 border-b">
                        <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">Bộ nhớ đệm</div>
                        <div className="col-span-2 p-3 text-gray-800">12MB</div>
                      </div>
                    </div>

                    <div className="p-4">
                      <button className="w-full bg-white border border-blue-500 text-blue-500 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-50 transition-colors">
                        Xem đầy đủ thông số kỹ thuật <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
      </div>
    </div>
  );
};

export default ProductDetail;