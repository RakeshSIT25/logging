const logService = require('../services/logService');
const { getContainerStatus } = require('../services/containerMonitoringService');

const createLog = async (req, res, next) => {
    try {
        const log = await logService.createLog(req.body);
        res.status(201).json(log);
    } catch (err) {
        next(err);
    }
};

const getLogs = async (req, res, next) => {
    try {
        const result = await logService.getLogs(req.query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await logService.getStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

const getHealth = (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
};

const getServices = async (req, res, next) => {
    try {
        const services = await logService.getServicesHealth();
        res.json(services);
    } catch (err) {
        next(err);
    }
};

const getContainers = async (req, res, next) => {
    try {
        const containers = await getContainerStatus();
        res.json(containers);
    } catch (err) {
        next(err);
    }
};

const getSecurityLogs = async (req, res, next) => {
    try {
        const logs = await logService.getSecurityLogs(req.query.limit);
        res.json(logs);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createLog,
    getLogs,
    getStats,
    getHealth,
    getServices,
    getServices,
    getSecurityLogs,
    getContainers
};
