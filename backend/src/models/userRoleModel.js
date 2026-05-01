const db = require('../config/db');

const userRoleModel = {
    // Lấy tất cả người dùng với vai trò
    getAllUsers: async () => {
        const sql = `
            SELECT nv.*, vt.tenVT as role_name, vt.moTa as role_description
            FROM NhanVien nv
            LEFT JOIN VaiTro vt ON nv.idVT = vt.idVT
            ORDER BY nv.tenNV
        `;
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy người dùng theo ID
    getUserById: async (id) => {
        const sql = `
            SELECT nv.*, vt.tenVT as role_name, vt.moTa as role_description
            FROM NhanVien nv
            LEFT JOIN VaiTro vt ON nv.idVT = vt.idVT
            WHERE nv.idNV = $1
        `;
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Tạo người dùng mới (nhân viên)
    createUser: async (userData) => {
        const {
            idNV, idVT, tenNV, email, matKhau, sdt,
            diaChi, ngaySinh, ngayVaoLam, luong, trangThai
        } = userData;

        const sql = `
            INSERT INTO NhanVien (
                idNV, idVT, tenNV, email, matKhau, sdt,
                diaChi, ngaySinh, ngayVaoLam, luong, trangThai
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idNV, idVT, tenNV, email, matKhau, sdt,
            diaChi, ngaySinh, ngayVaoLam, luong, trangThai
        ]);
        return rows[0];
    },

    // Cập nhật người dùng
    updateUser: async (id, userData) => {
        const {
            idVT, tenNV, email, sdt, diaChi, ngaySinh,
            ngayVaoLam, luong, trangThai
        } = userData;

        const sql = `
            UPDATE NhanVien SET
                idVT = $1, tenNV = $2, email = $3, sdt = $4, diaChi = $5,
                ngaySinh = $6, ngayVaoLam = $7, luong = $8, trangThai = $9
            WHERE idNV = $10
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            idVT, tenNV, email, sdt, diaChi, ngaySinh,
            ngayVaoLam, luong, trangThai, id
        ]);
        return rows[0];
    },

    // Cập nhật mật khẩu
    updatePassword: async (id, newPassword) => {
        const sql = 'UPDATE NhanVien SET matKhau = $1 WHERE idNV = $2 RETURNING *';
        const { rows } = await db.query(sql, [newPassword, id]);
        return rows[0];
    },

    // Xóa người dùng
    deleteUser: async (id) => {
        const sql = 'DELETE FROM NhanVien WHERE idNV = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy người dùng theo vai trò
    getUsersByRole: async (roleId) => {
        const sql = `
            SELECT nv.*, vt.tenVT as role_name
            FROM NhanVien nv
            LEFT JOIN VaiTro vt ON nv.idVT = vt.idVT
            WHERE nv.idVT = $1
            ORDER BY nv.tenNV
        `;
        const { rows } = await db.query(sql, [roleId]);
        return rows;
    },

    // Lấy tất cả vai trò
    getAllRoles: async () => {
        const sql = 'SELECT * FROM VaiTro ORDER BY tenVT';
        const { rows } = await db.query(sql);
        return rows;
    },

    // Lấy vai trò theo ID
    getRoleById: async (id) => {
        const sql = 'SELECT * FROM VaiTro WHERE idVT = $1';
        const { rows } = await db.query(sql, [id]);
        return rows[0];
    },

    // Tạo vai trò mới
    createRole: async (roleData) => {
        const { idVT, tenVT, moTa, quyenHan } = roleData;

        const sql = `
            INSERT INTO VaiTro (idVT, tenVT, moTa, quyenHan)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [idVT, tenVT, moTa, quyenHan]);
        return rows[0];
    },

    // Cập nhật vai trò
    updateRole: async (id, roleData) => {
        const { tenVT, moTa, quyenHan } = roleData;

        const sql = `
            UPDATE VaiTro SET tenVT = $1, moTa = $2, quyenHan = $3
            WHERE idVT = $4
            RETURNING *
        `;
        const { rows } = await db.query(sql, [tenVT, moTa, quyenHan, id]);
        return rows[0];
    },

    // Xóa vai trò
    deleteRole: async (id) => {
        const sql = 'DELETE FROM VaiTro WHERE idVT = $1 RETURNING *';
        const { rows } = await db.query(sql, [id]);
        return rows.length > 0;
    },

    // Lấy quyền hạn của vai trò
    getRolePermissions: async (roleId) => {
        const sql = 'SELECT quyenHan FROM VaiTro WHERE idVT = $1';
        const { rows } = await db.query(sql, [roleId]);
        return rows[0]?.quyenHan || {};
    },

    // Kiểm tra quyền hạn của người dùng
    checkUserPermission: async (userId, permission) => {
        const sql = `
            SELECT vt.quyenHan
            FROM NhanVien nv
            LEFT JOIN VaiTro vt ON nv.idVT = vt.idVT
            WHERE nv.idNV = $1
        `;
        const { rows } = await db.query(sql, [userId]);

        if (rows.length === 0) return false;

        const permissions = rows[0].quyenHan || {};
        return permissions[permission] === true;
    },

    // Đăng nhập (tìm người dùng theo email)
    findUserByEmail: async (email) => {
        const sql = `
            SELECT nv.*, vt.tenVT as role_name, vt.quyenHan as permissions
            FROM NhanVien nv
            LEFT JOIN VaiTro vt ON nv.idVT = vt.idVT
            WHERE nv.email = $1
        `;
        const { rows } = await db.query(sql, [email]);
        return rows[0];
    },

    // Thống kê người dùng
    getUserStats: async () => {
        const sql = `
            SELECT
                COUNT(*) as total_users,
                COUNT(CASE WHEN trangThai = 'active' THEN 1 END) as active_users,
                COUNT(CASE WHEN trangThai = 'inactive' THEN 1 END) as inactive_users,
                COUNT(DISTINCT idVT) as total_roles
            FROM NhanVien
        `;
        const { rows } = await db.query(sql);
        return rows[0];
    }
};

module.exports = userRoleModel;