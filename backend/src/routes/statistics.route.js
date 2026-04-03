const express = require('express');
const router = express.Router();
const {
    getSummary,
    getRevenueChart,
    getCategoryDistribution,
    getRecentTransactions
} = require('../controllers/statistics.controller');

const { protect, admin } = require('../middleware/auth.middleware');

// All statistics routes are protected and admin only
router.use(protect, admin);

router.get('/summary', getSummary);
router.get('/revenue-chart', getRevenueChart);
router.get('/category-distribution', getCategoryDistribution);
router.get('/recent-transactions', getRecentTransactions);

module.exports = router;
