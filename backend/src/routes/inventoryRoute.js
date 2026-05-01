const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Lấy tất cả tồn kho
router.get('/', inventoryController.getAll);

// Lấy tồn kho theo sản phẩm
router.get('/product/:productId', inventoryController.getByProduct);

// Lấy sản phẩm sắp hết hàng
router.get('/low-stock', inventoryController.getLowStock);

// Lấy sản phẩm hết hàng
router.get('/out-of-stock', inventoryController.getOutOfStock);

// Lấy lịch sử nhập xuất
router.get('/history', inventoryController.getHistory);

// Lấy thống kê tồn kho
router.get('/stats', inventoryController.getStats);

// Báo cáo tồn kho theo danh mục
router.get('/by-category', inventoryController.getByCategory);

// Lấy danh sách nhà cung cấp
router.get('/suppliers', inventoryController.getAllSuppliers);

// Cập nhật tồn kho
router.put('/product/:productId', inventoryController.update);

// Nhập hàng vào kho
router.post('/product/:productId/add-stock', inventoryController.addStock);

// Xuất hàng khỏi kho
router.post('/product/:productId/remove-stock', inventoryController.removeStock);

// Thêm nhà cung cấp mới
router.post('/suppliers', inventoryController.createSupplier);

module.exports = router;