const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logRoutes = require('./routes/logRoutes');
const { initializeDB } = require('./db');

const app = express();

app.use(morgan('dev')); // Log requests to console
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api', logRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Initialize DB
initializeDB().catch(err => console.error('Failed to initialize DB', err));

module.exports = app;
