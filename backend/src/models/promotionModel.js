const db = require('../config/db');

const promotionModel = {
    // Lấy tất cả khuyến mãi
    getAllPromotions: async () => {
        const sql = `
            SELECT km.*, sp.tenSP as product_name
            FROM KhuyenMai km
            LEFT JOIN SanPham sp ON km.idSP = sp.idSP
            ORDER BY km.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy khuyến mãi theo ID
    getPromotionById: async (id) => {
        const sql = `
            SELECT km.*, sp.tenSP as product_name, sp.gianiemyet as original_price
            FROM KhuyenMai km
            LEFT JOIN SanPham sp ON km.idSP = sp.idSP
            WHERE km.idKM = $1
        `;
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Tạo khuyến mãi mới
    createPromotion: async (promotionData) => {
        const { idKM, idSP, tenKM, moTa, phanTramGiam, giaGiam, ngayBatDau, ngayKetThuc, trangThai } = promotionData;

        const sql = `
            INSERT INTO KhuyenMai (
                idKM, idSP, tenKM, moTa, phanTramGiam, giaGiam,
                ngayBatDau, ngayKetThuc, trangThai
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idKM, idSP, tenKM, moTa, phanTramGiam, giaGiam,
            ngayBatDau, ngayKetThuc, trangThai
        ]);
        return rows[0];
    },

    // Cập nhật khuyến mãi
    updatePromotion: async (id, promotionData) => {
        const { idSP, tenKM, moTa, phanTramGiam, giaGiam, ngayBatDau, ngayKetThuc, trangThai } = promotionData;

        const sql = `
            UPDATE KhuyenMai SET
                idSP = $1, tenKM = $2, moTa = $3, phanTramGiam = $4, giaGiam = $5,
                ngayBatDau = $6, ngayKetThuc = $7, trangThai = $8
            WHERE idKM = $9
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idSP, tenKM, moTa, phanTramGiam, giaGiam,
            ngayBatDau, ngayKetThuc, trangThai, id
        ]);
        return rows[0];
    },

    // Xóa khuyến mãi
    deletePromotion: async (id) => {
        const sql = 'DELETE FROM KhuyenMai WHERE idKM = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy khuyến mãi đang hoạt động
    getActivePromotions: async () => {
        const sql = `
            SELECT km.*, sp.tenSP as product_name, sp.gianiemyet as original_price
            FROM KhuyenMai km
            LEFT JOIN SanPham sp ON km.idSP = sp.idSP
            WHERE km.trangThai = 'active'
            AND km.ngayBatDau <= CURRENT_DATE
            AND km.ngayKetThuc >= CURRENT_DATE
            ORDER BY km.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy khuyến mãi theo sản phẩm
    getPromotionsByProduct: async (productId) => {
        const sql = `
            SELECT km.*, sp.tenSP as product_name
            FROM KhuyenMai km
            LEFT JOIN SanPham sp ON km.idSP = sp.idSP
            WHERE km.idSP = $1
            ORDER BY km.ngayBatDau DESC
        `;
        const { rows } = await db.query(sql, [productId]);
        return rows;
    },

    // Tạo mã giảm giá (Coupon)
    createCoupon: async (couponData) => {
        const { maGiamGia, tenMa, moTa, loaiGiam, giaTriGiam, giaTriToiThieu, soLuongSuDung, ngayBatDau, ngayKetThuc, trangThai } = couponData;

        const sql = `
            INSERT INTO MaGiamGia (
                maGiamGia, tenMa, moTa, loaiGiam, giaTriGiam, giaTriToiThieu,
                soLuongSuDung, ngayBatDau, ngayKetThuc, trangThai
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            maGiamGia, tenMa, moTa, loaiGiam, giaTriGiam, giaTriToiThieu,
            soLuongSuDung, ngayBatDau, ngayKetThuc, trangThai
        ]);
        return rows[0];
    },

    // Lấy tất cả mã giảm giá
    getAllCoupons: async () => {
        const sql = 'SELECT * FROM MaGiamGia ORDER BY ngayBatDau DESC';
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy mã giảm giá theo mã
    getCouponByCode: async (code) => {
        const sql = 'SELECT * FROM MaGiamGia WHERE maGiamGia = $1 AND trangThai = \'active\'';
        const { rows } = await db.query(sql, [code]);
        return rows[0];
    },

    // Cập nhật số lượng sử dụng mã giảm giá
    updateCouponUsage: async (code) => {
        const sql = `
            UPDATE MaGiamGia
            SET soLuongSuDung = soLuongSuDung - 1
            WHERE maGiamGia = $1 AND soLuongSuDung > 0
            RETURNING *
        `;
        const { rows } = await db.query(sql, [code]);
        return rows[0];
    },

    // Thống kê khuyến mãi
    getPromotionStats: async () => {
        const sql = `
            SELECT
                COUNT(CASE WHEN trangThai = 'active' THEN 1 END) as active_promotions,
                COUNT(CASE WHEN trangThai = 'expired' THEN 1 END) as expired_promotions,
                AVG(phanTramGiam) as avg_discount_percent,
                SUM(giaGiam) as total_discount_amount
            FROM KhuyenMai
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = promotionModel;