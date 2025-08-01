require('dotenv').config();
const { clickhouse } = require('../services/clickhouse');

async function createTables() {
    try {
        await clickhouse.query(`CREATE DATABASE IF NOT EXISTS lugx_analytics`).toPromise();

        await clickhouse.query(`
            CREATE TABLE IF NOT EXISTS page_views (
                session_id String,
                event_type String,
                timestamp DateTime,
                page_url String
            ) ENGINE = MergeTree()
            ORDER BY (session_id, timestamp)
        `).toPromise();

        await clickhouse.query(`
            CREATE TABLE IF NOT EXISTS clicks (
                session_id String,
                event_type String,
                timestamp DateTime,
                page_url String,
                element_id String,
                element_class String
            ) ENGINE = MergeTree()
            ORDER BY (session_id, timestamp)
        `).toPromise();

        await clickhouse.query(`
            CREATE TABLE IF NOT EXISTS scroll_depth (
                session_id String,
                event_type String,
                timestamp DateTime,
                page_url String,
                scroll_depth UInt8
            ) ENGINE = MergeTree()
            ORDER BY (session_id, timestamp)
        `).toPromise();

        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

createTables();
