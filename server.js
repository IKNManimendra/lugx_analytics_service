require('dotenv').config();
const express = require('express');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Analytics Service is running');
});

// Mount routes
app.use('/api', analyticsRoutes);

app.listen(port, () => {
    console.log(`Analytics Service running on port ${port}`);
});
