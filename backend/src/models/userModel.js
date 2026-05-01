const db = require('../config/db');

const userModel = {
    findByUserName: async (userName) => {
        const sql = 'SELECT * FROM users WHERE username = $1 LIMIT 1';
        const { rows } = await db.query(sql, [userName]);
        return rows[0];
    },

    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
        const { rows } = await db.query(sql, [email]);
        return rows[0];
    },

    findByUserOrEmail: async (credential) => {
        const sql = 'SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1';
        const { rows } = await db.query(sql, [credential]);
        return rows[0];
    },

    createUser: async (userData) => {
        const { idUsers, userName, pass, Email, tinhTrang, roles } = userData;
        const sql = `
            INSERT INTO users (idusers, username, pass, email, tinhtrang, roles, ngaytao, hoatdonggannhat)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING idusers, username, email, tinhtrang, roles, ngaytao, hoatdonggannhat;
        `;
        const { rows } = await db.query(sql, [idUsers, userName, pass, Email, tinhTrang, roles]);
        return rows[0];
    },

    createCustomer: async (customerData) => {
        const { idKH, idUsers, tenKH } = customerData;
        const sql = `
            INSERT INTO khachhang (idkh, idusers, tenkh)
            VALUES ($1, $2, $3)
            RETURNING idkh, idusers, tenkh;
        `;
        const { rows } = await db.query(sql, [idKH, idUsers, tenKH]);
        return rows[0];
    },

    getById: async (id) => {
        const sql = 'SELECT idusers, username, email, tinhtrang, roles, ngaytao, hoatdonggannhat FROM users WHERE idusers = $1 LIMIT 1';
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    updateLastActive: async (id) => {
        const sql = 'UPDATE users SET hoatdonggannhat = NOW() WHERE idusers = $1';
        await db.query(sql, [id]);
    },

    deleteUserById: async (id) => {
        const sql = 'DELETE FROM users WHERE idusers = $1';
        await db.query(sql, [id]);
    }
};

module.exports = userModel;
