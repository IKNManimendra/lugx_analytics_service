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
        // Fetch data from ClickHouse
        const [pageViewsResult, clicksResult, scrollDepthsResult] = await Promise.all([
            clickhouse.query('SELECT * FROM page_views ORDER BY timestamp DESC LIMIT 50').toPromise(),
            clickhouse.query('SELECT * FROM clicks ORDER BY timestamp DESC LIMIT 50').toPromise(),
            clickhouse.query('SELECT * FROM scroll_depth ORDER BY timestamp DESC LIMIT 50').toPromise()
        ]);

        const pageViews = pageViewsResult || [];
        const clicks = clicksResult || [];
        const scrollDepths = scrollDepthsResult || [];

        if (!pageViews.length && !clicks.length && !scrollDepths.length) {
            throw new Error('No data found in ClickHouse tables');
        }

        // Merge all rows into a single flat array
        const allEvents = [
            ...pageViews.map(r => ({ ...r, event_type: 'page_view' })),
            ...clicks.map(r => ({ ...r, event_type: 'click' })),
            ...scrollDepths.map(r => ({ ...r, event_type: 'scroll_depth' }))
        ];

        // Convert to newline-delimited JSON
        const ndjson = allEvents.map(record => JSON.stringify(record)).join('\n');

        const s3Key = 'analytics_dummy_data.csv'; // Overwrite same file for QuickSight

        // Upload to S3 (overwrite mode)
        await s3.putObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: ndjson,
            ContentType: 'application/json' // Or 'application/x-ndjson'
        }).promise();

        console.log(`Uploaded ${allEvents.length} records to S3 as ${s3Key}`);
        return { message: 'Real analytics data uploaded to S3 for QuickSight', s3Key };

    } catch (error) {
        console.error('Error uploading real dashboard data:', error);
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
