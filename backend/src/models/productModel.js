const db = require('../config/db');

const productModel = {
    // 1. READ ALL (Lấy danh sách)
    getAllProducts: async () => {
        const sql = 'SELECT * FROM LinhKien ORDER BY MaLK DESC';
        const { rows } = await db.query(sql);
        return rows;
    },

    // 2. READ ONE (Lấy chi tiết 1 sản phẩm)
    getProductById: async (id) => {
        const sql = 'SELECT * FROM LinhKien WHERE MaLK = $1';
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // 3. CREATE (Thêm mới)
    createProduct: async (productData) => {
        const { TenLK, MaLoai, GiaBan, Socket, ThongSo } = productData;
        const sql = `
            INSERT INTO LinhKien (TenLK, MaLoai, GiaBan, Socket, ThongSo) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *; -- Trả về sản phẩm vừa tạo
        `;
        const { rows } = await db.query(sql, [TenLK, MaLoai, GiaBan, Socket, ThongSo]);
        return rows[0];
    },

    // 4. UPDATE (Sửa)
    updateProduct: async (id, productData) => {
        const { TenLK, MaLoai, GiaBan, Socket, ThongSo } = productData;
        const sql = `
            UPDATE LinhKien 
            SET TenLK = $1, MaLoai = $2, GiaBan = $3, Socket = $4, ThongSo = $5 
            WHERE MaLK = $6 
            RETURNING *;
        `;
        const { rows } = await db.query(sql, [TenLK, MaLoai, GiaBan, Socket, ThongSo, id]);
        return rows[0];
    },

    // 5. DELETE (Xóa)
    deleteProduct: async (id) => {
        const sql = 'DELETE FROM LinhKien WHERE MaLK = $1 RETURNING *;';
        const { rows } = await db.query(sql, [id]);
        return rows[0]; // Trả về undefined nếu không có gì để xóa
    }
};

module.exports = productModel;