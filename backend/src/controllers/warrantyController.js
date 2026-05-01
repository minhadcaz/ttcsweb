const warrantyModel = require('../models/warrantyModel');

const warrantyController = {
    // Lấy tất cả bảo hành
    getAll: async (req, res) => {
        try {
            const warranties = await warrantyModel.getAllWarranties();
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            console.error('Lỗi lấy danh sách bảo hành:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy bảo hành theo ID
    getById: async (req, res) => {
        try {
            const warranty = await warrantyModel.getWarrantyById(req.params.id);
            if (!warranty) return res.status(404).json({ success: false, message: 'Không tìm thấy bảo hành!' });
            res.status(200).json({ success: true, data: warranty });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo bảo hành mới
    create: async (req, res) => {
        try {
            const newWarranty = await warrantyModel.createWarranty(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo bảo hành thành công',
                data: newWarranty
            });
        } catch (error) {
            console.error('Lỗi tạo bảo hành:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo bảo hành' });
        }
    },

    // Cập nhật bảo hành
    update: async (req, res) => {
        try {
            const updatedWarranty = await warrantyModel.updateWarranty(req.params.id, req.body);

            if (!updatedWarranty) {
                return res.status(404).json({ success: false, message: 'Bảo hành không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật bảo hành thành công',
                data: updatedWarranty
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật bảo hành' });
        }
    },

    // Xóa bảo hành
    delete: async (req, res) => {
        try {
            const deletedWarranty = await warrantyModel.deleteWarranty(req.params.id);

            if (!deletedWarranty) {
                return res.status(404).json({ success: false, message: 'Bảo hành không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa bảo hành thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa bảo hành' });
        }
    },

    // Lấy bảo hành theo khách hàng
    getByCustomer: async (req, res) => {
        try {
            const warranties = await warrantyModel.getWarrantiesByCustomer(req.params.customerId);
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy bảo hành theo sản phẩm
    getByProduct: async (req, res) => {
        try {
            const warranties = await warrantyModel.getWarrantiesByProduct(req.params.productId);
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy bảo hành theo trạng thái
    getByStatus: async (req, res) => {
        try {
            const warranties = await warrantyModel.getWarrantiesByStatus(req.params.status);
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy bảo hành sắp hết hạn
    getExpiring: async (req, res) => {
        try {
            const days = req.query.days || 30;
            const warranties = await warrantyModel.getExpiringWarranties(days);
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy bảo hành đã hết hạn
    getExpired: async (req, res) => {
        try {
            const warranties = await warrantyModel.getExpiredWarranties();
            res.status(200).json({ success: true, data: warranties });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Gia hạn bảo hành
    extend: async (req, res) => {
        try {
            const { newEndDate } = req.body;
            const extendedWarranty = await warrantyModel.extendWarranty(req.params.id, newEndDate);

            if (!extendedWarranty) {
                return res.status(404).json({ success: false, message: 'Bảo hành không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Gia hạn bảo hành thành công',
                data: extendedWarranty
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi gia hạn bảo hành' });
        }
    },

    // Lấy thống kê bảo hành
    getStats: async (req, res) => {
        try {
            const stats = await warrantyModel.getWarrantyStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = warrantyController;