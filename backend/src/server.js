const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const { collectMetrics } = require('./services/monitoringService');

setInterval(() => {
    collectMetrics();
}, 10000);
