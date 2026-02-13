const pool = require('../db').pool;

class LogService {
    async createLog(logData) {
        const { service, level, message, meta } = logData;
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO logs (service, level, message, meta) VALUES ($1, $2, $3, $4) RETURNING *',
                [service || 'default', level || 'info', message, meta || {}]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async getLogs(filters = {}) {
        const limit = parseInt(filters.limit) || 50;
        const page = parseInt(filters.page) || 1;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (filters.level) {
            whereClause += ` AND level = $${paramIndex}`;
            params.push(filters.level);
            paramIndex++;
        }

        if (filters.service) {
            whereClause += ` AND service = $${paramIndex}`;
            params.push(filters.service);
            paramIndex++;
        }

        if (filters.search) {
            whereClause += ` AND message ILIKE $${paramIndex}`;
            params.push(`%${filters.search}%`);
            paramIndex++;
        }

        if (filters.startDate) {
            whereClause += ` AND timestamp >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            whereClause += ` AND timestamp <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        const countQuery = `SELECT COUNT(*) FROM logs ${whereClause}`;
        const query = `
        SELECT * FROM logs 
        ${whereClause} 
        ORDER BY timestamp DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

        const client = await pool.connect();
        try {
            // Execute count query
            const countResult = await client.query(countQuery, params);

            // Execute data query
            const logsResult = await client.query(query, [...params, limit, offset]);

            return {
                logs: logsResult.rows,
                pagination: {
                    total: parseInt(countResult.rows[0].count),
                    page,
                    limit,
                    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
                }
            };
        } finally {
            client.release();
        }
    }

    async getStats() {
        const client = await pool.connect();
        try {
            // Total logs
            const totalResult = await client.query('SELECT COUNT(*) FROM logs');

            // Logs by level (Errors, Warnings, Info)
            const levelResult = await client.query(`
        SELECT level, COUNT(*) as count 
        FROM logs 
        GROUP BY level
      `);

            // Logs per minute (last 60 mins for chart)
            const timeTrendResult = await client.query(`
        SELECT date_trunc('minute', timestamp) as time, COUNT(*) as count
        FROM logs
        WHERE timestamp > NOW() - INTERVAL '1 hour'
        GROUP BY time
        ORDER BY time ASC
      `);

            // Top services generating logs
            const serviceStatsResult = await client.query(`
          SELECT service, COUNT(*) as count
          FROM logs
          GROUP BY service
          ORDER BY count DESC
          LIMIT 5
      `);

            const levels = levelResult.rows.reduce((acc, row) => {
                acc[row.level] = parseInt(row.count);
                return acc;
            }, {});

            const total = parseInt(totalResult.rows[0].count);
            const errorCount = levels['error'] || 0;
            const errorRate = total > 0 ? ((errorCount / total) * 100).toFixed(2) : 0;

            return {
                total,
                levels,
                errorRate,
                trend: timeTrendResult.rows,
                services: serviceStatsResult.rows
            };
        } finally {
            client.release();
        }
    }

    async getServicesHealth() {
        // Services health (error rate in last 5 minutes)
        const client = await pool.connect();
        try {
            const result = await client.query(`
            SELECT 
                service,
                COUNT(*) as total_logs,
                COUNT(*) FILTER (WHERE level = 'error') as error_count,
                 MAX(timestamp) as last_seen
            FROM logs
            WHERE timestamp > NOW() - INTERVAL '5 minutes'
            GROUP BY service
        `);

            return result.rows.map(row => ({
                name: row.service,
                totalLogs: parseInt(row.total_logs),
                errorCount: parseInt(row.error_count),
                errorRate: parseInt(row.total_logs) > 0 ? ((parseInt(row.error_count) / parseInt(row.total_logs)) * 100).toFixed(2) : 0,
                status: parseInt(row.error_count) > 5 ? 'critical' : 'healthy', // Simple threshold
                lastSeen: row.last_seen
            }));
        } finally {
            client.release();
        }
    }

    async getSecurityLogs(limit = 50) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
            SELECT * FROM logs 
            WHERE 
             timestamp > NOW() - INTERVAL '24 hours' AND
             (message ILIKE '%auth%' OR message ILIKE '%login%' OR message ILIKE '%key%' OR message ILIKE '%permission%' OR message ILIKE '%access%' OR service ILIKE '%auth%')
            ORDER BY timestamp DESC
            LIMIT $1
        `, [limit]);
            return result.rows;
        } finally {
            client.release();
        }
    }
}

module.exports = new LogService();
