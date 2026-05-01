const promotionModel = require('../models/promotionModel');

const promotionController = {
    // Lấy tất cả khuyến mãi
    getAll: async (req, res) => {
        try {
            const promotions = await promotionModel.getAllPromotions();
            res.status(200).json({ success: true, data: promotions });
        } catch (error) {
            console.error('Lỗi lấy danh sách khuyến mãi:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy khuyến mãi theo ID
    getById: async (req, res) => {
        try {
            const promotion = await promotionModel.getPromotionById(req.params.id);
            if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi!' });
            res.status(200).json({ success: true, data: promotion });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo khuyến mãi mới
    create: async (req, res) => {
        try {
            const newPromotion = await promotionModel.createPromotion(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo khuyến mãi thành công',
                data: newPromotion
            });
        } catch (error) {
            console.error('Lỗi tạo khuyến mãi:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo khuyến mãi' });
        }
    },

    // Cập nhật khuyến mãi
    update: async (req, res) => {
        try {
            const updatedPromotion = await promotionModel.updatePromotion(req.params.id, req.body);

            if (!updatedPromotion) {
                return res.status(404).json({ success: false, message: 'Khuyến mãi không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật khuyến mãi thành công',
                data: updatedPromotion
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật khuyến mãi' });
        }
    },

    // Xóa khuyến mãi
    delete: async (req, res) => {
        try {
            const deletedPromotion = await promotionModel.deletePromotion(req.params.id);

            if (!deletedPromotion) {
                return res.status(404).json({ success: false, message: 'Khuyến mãi không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa khuyến mãi thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa khuyến mãi' });
        }
    },

    // Lấy khuyến mãi đang hoạt động
    getActive: async (req, res) => {
        try {
            const promotions = await promotionModel.getActivePromotions();
            res.status(200).json({ success: true, data: promotions });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy khuyến mãi theo sản phẩm
    getByProduct: async (req, res) => {
        try {
            const promotions = await promotionModel.getPromotionsByProduct(req.params.productId);
            res.status(200).json({ success: true, data: promotions });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo mã giảm giá
    createCoupon: async (req, res) => {
        try {
            const newCoupon = await promotionModel.createCoupon(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo mã giảm giá thành công',
                data: newCoupon
            });
        } catch (error) {
            console.error('Lỗi tạo mã giảm giá:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo mã giảm giá' });
        }
    },

    // Lấy tất cả mã giảm giá
    getAllCoupons: async (req, res) => {
        try {
            const coupons = await promotionModel.getAllCoupons();
            res.status(200).json({ success: true, data: coupons });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy mã giảm giá theo mã
    getCouponByCode: async (req, res) => {
        try {
            const coupon = await promotionModel.getCouponByCode(req.params.code);
            if (!coupon) return res.status(404).json({ success: false, message: 'Không tìm thấy mã giảm giá!' });
            res.status(200).json({ success: true, data: coupon });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Sử dụng mã giảm giá
    useCoupon: async (req, res) => {
        try {
            const updatedCoupon = await promotionModel.updateCouponUsage(req.params.code);

            if (!updatedCoupon) {
                return res.status(400).json({ success: false, message: 'Mã giảm giá không khả dụng' });
            }

            res.status(200).json({
                success: true,
                message: 'Sử dụng mã giảm giá thành công',
                data: updatedCoupon
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi sử dụng mã giảm giá' });
        }
    },

    // Lấy thống kê khuyến mãi
    getStats: async (req, res) => {
        try {
            const stats = await promotionModel.getPromotionStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = promotionController;