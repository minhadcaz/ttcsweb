const db = require('../config/db');

const productModel = {
    // Lấy tất cả sản phẩm với thông tin danh mục và nhà sản xuất
    getAllProducts: async () => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            WHERE sp.idSP = $1
        `;
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Thêm sản phẩm mới
    createProduct: async (productData) => {
        const {
            idSP, IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
            tinhTrang, baoHanh, soLuong, giaKM, hinhAnh, thongsokythuat
        } = productData;

        const sql = `
            INSERT INTO SanPham (
                idSP, IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
                tinhTrang, baoHanh, soLuong, giaKM, hinhAnh, thongsokythuat
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idSP,
            IdCate,
            IdNSX,
            tenSP,
            chiTietSP,
            gianiemyet,
            tinhTrang,
            baoHanh,
            soLuong,
            giaKM,
            hinhAnh ? JSON.stringify(hinhAnh) : null,
            thongsokythuat ? JSON.stringify(thongsokythuat) : null
        ]);
        return rows[0];
    },

    // Cập nhật sản phẩm
    updateProduct: async (id, productData) => {
        const {
            IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
            tinhTrang, baoHanh, soLuong, giaKM, hinhAnh, thongsokythuat
        } = productData;

        const sql = `
            UPDATE SanPham SET
                IdCate = $1, IdNSX = $2, tenSP = $3, chiTietSP = $4, gianiemyet = $5,
                tinhTrang = $6, baoHanh = $7, soLuong = $8, giaKM = $9, hinhAnh = $10, thongsokythuat = $11
            WHERE idSP = $12
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            IdCate,
            IdNSX,
            tenSP,
            chiTietSP,
            gianiemyet,
            tinhTrang,
            baoHanh,
            soLuong,
            giaKM,
            hinhAnh ? JSON.stringify(hinhAnh) : null,
            thongsokythuat ? JSON.stringify(thongsokythuat) : null,
            id
        ]);
        return rows[0];
    },

    // Xóa sản phẩm
    deleteProduct: async (id) => {
        const sql = 'DELETE FROM SanPham WHERE idSP = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy sản phẩm theo danh mục
    getProductsByCategory: async (categoryId) => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            WHERE sp.IdCate = $1
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql, [categoryId]);
        return rows;
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (searchTerm) => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            WHERE sp.tenSP ILIKE $1 OR sp.chiTietSP ILIKE $1
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql, [`%${searchTerm}%`]);
        return rows;
    },

    // Lấy thống kê sản phẩm
    getProductStats: async () => {
        const sql = `
            SELECT
                COUNT(*) as total_products,
                SUM(soLuong) as total_stock,
                AVG(gianiemyet) as avg_price,
                MIN(gianiemyet) as min_price,
                MAX(gianiemyet) as max_price
            FROM SanPham
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = productModel;

module.exports = productModel;