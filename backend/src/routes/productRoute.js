const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// READ (Lấy dữ liệu)
router.get('/', productController.getAll);           
router.get('/:id', productController.getById);       

// CREATE (Thêm mới)
router.post('/', productController.create);          

// UPDATE (Cập nhật)
router.put('/:id', productController.update);        

// DELETE (Xóa)
router.delete('/:id', productController.delete);     

module.exports = router;