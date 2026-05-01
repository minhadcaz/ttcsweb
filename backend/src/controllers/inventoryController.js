const inventoryModel = require('../models/inventoryModel');

const inventoryController = {
    // Lấy tất cả tồn kho
    getAll: async (req, res) => {
        try {
            const inventory = await inventoryModel.getAllInventory();
            res.status(200).json({ success: true, data: inventory });
        } catch (error) {
            console.error('Lỗi lấy danh sách tồn kho:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy tồn kho theo sản phẩm
    getByProduct: async (req, res) => {
        try {
            const inventory = await inventoryModel.getInventoryByProductId(req.params.productId);
            if (!inventory) return res.status(404).json({ success: false, message: 'Không tìm thấy tồn kho cho sản phẩm này!' });
            res.status(200).json({ success: true, data: inventory });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Cập nhật tồn kho
    update: async (req, res) => {
        try {
            const updatedInventory = await inventoryModel.updateInventory(req.params.productId, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật tồn kho thành công',
                data: updatedInventory
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật tồn kho' });
        }
    },

    // Nhập hàng vào kho
    addStock: async (req, res) => {
        try {
            const { quantity, supplierId } = req.body;
            const updatedInventory = await inventoryModel.addStock(req.params.productId, quantity, supplierId);
            res.status(200).json({
                success: true,
                message: 'Nhập hàng thành công',
                data: updatedInventory
            });
        } catch (error) {
            console.error('Lỗi nhập hàng:', error);
            res.status(500).json({ success: false, message: error.message || 'Lỗi nhập hàng' });
        }
    },

    // Xuất hàng khỏi kho
    removeStock: async (req, res) => {
        try {
            const { quantity, reason } = req.body;
            const updatedInventory = await inventoryModel.removeStock(req.params.productId, quantity, reason);
            res.status(200).json({
                success: true,
                message: 'Xuất hàng thành công',
                data: updatedInventory
            });
        } catch (error) {
            console.error('Lỗi xuất hàng:', error);
            res.status(500).json({ success: false, message: error.message || 'Lỗi xuất hàng' });
        }
    },

    // Lấy sản phẩm sắp hết hàng
    getLowStock: async (req, res) => {
        try {
            const threshold = req.query.threshold || 10;
            const products = await inventoryModel.getLowStockProducts(threshold);
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy sản phẩm hết hàng
    getOutOfStock: async (req, res) => {
        try {
            const products = await inventoryModel.getOutOfStockProducts();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy lịch sử nhập xuất
    getHistory: async (req, res) => {
        try {
            const limit = req.query.limit || 50;
            const history = await inventoryModel.getInventoryHistory(req.query.productId, limit);
            res.status(200).json({ success: true, data: history });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy thống kê tồn kho
    getStats: async (req, res) => {
        try {
            const stats = await inventoryModel.getInventoryStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Báo cáo tồn kho theo danh mục
    getByCategory: async (req, res) => {
        try {
            const report = await inventoryModel.getInventoryByCategory();
            res.status(200).json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy danh sách nhà cung cấp
    getAllSuppliers: async (req, res) => {
        try {
            const suppliers = await inventoryModel.getAllSuppliers();
            res.status(200).json({ success: true, data: suppliers });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Thêm nhà cung cấp mới
    createSupplier: async (req, res) => {
        try {
            const newSupplier = await inventoryModel.createSupplier(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo nhà cung cấp thành công',
                data: newSupplier
            });
        } catch (error) {
            console.error('Lỗi tạo nhà cung cấp:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo nhà cung cấp' });
        }
    }
};

module.exports = inventoryController;