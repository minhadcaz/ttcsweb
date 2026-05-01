const db = require('../config/db');

const orderModel = {
    // Lấy tất cả đơn hàng với thông tin khách hàng
    getAllOrders: async () => {
        const sql = `
            SELECT dh.*, kh.tenKH, kh.email, kh.sdt
            FROM DonHang dh
            LEFT JOIN KhachHang kh ON dh.idKH = kh.idKH
            ORDER BY dh.ngayDat DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy đơn hàng theo ID với chi tiết
    getOrderById: async (id) => {
        // Lấy thông tin đơn hàng
        const orderSql = `
            SELECT dh.*, kh.tenKH, kh.email, kh.sdt, kh.diaChi
            FROM DonHang dh
            LEFT JOIN KhachHang kh ON dh.idKH = kh.idKH
            WHERE dh.idDH = $1
        `;
        const orderResult = await db.query(orderSql, [id]);
        const order = orderResult.rows[0];

        if (!order) return null;

        // Lấy chi tiết đơn hàng
        const detailsSql = `
            SELECT ctdh.*, sp.tenSP, sp.hinhAnh
            FROM ChiTietDonHang ctdh
            LEFT JOIN SanPham sp ON ctdh.idSP = sp.idSP
            WHERE ctdh.idDH = $1
        `;
        const detailsResult = await db.query(detailsSql, [id]);
        order.details = detailsResult.rows;

        return order;
    },

    // Tạo đơn hàng mới
    createOrder: async (orderData) => {
        const { idDH, idKH, ngayDat, tongTien, trangThai, ghiChu } = orderData;

        const sql = `
            INSERT INTO DonHang (idDH, idKH, ngayDat, tongTien, trangThai, ghiChu)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [idDH, idKH, ngayDat, tongTien, trangThai, ghiChu]);
        return rows[0];
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (id, status) => {
        const sql = `
            UPDATE DonHang SET trangThai = $1, ngayCapNhat = CURRENT_TIMESTAMP
            WHERE idDH = $2
            RETURNING *
        `;
        const { rows } = await db.query(sql, [status, id]);
        return rows[0];
    },

    // Xóa đơn hàng
    deleteOrder: async (id) => {
        // Xóa chi tiết đơn hàng trước
        await db.query('DELETE FROM ChiTietDonHang WHERE idDH = $1', [id]);
        // Xóa đơn hàng
        const sql = 'DELETE FROM DonHang WHERE idDH = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Thêm chi tiết đơn hàng
    addOrderDetail: async (detailData) => {
        const { idDH, idSP, soLuong, giaBan, thanhTien } = detailData;

        const sql = `
            INSERT INTO ChiTietDonHang (idDH, idSP, soLuong, giaBan, thanhTien)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [idDH, idSP, soLuong, giaBan, thanhTien]);
        return rows[0];
    },

    // Lấy đơn hàng theo trạng thái
    getOrdersByStatus: async (status) => {
        const sql = `
            SELECT dh.*, kh.tenKH, kh.email
            FROM DonHang dh
            LEFT JOIN KhachHang kh ON dh.idKH = kh.idKH
            WHERE dh.trangThai = $1
            ORDER BY dh.ngayDat DESC
        `;
        const { rows } = await db.query(sql, [status]);
        return rows;
    },

    // Lấy đơn hàng theo khách hàng
    getOrdersByCustomer: async (customerId) => {
        const sql = `
            SELECT dh.*, kh.tenKH
            FROM DonHang dh
            LEFT JOIN KhachHang kh ON dh.idKH = kh.idKH
            WHERE dh.idKH = $1
            ORDER BY dh.ngayDat DESC
        `;
        const { rows } = await db.query(sql, [customerId]);
        return rows;
    },

    // Thống kê đơn hàng
    getOrderStats: async () => {
        const sql = `
            SELECT
                COUNT(*) as total_orders,
                SUM(tongTien) as total_revenue,
                AVG(tongTien) as avg_order_value,
                COUNT(CASE WHEN trangThai = 'completed' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN trangThai = 'pending' THEN 1 END) as pending_orders
            FROM DonHang
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    },

    // Lấy doanh thu theo tháng
    getMonthlyRevenue: async (year) => {
        const sql = `
            SELECT
                EXTRACT(MONTH FROM ngayDat) as month,
                SUM(tongTien) as revenue,
                COUNT(*) as order_count
            FROM DonHang
            WHERE EXTRACT(YEAR FROM ngayDat) = $1 AND trangThai = 'completed'
            GROUP BY EXTRACT(MONTH FROM ngayDat)
            ORDER BY month
        `;
        const { rows } = await db.query(sql, [year]);
        return rows;
    }
};

module.exports = orderModel;