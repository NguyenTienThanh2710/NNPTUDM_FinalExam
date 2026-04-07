const express = require('express');
const router = express.Router();
const locations = require('../utils/locations');

router.get('/', (_req, res) => {
    try {
        res.json(locations);
    } catch (_error) {
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu địa lý' });
    }
});

module.exports = router;
