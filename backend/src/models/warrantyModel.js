const db = require('../config/db');

const warrantyModel = {
    // Lấy tất cả bảo hành
    getAllWarranties: async () => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name, kh.tenKH as customer_name, kh.sdt as customer_phone
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            ORDER BY bh.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy bảo hành theo ID
    getWarrantyById: async (id) => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name, sp.chiTietSP, kh.tenKH as customer_name,
                   kh.email as customer_email, kh.sdt as customer_phone, kh.diaChi as customer_address
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            WHERE bh.idBH = $1
        `;
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Tạo bảo hành mới
    createWarranty: async (warrantyData) => {
        const {
            idBH, idSP, idKH, idDH, ngayBatDau, ngayKetThuc,
            moTaLoi, trangThai, ghiChu
        } = warrantyData;

        const sql = `
            INSERT INTO BaoHanh (
                idBH, idSP, idKH, idDH, ngayBatDau, ngayKetThuc,
                moTaLoi, trangThai, ghiChu
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idBH, idSP, idKH, idDH, ngayBatDau, ngayKetThuc,
            moTaLoi, trangThai, ghiChu
        ]);
        return rows[0];
    },

    // Cập nhật bảo hành
    updateWarranty: async (id, warrantyData) => {
        const { moTaLoi, trangThai, ghiChu, ngayKetThuc } = warrantyData;

        const sql = `
            UPDATE BaoHanh SET
                moTaLoi = $1, trangThai = $2, ghiChu = $3, ngayKetThuc = $4
            WHERE idBH = $5
            RETURNING *
        `;
        const { rows } = await db.query(sql, [moTaLoi, trangThai, ghiChu, ngayKetThuc, id]);
        return rows[0];
    },

    // Xóa bảo hành
    deleteWarranty: async (id) => {
        const sql = 'DELETE FROM BaoHanh WHERE idBH = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy bảo hành theo khách hàng
    getWarrantiesByCustomer: async (customerId) => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            WHERE bh.idKH = $1
            ORDER BY bh.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql, [customerId]);
        return rows;
    },

    // Lấy bảo hành theo sản phẩm
    getWarrantiesByProduct: async (productId) => {
        const sql = `
            SELECT bh.*, kh.tenKH as customer_name, kh.sdt as customer_phone
            FROM BaoHanh bh
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            WHERE bh.idSP = $1
            ORDER BY bh.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql, [productId]);
        return rows;
    },

    // Lấy bảo hành theo trạng thái
    getWarrantiesByStatus: async (status) => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name, kh.tenKH as customer_name
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            WHERE bh.trangThai = $1
            ORDER BY bh.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql, [status]);
        return rows;
    },

    // Lấy bảo hành sắp hết hạn
    getExpiringWarranties: async (days = 30) => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name, kh.tenKH as customer_name, kh.sdt as customer_phone
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            WHERE bh.trangThai = 'active'
            AND bh.ngayKetThuc <= CURRENT_DATE + INTERVAL '${days} days'
            AND bh.ngayKetThuc >= CURRENT_DATE
            ORDER BY bh.ngayKetThuc ASC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy bảo hành đã hết hạn
    getExpiredWarranties: async () => {
        const sql = `
            SELECT bh.*, sp.tenSP as product_name, kh.tenKH as customer_name, kh.sdt as customer_phone
            FROM BaoHanh bh
            LEFT JOIN SanPham sp ON bh.idSP = sp.idSP
            LEFT JOIN KhachHang kh ON bh.idKH = kh.idKH
            WHERE bh.trangThai = 'active'
            AND bh.ngayKetThuc < CURRENT_DATE
            ORDER BY bh.ngayKetThuc DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Gia hạn bảo hành
    extendWarranty: async (id, newEndDate) => {
        const sql = `
            UPDATE BaoHanh SET
                ngayKetThuc = $1,
                ghiChu = CONCAT(ghiChu, ' - Gia hạn đến ', $1)
            WHERE idBH = $2
            RETURNING *
        `;
        const { rows } = await db.query(sql, [newEndDate, id]);
        return rows[0];
    },

    // Thống kê bảo hành
    getWarrantyStats: async () => {
        const sql = `
            SELECT
                COUNT(*) as total_warranties,
                COUNT(CASE WHEN trangThai = 'active' THEN 1 END) as active_warranties,
                COUNT(CASE WHEN trangThai = 'completed' THEN 1 END) as completed_warranties,
                COUNT(CASE WHEN trangThai = 'expired' THEN 1 END) as expired_warranties,
                AVG(EXTRACT(DAY FROM (ngayKetThuc - ngayBatDau))) as avg_warranty_days
            FROM BaoHanh
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = warrantyModel;