const productModel = require('../models/productModel');

const productController = {
    // 1. GET /api/products
    getAll: async (req, res) => {
        try {
            const products = await productModel.getAllProducts();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            console.error('Lỗi lấy danh sách:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 2. GET /api/products/:id
    getById: async (req, res) => {
        try {
            const product = await productModel.getProductById(req.params.id);
            if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy!' });
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 3. POST /api/products
    create: async (req, res) => {
        try {
            // req.body chứa dữ liệu JSON Frontend gửi lên
            const newProduct = await productModel.createProduct(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Tạo sản phẩm thành công', 
                data: newProduct 
            });
        } catch (error) {
            console.error('Lỗi tạo sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo sản phẩm' });
        }
    },

    // 4. PUT /api/products/:id
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const updatedProduct = await productModel.updateProduct(id, req.body);
            
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại để sửa' });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Cập nhật thành công', 
                data: updatedProduct 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
        }
    },

    // 5. DELETE /api/products/:id
    delete: async (req, res) => {
        try {
            const deletedProduct = await productModel.deleteProduct(req.params.id);
            
            if (!deletedProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Xóa thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa' });
        }
    }
};

module.exports = productController;