import api from '../api/axios';

const SERVICE_NAME = 'frontend';

const logger = {
    info: (message, meta = {}) => {
        send('info', message, meta);
    },
    warn: (message, meta = {}) => {
        send('warn', message, meta);
    },
    error: (message, meta = {}) => {
        send('error', message, meta);
    },
    debug: (message, meta = {}) => {
        // Optionally filter debug logs in production
        send('debug', message, meta);
    }
};

const send = async (level, message, meta) => {
    try {
        const payload = {
            service: SERVICE_NAME,
            level,
            message,
            meta: {
                ...meta,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            }
        };
        await api.post('/logs', payload);
    } catch (error) {
        // Fallback to console to avoid infinite loops if logging fails
        console.error('Failed to send log to backend:', error);
    }
};

export default logger;
