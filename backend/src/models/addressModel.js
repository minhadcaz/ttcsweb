const db = require('../config/db');

const addressModel = {
    // Lấy tất cả địa chỉ của user
    getByUserId: async (userId) => {
        const sql = `
            SELECT id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
            FROM addresses
            WHERE user_id = $1
            ORDER BY is_default DESC, created_at DESC
        `;
        const { rows } = await db.query(sql, [userId]);
        return rows;
    },

    // Lấy địa chỉ mặc định của user
    getDefaultByUserId: async (userId) => {
        const sql = `
            SELECT id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
            FROM addresses
            WHERE user_id = $1 AND is_default = TRUE
            LIMIT 1
        `;
        const { rows } = await db.query(sql, [userId]);
        return rows[0];
    },

    // Lấy địa chỉ theo ID
    getById: async (id, userId) => {
        const sql = `
            SELECT id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
            FROM addresses
            WHERE id = $1 AND user_id = $2
        `;
        const { rows } = await db.query(sql, [id, userId]);
        return rows[0];
    },

    // Thêm địa chỉ mới
    create: async (addressData) => {
        const { userId, fullName, phone, street, district, city, postalCode, isDefault } = addressData;

        // Nếu là địa chỉ mặc định, reset các địa chỉ khác của user
        if (isDefault) {
            await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const sql = `
            INSERT INTO addresses (user_id, full_name, phone, street, district, city, postal_code, is_default)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
        `;
        const { rows } = await db.query(sql, [userId, fullName, phone, street, district, city, postalCode, isDefault]);
        return rows[0];
    },

    // Cập nhật địa chỉ
    update: async (id, userId, addressData) => {
        const { fullName, phone, street, district, city, postalCode, isDefault } = addressData;

        // Nếu là địa chỉ mặc định, reset các địa chỉ khác của user
        if (isDefault) {
            await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND id != $2', [userId, id]);
        }

        const sql = `
            UPDATE addresses
            SET full_name = $1, phone = $2, street = $3, district = $4, city = $5, postal_code = $6, is_default = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id = $8 AND user_id = $9
            RETURNING id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
        `;
        const { rows } = await db.query(sql, [fullName, phone, street, district, city, postalCode, isDefault, id, userId]);
        return rows[0];
    },

    // Đặt địa chỉ mặc định
    setDefault: async (id, userId) => {
        // Reset tất cả địa chỉ của user về không mặc định
        await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);

        // Set địa chỉ này thành mặc định
        const sql = `
            UPDATE addresses
            SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING id, user_id, full_name, phone, street, district, city, postal_code, is_default, created_at, updated_at
        `;
        const { rows } = await db.query(sql, [id, userId]);
        return rows[0];
    },

    // Xóa địa chỉ
    delete: async (id, userId) => {
        const sql = 'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id';
        const { rows } = await db.query(sql, [id, userId]);
        return rows.length > 0;
    },

    // Đếm số địa chỉ của user
    countByUserId: async (userId) => {
        const sql = 'SELECT COUNT(*) as count FROM addresses WHERE user_id = $1';
        const { rows } = await db.query(sql, [userId]);
        return parseInt(rows[0].count);
    }
};

module.exports = addressModel;