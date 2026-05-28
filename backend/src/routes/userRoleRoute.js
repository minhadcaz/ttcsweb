const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

// Routes cho người dùng
router.get('/users', userRoleController.getAllUsers);
router.get('/users/role/:roleId', userRoleController.getUsersByRole);
router.get('/users/:id', userRoleController.getUserById);
router.post('/users', userRoleController.createUser);
router.put('/users/:id', userRoleController.updateUser);
router.put('/users/:id/password', userRoleController.updatePassword);
router.delete('/users/:id', userRoleController.deleteUser);

// Routes cho vai trò
router.get('/roles', userRoleController.getAllRoles);
router.get('/roles/:id', userRoleController.getRoleById);
router.post('/roles', userRoleController.createRole);
router.put('/roles/:id', userRoleController.updateRole);
router.delete('/roles/:id', userRoleController.deleteRole);

// Routes cho quyền hạn
router.get('/roles/:roleId/permissions', userRoleController.getRolePermissions);
router.get('/users/:userId/check-permission', userRoleController.checkUserPermission);

// Routes cho xác thực
router.post('/login', userRoleController.login);

// Routes cho thống kê
router.get('/stats', userRoleController.getUserStats);

module.exports = router;