const si = require('systeminformation');

async function getContainerStatus() {
    const containers = await si.dockerContainers(true);

    return containers.map(container => ({
        name: container.name,
        image: container.image,
        state: container.state,   // running, exited
        status: container.status,
        cpuPercent: container.cpu_percent || container.cpuPercent || 0,
        memoryUsageMB: ((container.mem_usage || container.memUsage || 0) / 1024 / 1024).toFixed(2),
        memoryLimitMB: ((container.mem_limit || container.memLimit || 0) / 1024 / 1024).toFixed(2),
        restartCount: container.restartCount || 0
    }));
}

module.exports = { getContainerStatus };
