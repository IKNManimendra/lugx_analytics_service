const express = require('express');
const router = express.Router();

const {
    insertPageView,
    insertClick,
    insertScrollDepth,
    uploadDashboardData,
    getPageViews,
    getClicks,
    getScrollDepths
} = require('../controllers/analyticsController');

router.post('/page-view', insertPageView);
router.post('/click', insertClick);
router.post('/scroll-depth', insertScrollDepth);
router.get('/fetchDashboardData', uploadDashboardData);
router.get('/page-view', getPageViews);
router.get('/click', getClicks);
router.get('/scroll-depth', getScrollDepths)

module.exports = router;
