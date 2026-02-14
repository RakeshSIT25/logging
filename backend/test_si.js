const si = require('systeminformation');

async function test() {
    try {
        const containers = await si.dockerContainers(true);
        console.log(`Found ${containers.length} containers.`);
        if (containers.length > 0) {
            const container = containers[0];
            console.log(`Testing with container: ${container.name} (${container.id})`);
            const stats = await si.dockerContainerStats(container.id);
            console.log('Result type:', typeof stats);
            console.log('Is Array?', Array.isArray(stats));
            console.log('Stats:', JSON.stringify(stats, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

test();
