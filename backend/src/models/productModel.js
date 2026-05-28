const db = require('../config/db');
const { resolveQuantityColumn } = require('../utils/columnResolver');

// Helper function to normalize product image data
const normalizeProduct = (product) => {
    if (!product) return product;

    if (product.idsp !== undefined && product.idSP === undefined) {
        product.idSP = product.idsp;
    }

    if (product.idSP !== undefined && product.idsp === undefined) {
        product.idsp = product.idSP;
    }

    const rawImages = product.hinhAnh ?? product.hinhanh;

    if (rawImages !== undefined && rawImages !== null) {
        let normalizedImages = rawImages;

        try {
            if (typeof normalizedImages === 'string') {
                normalizedImages = JSON.parse(normalizedImages);
            }

            if (!Array.isArray(normalizedImages)) {
                normalizedImages = [normalizedImages];
            }
        } catch (err) {
            normalizedImages = [rawImages];
        }

        product.hinhAnh = normalizedImages;
        product.hinhanh = normalizedImages;
    }

    return product;
};

const normalizeProducts = (products) => {
    return products.map(normalizeProduct);
};

const ACTIVE_PRODUCT_CONDITION = "COALESCE(LOWER(sp.tinhtrang), '') <> 'ngung kinh doanh'";

const productModel = {
    // Lấy tất cả sản phẩm với thông tin danh mục và nhà sản xuất
    getAllProducts: async () => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name,
                   COALESCE(tk.${quantityColumn}, 0) as quantity
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
            WHERE ${ACTIVE_PRODUCT_CONDITION}
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql);
        return normalizeProducts(rows);
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name,
                   COALESCE(tk.${quantityColumn}, 0) as quantity
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
            WHERE sp.idSP = $1
        `;
        const { rows } = await db.query(sql, [id]);
        return normalizeProduct(rows[0]);
    },

    // Thêm sản phẩm mới
    createProduct: async (productData) => {
        const {
            idSP, IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
            tinhTrang, baoHanh, giaKM, thongsokythuat
        } = productData;
        
        // Handle both hinhAnh and hinhanh from request body
        const hinhAnh = productData.hinhAnh || productData.hinhanh;

        // Normalize hinhAnh - ensure it's an array
        let normalizedHinhAnh = null;
        if (hinhAnh) {
            if (Array.isArray(hinhAnh)) {
                normalizedHinhAnh = JSON.stringify(hinhAnh);
            } else if (typeof hinhAnh === 'string') {
                try {
                    const parsed = JSON.parse(hinhAnh);
                    normalizedHinhAnh = JSON.stringify(Array.isArray(parsed) ? parsed : [hinhAnh]);
                } catch (err) {
                    normalizedHinhAnh = JSON.stringify([hinhAnh]);
                }
            }
        }

        const sql = `
            INSERT INTO SanPham (
                idSP, IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
                tinhTrang, baoHanh, giaKM, hinhanh, thongsokythuat
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
            giaKM,
            normalizedHinhAnh,
            thongsokythuat ? JSON.stringify(thongsokythuat) : null
        ]);
        return normalizeProduct(rows[0]);
    },

    // Cập nhật sản phẩm
    updateProduct: async (id, productData) => {
        const {
            IdCate, IdNSX, tenSP, chiTietSP, gianiemyet,
            tinhTrang, baoHanh, giaKM, thongsokythuat
        } = productData;
        
        // Handle both hinhAnh and hinhanh from request body
        const hinhAnh = productData.hinhAnh || productData.hinhanh;

        // Normalize hinhAnh - ensure it's an array
        let normalizedHinhAnh = null;
        if (hinhAnh) {
            if (Array.isArray(hinhAnh)) {
                normalizedHinhAnh = JSON.stringify(hinhAnh);
            } else if (typeof hinhAnh === 'string') {
                try {
                    const parsed = JSON.parse(hinhAnh);
                    normalizedHinhAnh = JSON.stringify(Array.isArray(parsed) ? parsed : [hinhAnh]);
                } catch (err) {
                    normalizedHinhAnh = JSON.stringify([hinhAnh]);
                }
            }
        }

        const sql = `
            UPDATE SanPham SET
                IdCate = $1, IdNSX = $2, tenSP = $3, chiTietSP = $4, gianiemyet = $5,
                tinhTrang = $6, baoHanh = $7, giaKM = $8, hinhanh = $9, thongsokythuat = $10
            WHERE idSP = $11
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
            giaKM,
            normalizedHinhAnh,
            thongsokythuat ? JSON.stringify(thongsokythuat) : null,
            id
        ]);
        return normalizeProduct(rows[0]);
    },

    // Xóa sản phẩm
    deleteProduct: async (id) => {
        const sql = `
            UPDATE SanPham
            SET tinhTrang = 'Ngung kinh doanh'
            WHERE idSP = $1
            RETURNING *
        `;
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
            WHERE sp.IdCate = $1 AND ${ACTIVE_PRODUCT_CONDITION}
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql, [categoryId]);
        return normalizeProducts(rows);
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (searchTerm) => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            WHERE ${ACTIVE_PRODUCT_CONDITION}
              AND (sp.tenSP ILIKE $1 OR sp.chiTietSP ILIKE $1)
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql, [`%${searchTerm}%`]);
        return normalizeProducts(rows);
    },

    // Lấy thống kê sản phẩm
    getProductStats: async () => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT
                COUNT(sp.idSP) as total_products,
                SUM(COALESCE(tk.${quantityColumn}, 0)) as total_stock,
                AVG(sp.gianiemyet) as avg_price,
                MIN(sp.gianiemyet) as min_price,
                MAX(sp.gianiemyet) as max_price
            FROM SanPham sp
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = productModel;