const locations = require('../data/locations');

/**
 * @desc    Get all locations data
 * @route   GET /api/locations
 * @access  Public
 */
const getLocations = (req, res) => {
    try {
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu địa lý' });
    }
};

module.exports = { getLocations };
