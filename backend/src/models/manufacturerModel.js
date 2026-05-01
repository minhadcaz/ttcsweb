const db = require('../config/db');

const manufacturerModel = {
    // Lấy tất cả nhà sản xuất
    getAllManufacturers: async () => {
        const sql = 'SELECT * FROM NhaSanXuat ORDER BY TenNSX';
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy nhà sản xuất theo ID
    getManufacturerById: async (id) => {
        const sql = 'SELECT * FROM NhaSanXuat WHERE IdNSX = $1';
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Thêm nhà sản xuất mới
    createManufacturer: async (manufacturerData) => {
        const { IdNSX, TenNSX, QuocGia, Website } = manufacturerData;
        const sql = 'INSERT INTO NhaSanXuat (IdNSX, TenNSX, QuocGia, Website) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await db.query(sql, [IdNSX, TenNSX, QuocGia, Website]);
        return rows[0];
    },

    // Cập nhật nhà sản xuất
    updateManufacturer: async (id, manufacturerData) => {
        const { TenNSX, QuocGia, Website } = manufacturerData;
        const sql = 'UPDATE NhaSanXuat SET TenNSX = $1, QuocGia = $2, Website = $3 WHERE IdNSX = $4 RETURNING *';
        const { rows } = await db.query(sql, [TenNSX, QuocGia, Website, id]);
        return rows[0];
    },

    // Xóa nhà sản xuất
    deleteManufacturer: async (id) => {
        const sql = 'DELETE FROM NhaSanXuat WHERE IdNSX = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    }
};

module.exports = manufacturerModel;