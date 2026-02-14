const si = require('systeminformation');

async function getContainerStatus() {
    try {
        const containers = await si.dockerContainers(true);
        const containersWithStats = await Promise.all(containers.map(async (container) => {
            // Only fetch detailed stats for running containers to avoid errors/delays
            let stats = {};
            if (container.state === 'running') {
                try {
                    stats = await si.dockerContainerStats(container.id);
                    console.log(`Stats for ${container.name}:`, stats);
                } catch (e) {
                    console.error(`Failed to fetch stats for ${container.name}`, e);
                }
            }

            return {
                name: container.name,
                image: container.image,
                state: container.state,
                status: container.status || container.state,
                cpuPercent: (stats.cpu_percent || 0).toFixed(2),
                memoryUsageMB: ((stats.mem_usage || 0) / 1024 / 1024).toFixed(2),
                memoryLimitMB: ((stats.mem_limit || 0) / 1024 / 1024).toFixed(2),
                restartCount: stats.restartCount || 0
            };
        }));

        return containersWithStats;
    } catch (error) {
        console.error("Error fetching container status:", error);
        return [];
    }
}

module.exports = { getContainerStatus };
