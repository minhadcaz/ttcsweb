const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Lấy tất cả đơn hàng
router.get('/', orderController.getAll);

// Lấy đơn hàng theo ID
router.get('/:id', orderController.getById);

// Lấy đơn hàng theo trạng thái
router.get('/status/:status', orderController.getByStatus);

// Lấy đơn hàng theo khách hàng
router.get('/customer/:customerId', orderController.getByCustomer);

// Lấy thống kê đơn hàng
router.get('/stats', orderController.getStats);

// Lấy doanh thu theo tháng
router.get('/revenue/:year', orderController.getMonthlyRevenue);

// Tạo đơn hàng mới
router.post('/', orderController.create);

// Thêm chi tiết đơn hàng
router.post('/:id/details', orderController.addOrderDetail);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', orderController.updateStatus);

// Xóa đơn hàng
router.delete('/:id', orderController.delete);

module.exports = router;