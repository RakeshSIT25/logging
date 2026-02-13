const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/logs', logController.createLog);
router.get('/logs', logController.getLogs);
router.get('/stats', logController.getStats);
router.get('/health', logController.getHealth);
router.get('/services', logController.getServices);
router.get('/security', logController.getSecurityLogs);

module.exports = router;
