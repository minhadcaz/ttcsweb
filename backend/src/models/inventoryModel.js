const db = require('../config/db');

const inventoryModel = {
    // Lấy tất cả tồn kho
    getAllInventory: async () => {
        const sql = `
            SELECT tk.*, sp.tenSP as product_name, sp.IdCate, lsp.nameCate as category_name,
                   nsx.TenNSX as manufacturer_name, sp.gianiemyet as unit_price
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy tồn kho theo ID sản phẩm
    getInventoryByProductId: async (productId) => {
        const sql = `
            SELECT tk.*, sp.tenSP as product_name, sp.gianiemyet as unit_price
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
            WHERE tk.idSP = $1
        `;
        const { rows } = await db.query(sql, [productId]);
        return rows[0];
    },

    // Cập nhật tồn kho
    updateInventory: async (productId, inventoryData) => {
        const { soLuongTon, soLuongNhap, soLuongXuat, ngayCapNhat } = inventoryData;

        const sql = `
            INSERT INTO TonKho (idSP, soLuongTon, soLuongNhap, soLuongXuat, ngayCapNhat)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (idSP)
            DO UPDATE SET
                soLuongTon = EXCLUDED.soLuongTon,
                soLuongNhap = TonKho.soLuongNhap + EXCLUDED.soLuongNhap,
                soLuongXuat = TonKho.soLuongXuat + EXCLUDED.soLuongXuat,
                ngayCapNhat = EXCLUDED.ngayCapNhat
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            productId, soLuongTon, soLuongNhap || 0, soLuongXuat || 0, ngayCapNhat || new Date()
        ]);
        return rows[0];
    },

    // Nhập hàng vào kho
    addStock: async (productId, quantity, supplierId = null) => {
        // Cập nhật tồn kho
        const inventoryResult = await db.query(`
            INSERT INTO TonKho (idSP, soLuongTon, soLuongNhap, ngayCapNhat)
            VALUES ($1, $2, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (idSP)
            DO UPDATE SET
                soLuongTon = TonKho.soLuongTon + EXCLUDED.soLuongTon,
                soLuongNhap = TonKho.soLuongNhap + EXCLUDED.soLuongTon,
                ngayCapNhat = CURRENT_TIMESTAMP
            RETURNING *
        `, [productId, quantity]);

        // Ghi lại lịch sử nhập hàng
        if (supplierId) {
            await db.query(`
                INSERT INTO LichSuNhapXuat (idSP, loaiGiaoDich, soLuong, idNCC, ngayGiaoDich)
                VALUES ($1, 'import', $2, $3, CURRENT_TIMESTAMP)
            `, [productId, quantity, supplierId]);
        }

        return inventoryResult.rows[0];
    },

    // Xuất hàng khỏi kho
    removeStock: async (productId, quantity, reason = 'sale') => {
        // Kiểm tra tồn kho đủ
        const checkSql = 'SELECT soLuongTon FROM TonKho WHERE idSP = $1';
        const checkResult = await db.query(checkSql, [productId]);

        if (checkResult.rows.length === 0 || checkResult.rows[0].soLuongTon < quantity) {
            throw new Error('Insufficient stock');
        }

        // Cập nhật tồn kho
        const inventoryResult = await db.query(`
            UPDATE TonKho SET
                soLuongTon = soLuongTon - $2,
                soLuongXuat = soLuongXuat + $2,
                ngayCapNhat = CURRENT_TIMESTAMP
            WHERE idSP = $1
            RETURNING *
        `, [productId, quantity]);

        // Ghi lại lịch sử xuất hàng
        await db.query(`
            INSERT INTO LichSuNhapXuat (idSP, loaiGiaoDich, soLuong, moTa, ngayGiaoDich)
            VALUES ($1, 'export', $2, $3, CURRENT_TIMESTAMP)
        `, [productId, quantity, reason]);

        return inventoryResult.rows[0];
    },

    // Lấy sản phẩm sắp hết hàng
    getLowStockProducts: async (threshold = 10) => {
        const sql = `
            SELECT tk.*, sp.tenSP as product_name, sp.gianiemyet as unit_price,
                   lsp.nameCate as category_name
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            WHERE tk.soLuongTon <= $1 AND tk.soLuongTon > 0
            ORDER BY tk.soLuongTon ASC
        `;
        const { rows } = await db.query(sql, [threshold]);
        return rows;
    },

    // Lấy sản phẩm hết hàng
    getOutOfStockProducts: async () => {
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
            WHERE tk.idSP IS NULL OR tk.soLuongTon = 0
            ORDER BY sp.tenSP
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy lịch sử nhập xuất
    getInventoryHistory: async (productId = null, limit = 50) => {
        let sql, params;

        if (productId) {
            sql = `
                SELECT lsnx.*, sp.tenSP as product_name, ncc.tenNCC as supplier_name
                FROM LichSuNhapXuat lsnx
                LEFT JOIN SanPham sp ON lsnx.idSP = sp.idSP
                LEFT JOIN NhaCungCap ncc ON lsnx.idNCC = ncc.idNCC
                WHERE lsnx.idSP = $1
                ORDER BY lsnx.ngayGiaoDich DESC
                LIMIT $2
            `;
            params = [productId, limit];
        } else {
            sql = `
                SELECT lsnx.*, sp.tenSP as product_name, ncc.tenNCC as supplier_name
                FROM LichSuNhapXuat lsnx
                LEFT JOIN SanPham sp ON lsnx.idSP = sp.idSP
                LEFT JOIN NhaCungCap ncc ON lsnx.idNCC = ncc.idNCC
                ORDER BY lsnx.ngayGiaoDich DESC
                LIMIT $1
            `;
            params = [limit];
        }

        const { rows } = await db.query(sql, params);
        return rows;
    },

    // Thống kê tồn kho
    getInventoryStats: async () => {
        const sql = `
            SELECT
                COUNT(DISTINCT tk.idSP) as total_products_in_stock,
                SUM(tk.soLuongTon) as total_stock_quantity,
                SUM(tk.soLuongTon * sp.gianiemyet) as total_stock_value,
                AVG(tk.soLuongTon) as avg_stock_per_product,
                SUM(tk.soLuongNhap) as total_imported,
                SUM(tk.soLuongXuat) as total_exported
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    },

    // Báo cáo tồn kho theo danh mục
    getInventoryByCategory: async () => {
        const sql = `
            SELECT
                lsp.nameCate as category_name,
                COUNT(sp.idSP) as product_count,
                SUM(tk.soLuongTon) as total_stock,
                SUM(tk.soLuongTon * sp.gianiemyet) as total_value
            FROM LoaiSanPham lsp
            LEFT JOIN SanPham sp ON lsp.IdCate = sp.IdCate
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
            GROUP BY lsp.IdCate, lsp.nameCate
            ORDER BY total_value DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy danh sách nhà cung cấp
    getAllSuppliers: async () => {
        const sql = 'SELECT * FROM NhaCungCap ORDER BY tenNCC';
        const { rows } = await db.query(sql);
        return rows;
    },

    // Thêm nhà cung cấp mới
    createSupplier: async (supplierData) => {
        const { idNCC, tenNCC, diaChi, sdt, email } = supplierData;

        const sql = `
            INSERT INTO NhaCungCap (idNCC, tenNCC, diaChi, sdt, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [idNCC, tenNCC, diaChi, sdt, email]);
        return rows[0];
    }
};

module.exports = inventoryModel;