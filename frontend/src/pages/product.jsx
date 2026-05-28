import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        const p = data?.data || data || null;
        setProduct(p);

        // Try to extract images from common fields
        const rawImages = p?.hinhAnh || p?.hinhanh || p?.images || p?.image || p?.imagesList || [];
        const imgs = Array.isArray(rawImages) ? rawImages : (typeof rawImages === 'string' ? [rawImages] : []);
        if (imgs.length === 0 && p?.anh) imgs.push(p.anh);
        setImages(imgs.length ? imgs : [ 'https://via.placeholder.com/600x400?text=No+Image' ]);
        setActiveImage(imgs.length ? imgs[0] : 'https://via.placeholder.com/600x400?text=No+Image');
      } catch (err) {
        console.error('Load product failed', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Parse technical specs from product.thongsokythuat if present
  const parseSpecs = (raw) => {
    if (!raw) return null;
    try {
      if (typeof raw === 'string') {
        const parsed = JSON.parse(raw);
        return parsed;
      }
      return raw;
    } catch (e) {
      return null;
    }
  };

  const specs = parseSpecs(product?.thongsokythuat ?? product?.thongSoKyThuat ?? product?.specs);

  // Hàm xử lý tăng giảm số lượng
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return <div className="p-8 text-center">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

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
                alt={product?.tensp || product?.tenSP || product?.name || 'Sản phẩm'} 
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
              {product?.tensp || product?.tenSP || product?.name || 'Tên sản phẩm'}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
              <span>Mã SP: <span className="text-blue-500 font-medium">{product?.maSP || product?.idsp || id}</span></span>
              <span>Đánh giá: {product?.rating || 0}</span>
              <span>Bình luận: {product?.commentsCount || 0}</span>
              <span>Lượt xem: {product?.views || 0}</span>
              <span>Đã bán: {product?.sold || product?.soLuongDaBan || 0}</span>
            </div>

            <div className="flex items-center text-sm gap-4 mb-4">
              <span>Bảo hành: <span className="text-red-500 font-medium">{product?.warranty || product?.baoHanh || '—'}</span></span>
              <span>Tình trạng: <span className={`${(product?.quantity ?? product?.soLuongTon ?? 0) > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>{(product?.quantity ?? product?.soLuongTon ?? 0) > 0 ? 'Còn hàng' : 'Hết hàng'}</span></span>
            </div>

            {/* Khung Giá */}
            <div className="border-2 border-red-500 bg-red-50 rounded-lg p-4 mb-6">
              <span className="text-4xl font-bold text-red-600">{(product?.gianiemyet || product?.price) ? `${Number(product.gianiemyet || product.price).toLocaleString('vi-VN')}đ` : 'Liên hệ'}</span>
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
              <button onClick={() => {
                alert('Module đặt hàng đang được thiết kế lại từ đầu. Tính năng thêm vào giỏ tạm thời bị tắt.');
              }} className="border border-gray-400 text-gray-500 px-4 py-2 rounded flex items-center gap-2 cursor-not-allowed font-medium">
                <ShoppingCart className="w-5 h-5" /> Tạm ngưng đặt hàng
              </button>
            </div>

            <button onClick={() => {
              alert('Module đặt hàng đang được thiết kế lại từ đầu.');
            }} className="w-full bg-gray-400 text-white font-bold py-3 rounded-lg text-lg mb-3 cursor-not-allowed transition-colors">
              ĐẶT MUA NGAY
              <span className="block text-sm font-normal mt-1">Tạm dừng thanh toán</span>
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
                      {specs ? (
                        Array.isArray(specs) ? (
                          specs.map((section, idx) => (
                            <div key={idx}>
                              {section.title ? (
                                <div className="bg-gray-50 p-3 font-bold text-gray-800 border-b">{section.title}</div>
                              ) : null}
                              {section.items && Array.isArray(section.items) ? (
                                section.items.map((it, i) => (
                                  <div key={i} className="grid grid-cols-3 border-b">
                                    <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">{it.label || it.key || Object.keys(it)[0]}</div>
                                    <div className="col-span-2 p-3 text-gray-800">{it.value ?? it.val ?? Object.values(it)[0]}</div>
                                  </div>
                                ))
                              ) : (
                                Object.entries(section).map(([k, v]) => (
                                  k === 'title' ? null : (
                                    <div key={k} className="grid grid-cols-3 border-b">
                                      <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">{k}</div>
                                      <div className="col-span-2 p-3 text-gray-800">{String(v)}</div>
                                    </div>
                                  )
                                ))
                              )}
                            </div>
                          ))
                        ) : typeof specs === 'object' ? (
                          Object.entries(specs).map(([k, v]) => (
                            <div key={k} className="grid grid-cols-3 border-b">
                              <div className="col-span-1 bg-gray-50 p-3 font-medium text-gray-700">{k}</div>
                              <div className="col-span-2 p-3 text-gray-800">{Array.isArray(v) ? v.join(', ') : String(v)}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-700">{String(specs)}</div>
                        )
                      ) : (
                        <div className="p-3 text-gray-700">Không có thông số kỹ thuật chi tiết.</div>
                      )}
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