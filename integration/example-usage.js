const pino = require('pino');
const path = require('path');

// Configure Pino
const logger = pino({
    transport: {
        target: path.join(__dirname, 'pino-transport.js'), // Use our custom transport
        options: {
            url: process.env.LOGGING_API_URL || 'http://localhost:5000/api/logs',
            serviceName: 'my-service-a',
        }
    },
    level: 'info'
});

// Use it like normal Pino
logger.info('User logged in', { userId: 123 });
logger.error('Failed to connect to database', { dbHost: '10.0.0.1', error: 'Connection refused' });
logger.warn('Token expiring soon', { expiry: '2023-10-10' });

console.log('Logs sent to LogNexus!');
