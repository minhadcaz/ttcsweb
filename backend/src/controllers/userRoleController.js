const bcrypt = require('bcrypt');
const userRoleModel = require('../models/userRoleModel');

const userRoleController = {
    // Lấy tất cả người dùng
    getAllUsers: async (req, res) => {
        try {
            const users = await userRoleModel.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error('Lỗi lấy danh sách người dùng:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy người dùng theo ID
    getUserById: async (req, res) => {
        try {
            const user = await userRoleModel.getUserById(req.params.id);
            if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo người dùng mới
    createUser: async (req, res) => {
        try {
            const newUser = await userRoleModel.createUser(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo người dùng thành công',
                data: newUser
            });
        } catch (error) {
            console.error('Lỗi tạo người dùng:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo người dùng' });
        }
    },

    // Cập nhật người dùng
    updateUser: async (req, res) => {
        try {
            const updatedUser = await userRoleModel.updateUser(req.params.id, req.body);

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật người dùng thành công',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật người dùng' });
        }
    },

    // Cập nhật mật khẩu
    updatePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            if (!newPassword || String(newPassword).trim().length < 6) {
                return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
            }

            const hashedPassword = await bcrypt.hash(String(newPassword), 10);
            const updatedUser = await userRoleModel.updatePassword(req.params.id, hashedPassword);

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật mật khẩu thành công'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật mật khẩu' });
        }
    },

    // Xóa người dùng
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await userRoleModel.deleteUser(req.params.id);

            if (!deletedUser) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa người dùng' });
        }
    },

    // Lấy người dùng theo vai trò
    getUsersByRole: async (req, res) => {
        try {
            const users = await userRoleModel.getUsersByRole(req.params.roleId);
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy tất cả vai trò
    getAllRoles: async (req, res) => {
        try {
            const roles = await userRoleModel.getAllRoles();
            res.status(200).json({ success: true, data: roles });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy vai trò theo ID
    getRoleById: async (req, res) => {
        try {
            const role = await userRoleModel.getRoleById(req.params.id);
            if (!role) return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò!' });
            res.status(200).json({ success: true, data: role });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Tạo vai trò mới
    createRole: async (req, res) => {
        try {
            const newRole = await userRoleModel.createRole(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo vai trò thành công',
                data: newRole
            });
        } catch (error) {
            console.error('Lỗi tạo vai trò:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo vai trò' });
        }
    },

    // Cập nhật vai trò
    updateRole: async (req, res) => {
        try {
            const updatedRole = await userRoleModel.updateRole(req.params.id, req.body);

            if (!updatedRole) {
                return res.status(404).json({ success: false, message: 'Vai trò không tồn tại' });
            }

            res.status(200).json({
                success: true,
                message: 'Cập nhật vai trò thành công',
                data: updatedRole
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật vai trò' });
        }
    },

    // Xóa vai trò
    deleteRole: async (req, res) => {
        try {
            const deletedRole = await userRoleModel.deleteRole(req.params.id);

            if (!deletedRole) {
                return res.status(404).json({ success: false, message: 'Vai trò không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa vai trò thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa vai trò' });
        }
    },

    // Lấy quyền hạn của vai trò
    getRolePermissions: async (req, res) => {
        try {
            const permissions = await userRoleModel.getRolePermissions(req.params.roleId);
            res.status(200).json({ success: true, data: permissions });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Kiểm tra quyền hạn của người dùng
    checkUserPermission: async (req, res) => {
        try {
            const { permission } = req.query;
            const hasPermission = await userRoleModel.checkUserPermission(req.params.userId, permission);
            res.status(200).json({ success: true, data: { hasPermission } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userRoleModel.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
            }

            const isMatch = await bcrypt.compare(String(password || ''), user.pass || '');
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
            }

            if (user.tinhtrang !== 'Hoat dong') {
                return res.status(401).json({ success: false, message: 'Tài khoản đã bị khóa' });
            }

            // Không trả mật khẩu trong response
            const { pass, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: userWithoutPassword
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // Lấy thống kê người dùng
    getUserStats: async (req, res) => {
        try {
            const stats = await userRoleModel.getUserStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }
};

module.exports = userRoleController;