const si = require('systeminformation');

async function getContainerStatus() {
    const containers = await si.dockerContainers(true);

    return containers.map(container => ({
        name: container.name,
        image: container.image,
        state: container.state,   // running, exited
        status: container.status,
        cpuPercent: container.cpuPercent,
        memoryUsageMB: (container.memUsage / 1024 / 1024).toFixed(2),
        memoryLimitMB: (container.memLimit / 1024 / 1024).toFixed(2),
        restartCount: container.restartCount
    }));
}

module.exports = { getContainerStatus };
