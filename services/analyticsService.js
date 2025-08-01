const { clickhouse } = require('./clickhouse');
const { s3 } = require('./s3');
const process = require('process');

// Insert functions
const insertPageViewService = async (event) => {
    try {
        const result = await clickhouse
            .insert('INSERT INTO page_views (session_id, event_type, timestamp, page_url)', [event])
            .toPromise();
        return result
    } catch (error) {
        console.error("Error inserting into page_views:", error);
        throw error;
    }
};

const insertClickService = async (event) => {
    try {
        const result = await clickhouse
            .insert('INSERT INTO clicks (session_id, event_type, timestamp, page_url, element_id, element_class)', [event])
            .toPromise();
        return result
    } catch (error) {
        console.error("Error inserting into clicks:", error);
        throw error;
    }
};

const insertScrollDepthService = async (event) => {
    try {
        const result = await clickhouse
            .insert('INSERT INTO scroll_depth (session_id, event_type, timestamp, page_url, scroll_depth)', [event])
            .toPromise();
        return result
    } catch (error) {
        console.error("Error inserting into scroll_depth:", error);
        throw error;
    }
};

// Fetch and save to S3
const uploadDashboardDataToBUcketService = async () => {
    try {
        // Execute all 3 queries concurrently
        const [pageViewsResult, clicksResult, scrollDepthsResult] = await Promise.all([
            clickhouse.query('SELECT * FROM page_views ORDER BY timestamp DESC LIMIT 50').toPromise(),
            clickhouse.query('SELECT * FROM clicks ORDER BY timestamp DESC LIMIT 50').toPromise(),
            clickhouse.query('SELECT * FROM scroll_depth ORDER BY timestamp DESC LIMIT 50').toPromise()
        ]);

        // Parse each result to get the `.data` field
        const pageViews = pageViewsResult || [];
        const clicks = clicksResult || [];
        const scrollDepths = scrollDepthsResult || [];

        // Check if all are empty
        if (!pageViews.length && !clicks.length && !scrollDepths.length) {
            throw new Error('No data found in ClickHouse tables');
        }

        // Combine all into a single object
        const combinedData = { pageViews, clicks, scrollDepths };
        console.log('combined Data in fetchDashboardData', combinedData)
        // Create a unique key for the S3 object
        const s3Key = `analytics-dashboard/${Date.now()}.json`;
        console.log(`Uploading dashboard data to S3 as: ${s3Key}`);

        // Upload to S3
        await s3.putObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: JSON.stringify(combinedData),
            ContentType: 'application/json',
        }).promise();
        return { message: 'Dashboard data saved to S3', s3Key };

    } catch (error) {
        console.error('Error fetching dashboard data or uploading to S3:', error);
        throw error;
    }
};


// Helper fetch functions
const getPageViewsService = async () => {
    console.log('Connecting to ClickHouse at getPageViewsService', process.env.CLICKHOUSE_URL);
    const result = await clickhouse.query('SELECT * FROM page_views ORDER BY timestamp DESC LIMIT 50').toPromise();
    console.log('getPageViewsService result', result)
    return result || [];
};

const getClicksService = async () => {
    console.log('Connecting to ClickHouse at getClicksService', process.env.CLICKHOUSE_URL);
    const result = await clickhouse.query('SELECT * FROM clicks ORDER BY timestamp DESC LIMIT 50').toPromise();
    console.log('getClicksService result', result)
    return result || [];
};

const getScrollDepthsService = async () => {
    console.log('Connecting to ClickHouse at getScrollDepthsService', process.env.CLICKHOUSE_URL);
    const result = await clickhouse.query('SELECT * FROM scroll_depth ORDER BY timestamp DESC LIMIT 50').toPromise();
    console.log('getScrollDepthsService result', result)
    return result || [];
};

module.exports = {
    insertPageViewService,
    insertClickService,
    insertScrollDepthService,
    uploadDashboardDataToBUcketService,
    getPageViewsService,
    getClicksService,
    getScrollDepthsService,
};
