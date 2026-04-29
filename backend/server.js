const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./src/routes/authRoute');
const productRoute = require('./src/routes/productRoute');

const app = express();

// Middlewares
app.use(cors()); // Mở cửa cho React gọi vào
app.use(express.json()); // Giúp Backend đọc được dữ liệu JSON từ Frontend gửi lên

// Test API cơ bản
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API của TrùmLinhKiện!' });
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy rầm rập tại http://localhost:${PORT}`);
});