// const { ClickHouse } = require('clickhouse');

// const clickhouse = new ClickHouse({
//     // url: process.env.CLICKHOUSE_URL,
//     url: 'http://localhost:18123',
//     port: process.env.CLICKHOUSE_PORT,
//     debug: false,
//     basicAuth: {
//         username: process.env.CLICKHOUSE_USER || 'default',
//         password: 'changeme',
//     },
//     isUseGzip: false,
//     format: 'json',
//     config: {
//         database: process.env.CLICKHOUSE_DATABASE || 'lugx_analytics',
//     },
// });

// module.exports = { clickhouse };

const { ClickHouse } = require('clickhouse');

const clickhouse = new ClickHouse({
    url: process.env.CLICKHOUSE_URL,
    // port: process.env.CLICKHOUSE_PORT,
    debug: true,
    basicAuth: {
        username: process.env.CLICKHOUSE_USER || 'default',
        password: process.env.CLICKHOUSE_PASSWORD,
    },
    isUseGzip: false,
    format: 'json',
    config: {
        database: process.env.CLICKHOUSE_DATABASE || 'lugx_analytics',
    },
});

clickhouse.query('SELECT 1').toPromise()
    .then(() => {
        console.log("✅ Connected to ClickHouse at", process.env.CLICKHOUSE_URL || 'http://clickhouse-service:8123');
    })
    .catch(err => {
        console.error("❌ ClickHouse connection failed:", err.message);
    });


module.exports = { clickhouse };