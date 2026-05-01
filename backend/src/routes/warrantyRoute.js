const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warrantyController');

// Lấy tất cả bảo hành
router.get('/', warrantyController.getAll);

// Lấy bảo hành theo ID
router.get('/:id', warrantyController.getById);

// Lấy bảo hành theo khách hàng
router.get('/customer/:customerId', warrantyController.getByCustomer);

// Lấy bảo hành theo sản phẩm
router.get('/product/:productId', warrantyController.getByProduct);

// Lấy bảo hành theo trạng thái
router.get('/status/:status', warrantyController.getByStatus);

// Lấy bảo hành sắp hết hạn
router.get('/expiring', warrantyController.getExpiring);

// Lấy bảo hành đã hết hạn
router.get('/expired', warrantyController.getExpired);

// Lấy thống kê bảo hành
router.get('/stats', warrantyController.getStats);

// Tạo bảo hành mới
router.post('/', warrantyController.create);

// Gia hạn bảo hành
router.put('/:id/extend', warrantyController.extend);

// Cập nhật bảo hành
router.put('/:id', warrantyController.update);

// Xóa bảo hành
router.delete('/:id', warrantyController.delete);

module.exports = router;