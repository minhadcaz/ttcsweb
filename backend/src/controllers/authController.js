const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.idusers,
            userName: user.username,
            roles: user.roles
        },
        process.env.JWT_SECRET || 'supersecretkey',
        { expiresIn: '7d' }
    );
};

const authController = {
    register: async (req, res) => {
        try {
            const { userName, pass, Email, roles } = req.body;

            if (!userName || !pass) {
                return res.status(400).json({ success: false, message: 'userName và pass là bắt buộc.' });
            }

            const existingUser = await userModel.findByUserName(userName);
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'userName đã tồn tại.' });
            }

            if (Email) {
                const existingEmail = await userModel.findByEmail(Email);
                if (existingEmail) {
                    return res.status(409).json({ success: false, message: 'Email đã được sử dụng.' });
                }
            }

            const hashedPassword = await bcrypt.hash(pass, 10);
            const newUser = await userModel.createUser({
                idUsers: `user-${crypto.randomUUID()}`,
                userName,
                pass: hashedPassword,
                Email: Email || null,
                tinhTrang: 'Hoat dong',
                roles: roles || 'customer'
            });

            const token = createToken(newUser);

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công.',
                data: {
                    user: newUser,
                    token
                }
            });
        } catch (error) {
            console.error('Lỗi register:', error);
            res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký.' });
        }
    },

    login: async (req, res) => {
        try {
            const { credential, pass } = req.body;

            if (!credential || !pass) {
                return res.status(400).json({ success: false, message: 'credential và pass là bắt buộc.' });
            }

            const user = await userModel.findByUserOrEmail(credential);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc email không đúng.' });
            }

            const isMatch = await bcrypt.compare(pass, user.pass);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác.' });
            }

            await userModel.updateLastActive(user.idusers);
            const token = createToken(user);

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công.',
                data: {
                    user: {
                        idUsers: user.idusers,
                        userName: user.username,
                        Email: user.email,
                        tinhTrang: user.tinhtrang,
                        roles: user.roles,
                        ngayTao: user.ngaytao,
                        hoatdonggannhat: user.hoatdonggannhat
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Lỗi login:', error);
            res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' });
        }
    },

    profile: async (req, res) => {
        try {
            const user = await userModel.getById(req.user.id);
            if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('Lỗi lấy profile:', error);
            res.status(500).json({ success: false, message: 'Lỗi server.' });
        }
    }
};

module.exports = authController;
