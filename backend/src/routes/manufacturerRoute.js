const express = require('express');
const manufacturerModel = require('../models/manufacturerModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const manufacturers = await manufacturerModel.getAllManufacturers();
        res.status(200).json({ success: true, data: manufacturers });
    } catch (error) {
        console.error('Lỗi lấy danh sách nhà sản xuất:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

module.exports = router;