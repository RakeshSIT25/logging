
require('dotenv').config();
const logService = require('../src/services/logService');
const { pool } = require('../src/db');

const services = ['auth-service', 'payment-service', 'user-service', 'notification-service'];
const levels = ['info', 'info', 'info', 'warn', 'error'];
const messages = [
    'User logged in',
    'Payment processed successfully',
    'Failed to connect to database',
    'User profile updated',
    'Email sent successfully',
    'Cache miss for key: user:123',
    'Invalid API key provided',
    'Request timeout after 5000ms',
    'Service started on port 3000'
];

const generateLog = async () => {
    const service = services[Math.floor(Math.random() * services.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const meta = { requestId: Math.random().toString(36).substring(7), duration: Math.floor(Math.random() * 1000) };

    try {
        await logService.createLog({ service, level, message, meta });
        console.log(`Created log: [${level.toUpperCase()}] ${service}: ${message}`);
    } catch (err) {
        console.error('Error creating log:', err);
    }
};

const run = async () => {
    console.log('Starting log generation...');
    // Create initial batch
    for (let i = 0; i < 50; i++) {
        await generateLog();
    }

    // Create continuous stream
    setInterval(generateLog, 2000);
};

// Handle cleanup
process.on('SIGINT', async () => {
    await pool.end();
    process.exit();
});

run();
