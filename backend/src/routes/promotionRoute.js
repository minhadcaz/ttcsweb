const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Lấy tất cả khuyến mãi
router.get('/', promotionController.getAll);

// Lấy khuyến mãi theo ID
router.get('/:id', promotionController.getById);

// Lấy khuyến mãi đang hoạt động
router.get('/active', promotionController.getActive);

// Lấy khuyến mãi theo sản phẩm
router.get('/product/:productId', promotionController.getByProduct);

// Lấy tất cả mã giảm giá
router.get('/coupons', promotionController.getAllCoupons);

// Lấy mã giảm giá theo mã
router.get('/coupons/:code', promotionController.getCouponByCode);

// Lấy thống kê khuyến mãi
router.get('/stats', promotionController.getStats);

// Tạo khuyến mãi mới
router.post('/', promotionController.create);

// Tạo mã giảm giá
router.post('/coupons', promotionController.createCoupon);

// Sử dụng mã giảm giá
router.put('/coupons/:code/use', promotionController.useCoupon);

// Cập nhật khuyến mãi
router.put('/:id', promotionController.update);

// Xóa khuyến mãi
router.delete('/:id', promotionController.delete);

module.exports = router;