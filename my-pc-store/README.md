server/
├── node_modules/
├── src/
│   ├── config/           # Cấu hình hệ thống
│   │   └── db.js         # Code kết nối MySQL/Postgres
│   ├── controllers/      # Xử lý logic nghiệp vụ
│   │   ├── authController.js    # Đăng nhập, đăng ký
│   │   ├── productController.js # Lọc, thêm, sửa, xóa linh kiện
│   │   └── orderController.js   # Xử lý đặt hàng
│   ├── middlewares/      # Các hàm trung gian chặn request
│   │   ├── authMiddleware.js    # Kiểm tra token JWT (chưa login thì chặn)
│   │   └── uploadMiddleware.js  # Xử lý upload ảnh (nếu dùng Multer)
│   ├── models/           # Các file chứa câu lệnh SQL truy vấn DB
│   │   ├── productModel.js      # VD: SELECT * FROM LinhKien...
│   │   └── userModel.js
│   ├── routes/           # Định nghĩa các đường dẫn API
│   │   ├── authRoutes.js        # POST /api/auth/login
│   │   ├── productRoutes.js     # GET /api/products
│   │   └── orderRoutes.js
│   └── utils/            # Các hàm hỗ trợ dùng chung
│       └── helpers.js    # VD: Hàm mã hóa password, format ngày tháng
├── .env                  # Chứa biến môi trường (Thông tin DB, Port, JWT Secret)
├── .gitignore            # Khai báo các file không push lên Github (node_modules, .env)
├── package.json          # Danh sách thư viện Backend
└── server.js


///////////////////
client/
├── node_modules/
├── public/               # Chứa file tĩnh (favicon, ảnh logo tĩnh)
├── src/
│   ├── api/              # Chứa các hàm gọi xuống Backend (Axios/Fetch)
│   │   ├── axiosClient.js  # Cấu hình Axios cơ bản (gắn sẵn token)
│   │   └── productApi.js   # Gọi API lấy linh kiện
│   ├── assets/           # Ảnh, font chữ, CSS dùng chung
│   ├── components/       # Các UI Component dùng lại nhiều lần
│   │   ├── common/       # Nút bấm, Input, Modal...
│   │   ├── layout/       # Header, Footer, Sidebar
│   │   └── product/      # ProductCard (Thẻ sản phẩm)
│   ├── config/           # Các file cấu hình tĩnh
│   │   └── specConfig.js # File map thông số cấu hình hiển thị (Đã bàn ở trên)
│   ├── context/          # State toàn cục (React Context)
│   │   ├── AuthContext.jsx # Lưu trạng thái đăng nhập của user
│   │   └── CartContext.jsx # Lưu giỏ hàng
│   ├── pages/            # Các trang giao diện chính
│   │   ├── Home/         # Trang chủ
│   │   ├── Shop/         # Trang danh sách sản phẩm (có bộ lọc)
│   │   ├── ProductDetail/# Trang chi tiết 1 linh kiện
│   │   ├── BuildPC/      # Trang giao diện Build PC
│   │   ├── Cart/         # Giỏ hàng & Thanh toán
│   │   └── Admin/        # Khu vực quản trị (Thêm SP, Duyệt đơn)
│   ├── routes/           # Cấu hình React Router DOM
│   │   └── AppRouter.jsx
│   ├── utils/            # Các hàm tiện ích Frontend
│   │   └── formatters.js # Hàm biến 15000000 -> "15.000.000 đ"
│   ├── App.jsx           # Component gốc bọc toàn bộ app
│   ├── index.css         # CSS toàn cục (hoặc cấu hình Tailwind)
│   └── main.jsx          # Điểm neo file React vào file HTML
├── .env                  # Biến môi trường FE (VD: VITE_API_URL=http://localhost:5000)
├── index.html            # File HTML duy nhất
├── package.json          # Danh sách thư viện Frontend
└── vite.config.js