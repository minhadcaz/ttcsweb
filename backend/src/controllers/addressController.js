const addressModel = require('../models/addressModel');

const addressController = {
    // Lấy tất cả địa chỉ của user
    getAddresses: async (req, res) => {
        try {
            const userId = req.user.id;

            const addresses = await addressModel.getByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách địa chỉ thành công',
                data: addresses
            });
        } catch (error) {
            console.error('Lỗi lấy danh sách địa chỉ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách địa chỉ'
            });
        }
    },

    // Lấy địa chỉ mặc định của user
    getDefaultAddress: async (req, res) => {
        try {
            const userId = req.user.id;

            const address = await addressModel.getDefaultByUserId(userId);

            if (!address) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ mặc định'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy địa chỉ mặc định thành công',
                data: address
            });
        } catch (error) {
            console.error('Lỗi lấy địa chỉ mặc định:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy địa chỉ mặc định'
            });
        }
    },

    // Lấy chi tiết địa chỉ theo ID
    getAddressById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const address = await addressModel.getById(id, userId);

            if (!address) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lấy thông tin địa chỉ thành công',
                data: address
            });
        } catch (error) {
            console.error('Lỗi lấy thông tin địa chỉ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy thông tin địa chỉ'
            });
        }
    },

    // Thêm địa chỉ mới
    createAddress: async (req, res) => {
        try {
            const userId = req.user.id;
            const { fullName, phone, street, district, city, postalCode, isDefault } = req.body;

            // Validation
            if (!fullName || !phone || !street || !district || !city) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
                });
            }

            // Kiểm tra số lượng địa chỉ tối đa (tùy chọn)
            const addressCount = await addressModel.countByUserId(userId);
            if (addressCount >= 10) {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn chỉ có thể lưu tối đa 10 địa chỉ'
                });
            }

            const newAddress = await addressModel.create({
                userId,
                fullName: fullName.trim(),
                phone: phone.trim(),
                street: street.trim(),
                district: district.trim(),
                city: city.trim(),
                postalCode: postalCode ? postalCode.trim() : null,
                isDefault: isDefault || false
            });

            res.status(201).json({
                success: true,
                message: 'Thêm địa chỉ thành công',
                data: newAddress
            });
        } catch (error) {
            console.error('Lỗi thêm địa chỉ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi thêm địa chỉ'
            });
        }
    },

    // Cập nhật địa chỉ
    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { fullName, phone, street, district, city, postalCode, isDefault } = req.body;

            // Validation
            if (!fullName || !phone || !street || !district || !city) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
                });
            }

            // Kiểm tra địa chỉ có tồn tại không
            const existingAddress = await addressModel.getById(id, userId);
            if (!existingAddress) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ'
                });
            }

            const updatedAddress = await addressModel.update(id, userId, {
                fullName: fullName.trim(),
                phone: phone.trim(),
                street: street.trim(),
                district: district.trim(),
                city: city.trim(),
                postalCode: postalCode ? postalCode.trim() : null,
                isDefault: isDefault || false
            });

            res.status(200).json({
                success: true,
                message: 'Cập nhật địa chỉ thành công',
                data: updatedAddress
            });
        } catch (error) {
            console.error('Lỗi cập nhật địa chỉ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi cập nhật địa chỉ'
            });
        }
    },

    // Đặt địa chỉ mặc định
    setDefaultAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Kiểm tra địa chỉ có tồn tại không
            const existingAddress = await addressModel.getById(id, userId);
            if (!existingAddress) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ'
                });
            }

            const updatedAddress = await addressModel.setDefault(id, userId);

            res.status(200).json({
                success: true,
                message: 'Đặt địa chỉ mặc định thành công',
                data: updatedAddress
            });
        } catch (error) {
            console.error('Lỗi đặt địa chỉ mặc định:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi đặt địa chỉ mặc định'
            });
        }
    },

    // Xóa địa chỉ
    deleteAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Kiểm tra địa chỉ có tồn tại không
            const existingAddress = await addressModel.getById(id, userId);
            if (!existingAddress) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ'
                });
            }

            const deleted = await addressModel.delete(id, userId);

            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: 'Xóa địa chỉ thành công'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Không thể xóa địa chỉ'
                });
            }
        } catch (error) {
            console.error('Lỗi xóa địa chỉ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi xóa địa chỉ'
            });
        }
    }
};

module.exports = addressController;