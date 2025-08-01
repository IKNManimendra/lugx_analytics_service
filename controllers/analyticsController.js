const analyticsService = require('../services/analyticsService');

const insertPageView = async (req, res) => {
    try {
        const result = await analyticsService.insertPageViewService(req.body);
        console.log('res in controller insertPageView', result)
        res.status(200).json({ message: 'Page view logged' });
    } catch (error) {
        console.error('Error inserting page view:', error);
        res.status(500).json({ error: 'Failed to insert page view' });
    }
};

const insertClick = async (req, res) => {
    try {
        const result = await analyticsService.insertClickService(req.body);
        console.log('res in controller insertClick', result)
        res.status(200).json({ message: 'Click logged' });
    } catch (error) {
        console.error('Error inserting click:', error);
        res.status(500).json({ error: 'Failed to insert click' });
    }
};

const insertScrollDepth = async (req, res) => {
    try {
        const result = await analyticsService.insertScrollDepthService(req.body);
        console.log('res in controller insertScrollDepth', result)
        res.status(200).json({ message: 'Scroll depth logged' });
    } catch (error) {
        console.error('Error inserting scroll depth:', error);
        res.status(500).json({ error: 'Failed to insert scroll depth' });
    }
};

const uploadDashboardData = async (req, res) => {
    try {
        console.log('req in controller fetchDashboardData', req)
        const result = await analyticsService.uploadDashboardDataToBUcketService();
        console.log('res in controller fetchDashboardData', result)
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

const getPageViews = async (req, res) => {
    try {
        console.log('req in controller getPageViews', req)
        const data = await analyticsService.getPageViewsService();
        console.log('res in controller getPageViews', data)
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching page views:', error);
        res.status(500).json({ error: 'Failed to fetch page views' });
    }
};

const getClicks = async (req, res) => {
    try {
        console.log('req in controller getClicks', req)
        const data = await analyticsService.getClicksService();
        console.log('res in controller getClicks', data)
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching clicks:', error);
        res.status(500).json({ error: 'Failed to fetch clicks' });
    }
};

const getScrollDepths = async (req, res) => {
    try {
        console.log('req in controller getScrollDepths', req)
        const data = await analyticsService.getScrollDepthsService();
        console.log('res in controller getScrollDepths', data)
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching scroll depths:', error);
        res.status(500).json({ error: 'Failed to fetch scroll depths' });
    }
};

module.exports = {
    insertPageView,
    insertClick,
    insertScrollDepth,
    uploadDashboardData,
    getPageViews,
    getClicks,
    getScrollDepths,
};
