const db = require('../config/db');

const categoryModel = {
    // Lấy tất cả danh mục
    getAllCategories: async () => {
        const sql = 'SELECT * FROM LoaiSanPham ORDER BY nameCate';
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy danh mục theo ID
    getCategoryById: async (id) => {
        const sql = 'SELECT * FROM LoaiSanPham WHERE IdCate = $1';
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Thêm danh mục mới
    createCategory: async (categoryData) => {
        const { IdCate, nameCate } = categoryData;
        const sql = 'INSERT INTO LoaiSanPham (IdCate, nameCate) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(sql, [IdCate, nameCate]);
        return rows[0];
    },

    // Cập nhật danh mục
    updateCategory: async (id, categoryData) => {
        const { nameCate } = categoryData;
        const sql = 'UPDATE LoaiSanPham SET nameCate = $1 WHERE IdCate = $2 RETURNING *';
        const { rows } = await db.query(sql, [nameCate, id]);
        return rows[0];
    },

    // Xóa danh mục
    deleteCategory: async (id) => {
        const sql = 'DELETE FROM LoaiSanPham WHERE IdCate = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    }
};

module.exports = categoryModel;