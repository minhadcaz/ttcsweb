const orderModel = require('../models/orderModel');

const orderController = {
    // Lấy tất cả đơn hàng
    getAll: async (req, res) => {
        try {
            const orders = await orderModel.getAllOrders();
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error('Lỗi lấy danh sách đơn hàng:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy đơn hàng theo ID
    getById: async (req, res) => {
        try {
            const order = await orderModel.getOrderById(req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo đơn hàng mới
    create: async (req, res) => {
        try {
            const newOrder = await orderModel.createOrder(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo đơn hàng thành công',
                data: newOrder
            });
        } catch (error) {
            console.error('Lỗi tạo đơn hàng:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng' });
        }
    },

    // Cập nhật trạng thái đơn hàng
    updateStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const updatedOrder = await orderModel.updateOrderStatus(req.params.id, status);

            if (!updatedOrder) {
                return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật trạng thái đơn hàng thành công',
                data: updatedOrder
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng' });
        }
    },

    // Xóa đơn hàng
    delete: async (req, res) => {
        try {
            const deletedOrder = await orderModel.deleteOrder(req.params.id);

            if (!deletedOrder) {
                return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa đơn hàng thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa đơn hàng' });
        }
    },

    // Thêm chi tiết đơn hàng
    addOrderDetail: async (req, res) => {
        try {
            const detailData = { ...req.body, idDH: req.params.id };
            const newDetail = await orderModel.addOrderDetail(detailData);
            res.status(201).json({
                success: true,
                message: 'Thêm chi tiết đơn hàng thành công',
                data: newDetail
            });
        } catch (error) {
            console.error('Lỗi thêm chi tiết đơn hàng:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi thêm chi tiết đơn hàng' });
        }
    },

    // Lấy đơn hàng theo trạng thái
    getByStatus: async (req, res) => {
        try {
            const orders = await orderModel.getOrdersByStatus(req.params.status);
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy đơn hàng theo khách hàng
    getByCustomer: async (req, res) => {
        try {
            const orders = await orderModel.getOrdersByCustomer(req.params.customerId);
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy thống kê đơn hàng
    getStats: async (req, res) => {
        try {
            const stats = await orderModel.getOrderStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy doanh thu theo tháng
    getMonthlyRevenue: async (req, res) => {
        try {
            const year = req.params.year || new Date().getFullYear();
            const revenue = await orderModel.getMonthlyRevenue(year);
            res.status(200).json({ success: true, data: revenue });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = orderController;