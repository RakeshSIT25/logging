const si = require('systeminformation');
const pool = require('../db').pool;

async function collectMetrics() {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disk = await si.fsSize();

        const cpuUsage = cpu.currentLoad;
        const memoryUsage = (mem.used / mem.total) * 100;
        const diskUsage = disk[0].use;

        const client = await pool.connect();
        await client.query(
            `INSERT INTO server_metrics (cpu_usage, memory_usage, disk_usage, uptime)
             VALUES ($1, $2, $3, $4)`,
            [cpuUsage, memoryUsage, diskUsage, Math.floor(process.uptime())]
        );
        client.release();

        console.log("Server metrics collected");
    } catch (err) {
        console.error("Monitoring error:", err.message);
    }
}

const getLiveServerHealth = async (req, res, next) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disk = await si.fsSize();

        res.json({
            cpu: {
                load: cpu.currentLoad,
                cores: cpu.cpus.map(c => c.load)
            },
            memory: {
                total: mem.total,
                used: mem.used,
                free: mem.free,
                active: mem.active,
                percentage: (mem.used / mem.total) * 100
            },
            disk: disk.map(d => ({
                fs: d.fs,
                type: d.type,
                size: d.size,
                used: d.used,
                use: d.use,
                mount: d.mount
            })),
            uptime: process.uptime()
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { collectMetrics, getLiveServerHealth };
