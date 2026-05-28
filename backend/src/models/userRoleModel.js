const db = require('../config/db');

const ALLOWED_ROLES = ['customer', 'employee', 'admin'];

const userRoleModel = {
    // Lấy tất cả users từ bảng Users
    getAllUsers: async () => {
        const sql = `
            SELECT
                idusers,
                username,
                email,
                tinhtrang,
                roles,
                ngaytao,
                hoatdonggannhat
            FROM Users
            ORDER BY ngaytao DESC
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy user theo ID
    getUserById: async (id) => {
        const sql = `
            SELECT
                idusers,
                username,
                email,
                tinhtrang,
                roles,
                ngaytao,
                hoatdonggannhat
            FROM Users
            WHERE idusers = $1
            LIMIT 1
        `;
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Tạo user mới
    createUser: async (userData) => {
        const {
            idusers,
            username,
            pass,
            email,
            tinhtrang = 'Hoat dong',
            roles = 'customer'
        } = userData;

        const sql = `
            INSERT INTO Users (idusers, username, pass, email, tinhtrang, roles, ngaytao, hoatdonggannhat)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING idusers, username, email, tinhtrang, roles, ngaytao, hoatdonggannhat
        `;
        const { rows } = await db.query(sql, [idusers, username, pass, email || null, tinhtrang, roles]);
        return rows[0];
    },

    // Cập nhật user (ưu tiên role + status cho admin)
    updateUser: async (id, userData) => {
        const existing = await userRoleModel.getUserById(id);
        if (!existing) return null;

        const roles = userData.roles || existing.roles;
        const tinhtrang = userData.tinhtrang || existing.tinhtrang;
        const email = userData.email === undefined ? existing.email : userData.email;

        const sql = `
            UPDATE Users
            SET roles = $1,
                tinhtrang = $2,
                email = $3,
                hoatdonggannhat = NOW()
            WHERE idusers = $4
            RETURNING idusers, username, email, tinhtrang, roles, ngaytao, hoatdonggannhat
        `;
        const { rows } = await db.query(sql, [roles, tinhtrang, email, id]);
        return rows[0];
    },

    // Cập nhật mật khẩu (đã hash từ controller)
    updatePassword: async (id, newPasswordHash) => {
        const sql = `
            UPDATE Users
            SET pass = $1,
                hoatdonggannhat = NOW()
            WHERE idusers = $2
            RETURNING idusers, username, email, tinhtrang, roles, ngaytao, hoatdonggannhat
        `;
        const { rows } = await db.query(sql, [newPasswordHash, id]);
        return rows[0];
    },

    // Xóa user (giữ API cũ, chưa dùng ở UI mới)
    deleteUser: async (id) => {
        const sql = 'DELETE FROM Users WHERE idusers = $1 RETURNING idusers';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy users theo role
    getUsersByRole: async (roleId) => {
        const sql = `
            SELECT
                idusers,
                username,
                email,
                tinhtrang,
                roles,
                ngaytao,
                hoatdonggannhat
            FROM Users
            WHERE roles = $1
            ORDER BY ngaytao DESC
        `;
        const { rows } = await db.query(sql, [roleId]);
        return rows;
    },

    // Danh sách roles cho dropdown admin
    getAllRoles: async () => {
        return ALLOWED_ROLES.map((role) => ({
            idvt: role,
            tenvt: role,
            mota: `Vai trò ${role}`
        }));
    },

    getRoleById: async (id) => {
        if (!ALLOWED_ROLES.includes(id)) return null;
        return {
            idvt: id,
            tenvt: id,
            mota: `Vai trò ${id}`
        };
    },

    createRole: async () => {
        throw new Error('Hệ thống này dùng vai trò cố định, không hỗ trợ tạo role mới.');
    },

    updateRole: async () => {
        throw new Error('Hệ thống này dùng vai trò cố định, không hỗ trợ sửa role.');
    },

    deleteRole: async () => {
        throw new Error('Hệ thống này dùng vai trò cố định, không hỗ trợ xóa role.');
    },

    getRolePermissions: async (roleId) => {
        const role = String(roleId || '').toLowerCase();
        if (role === 'admin') {
            return { manageProducts: true, manageOrders: true, manageUsers: true, viewStats: true };
        }
        if (role === 'employee') {
            return { manageProducts: true, manageOrders: true, manageUsers: false, viewStats: true };
        }
        return { manageProducts: false, manageOrders: false, manageUsers: false, viewStats: false };
    },

    checkUserPermission: async (userId, permission) => {
        const user = await userRoleModel.getUserById(userId);
        if (!user) return false;
        const permissions = await userRoleModel.getRolePermissions(user.roles);
        return permissions[String(permission || '')] === true;
    },

    // Không dùng cho auth chính, vẫn giữ để tương thích route cũ
    findUserByEmail: async (email) => {
        const sql = `
            SELECT idusers, username, email, pass, tinhtrang, roles, ngaytao, hoatdonggannhat
            FROM Users
            WHERE email = $1
            LIMIT 1
        `;
        const { rows } = await db.query(sql, [email]);
        return rows[0];
    },

    getUserStats: async () => {
        const sql = `
            SELECT
                COUNT(*) as total_users,
                COUNT(CASE WHEN tinhtrang = 'Hoat dong' THEN 1 END) as active_users,
                COUNT(CASE WHEN tinhtrang = 'Khong hoat dong' THEN 1 END) as inactive_users,
                COUNT(DISTINCT roles) as total_roles
            FROM Users
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = userRoleModel;
