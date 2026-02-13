const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/logs', logController.createLog);
router.get('/logs', logController.getLogs);
router.get('/stats', logController.getStats);
router.get('/health', logController.getHealth);
router.get('/services', logController.getServices);
router.get('/security', logController.getSecurityLogs);
router.get('/containers', logController.getContainers);

router.get('/server-health', async (req, res) => {
    try {
        const pool = require('../db').pool;
        const result = await pool.query(
            `SELECT * FROM server_metrics ORDER BY created_at DESC LIMIT 1`
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const { getLiveServerHealth } = require('../services/monitoringService');
router.get('/server-health-live', getLiveServerHealth);

module.exports = router;
