const db = require('../config/db');
const crypto = require('crypto');
const { resolveQuantityColumn } = require('../utils/columnResolver');

const generateIdTK = () => `TK-${crypto.randomBytes(6).toString('hex')}`;

const normalizeProductId = (productId) => {
    if (productId === undefined || productId === null) return null;
    const value = String(productId).trim();
    return value || null;
};

const ensureProductExists = async (productId) => {
    const normalizedId = normalizeProductId(productId);
    if (!normalizedId) {
        throw new Error('Thiếu mã sản phẩm để cập nhật tồn kho');
    }

    const existingProduct = await db.query('SELECT idSP FROM SanPham WHERE idSP = $1', [normalizedId]);
    if (existingProduct.rows.length === 0) {
        throw new Error(`Sản phẩm ${normalizedId} không tồn tại`);
    }

    return normalizedId;
};

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
        const targetProductId = await ensureProductExists(productId);
        const { donVi, soLuong } = inventoryData;
        const quantityColumn = await resolveQuantityColumn('TonKho');

        const existing = await db.query('SELECT idTK FROM TonKho WHERE idSP = $1', [targetProductId]);
        if (existing.rows.length > 0) {
            const sql = `
                UPDATE TonKho SET
                    donVi = $1,
                    ${quantityColumn} = $2
                WHERE idSP = $3
                RETURNING *
            `;
            const { rows } = await db.query(sql, [donVi || 'cái', soLuong || 0, targetProductId]);
            return rows[0];
        }

        const sql = `
            INSERT INTO TonKho (idTK, idSP, donVi, ${quantityColumn})
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            generateIdTK(), targetProductId, donVi || 'cái', soLuong || 0
        ]);
        return rows[0];
    },

    // Nhập hàng vào kho
    addStock: async (productId, quantity, supplierId = null) => {
        const targetProductId = await ensureProductExists(productId);
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const existing = await db.query(`SELECT idTK, ${quantityColumn} FROM TonKho WHERE idSP = $1`, [targetProductId]);
        let inventoryResult;

        if (existing.rows.length > 0) {
            const sql = `
                UPDATE TonKho SET
                    ${quantityColumn} = ${quantityColumn} + $1
                WHERE idSP = $2
                RETURNING *
            `;
            const { rows } = await db.query(sql, [quantity, targetProductId]);
            inventoryResult = rows[0];
        } else {
            const sql = `
                INSERT INTO TonKho (idTK, idSP, donVi, ${quantityColumn})
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const { rows } = await db.query(sql, [
                generateIdTK(), targetProductId, 'cái', quantity
            ]);
            inventoryResult = rows[0];
        }

        if (supplierId) {
            await db.query(`
                INSERT INTO LichSuNhapXuat (idSP, loaiGiaoDich, soLuong, idNCC, ngayGiaoDich)
                VALUES ($1, 'import', $2, $3, CURRENT_TIMESTAMP)
            `, [targetProductId, quantity, supplierId]);
        }

        return inventoryResult;
    },

    // Xuất hàng khỏi kho
    removeStock: async (productId, quantity, reason = 'sale') => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const checkSql = `SELECT ${quantityColumn} FROM TonKho WHERE idSP = $1`;
        const checkResult = await db.query(checkSql, [productId]);

        const available = Number(checkResult.rows[0]?.[quantityColumn.replace(/"/g, '')] ?? checkResult.rows[0]?.soluong ?? checkResult.rows[0]?.SoLuong ?? 0);

        if (checkResult.rows.length === 0 || available < quantity) {
            throw new Error('Insufficient stock');
        }

        const inventoryResult = await db.query(`
            UPDATE TonKho SET
                ${quantityColumn} = ${quantityColumn} - $2
            WHERE idSP = $1
            RETURNING *
        `, [productId, quantity]);

        await db.query(`
            INSERT INTO LichSuNhapXuat (idSP, loaiGiaoDich, soLuong, moTa, ngayGiaoDich)
            VALUES ($1, 'export', $2, $3, CURRENT_TIMESTAMP)
        `, [productId, quantity, reason]);

        return inventoryResult.rows[0];
    },

    // Lấy sản phẩm sắp hết hàng
    getLowStockProducts: async (threshold = 10) => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT tk.*, sp.tenSP as product_name, sp.gianiemyet as unit_price,
                   lsp.nameCate as category_name
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            WHERE tk.${quantityColumn} <= $1 AND tk.${quantityColumn} > 0
            ORDER BY tk.${quantityColumn} ASC
        `;
        const { rows } = await db.query(sql, [threshold]);
        return rows;
    },

    // Lấy sản phẩm hết hàng
    getOutOfStockProducts: async () => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT sp.*, lsp.nameCate as category_name, nsx.TenNSX as manufacturer_name
            FROM SanPham sp
            LEFT JOIN LoaiSanPham lsp ON sp.IdCate = lsp.IdCate
            LEFT JOIN NhaSanXuat nsx ON sp.IdNSX = nsx.IdNSX
            LEFT JOIN TonKho tk ON sp.idSP = tk.idSP
            WHERE tk.idSP IS NULL OR tk.${quantityColumn} = 0
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
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT
                COUNT(DISTINCT tk.idSP) as total_products_in_stock,
                SUM(tk.${quantityColumn}) as total_stock_quantity,
                SUM(tk.${quantityColumn} * sp.gianiemyet) as total_stock_value,
                AVG(tk.${quantityColumn}) as avg_stock_per_product
            FROM TonKho tk
            LEFT JOIN SanPham sp ON tk.idSP = sp.idSP
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    },

    // Báo cáo tồn kho theo danh mục
    getInventoryByCategory: async () => {
        const quantityColumn = await resolveQuantityColumn('TonKho');
        const sql = `
            SELECT
                lsp.nameCate as category_name,
                COUNT(sp.idSP) as product_count,
                SUM(tk.${quantityColumn}) as total_stock,
                SUM(tk.${quantityColumn} * sp.gianiemyet) as total_value
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