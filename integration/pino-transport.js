const build = require('pino-abstract-transport');
const axios = require('axios');

// Map Pino level numbers to our system's string levels
const levelMap = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
};

/**
 * Pino transport for LogNexus
 * @param {Object} options - Configuration options
 * @param {string} options.url - The full URL to the LogNexus API (e.g. http://localhost:5000/api/logs)
 * @param {string} options.serviceName - The name of the service sending logs
 * @param {string} [options.apiKey] - Optional API key if you add authentication later
 */
module.exports = async function (options) {
    if (!options.url) {
        throw new Error('LogNexus transport require "url" option');
    }

    // Use a persistent connection if possible, or just standard axios instance
    const client = axios.create({
        baseURL: options.url,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            ...(options.apiKey ? { 'x-api-key': options.apiKey } : {})
        }
    });

    return build(async function (source) {
        for await (let obj of source) {
            const { time, level, msg, pid, hostname, ...meta } = obj;

            const payload = {
                service: options.serviceName || 'unknown-service',
                level: levelMap[level] || 'info',
                message: msg,
                meta: {
                    ...meta,
                    pid,
                    hostname,
                    originalTimestamp: time
                },
                timestamp: new Date(time).toISOString()
            };

            try {
                // We use fire-and-forget to avoid blocking the application
                // But in a real transport you might want to batch these
                client.post('', payload).catch(err => {
                    console.error('LogNexus Transport Error:', err.message);
                });
            } catch (err) {
                console.error('LogNexus Transport Error:', err);
            }
        }
    });
};
