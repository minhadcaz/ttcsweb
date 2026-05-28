const express = require('express');
const categoryModel = require('../models/categoryModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await categoryModel.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Lỗi lấy danh sách danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

module.exports = router;