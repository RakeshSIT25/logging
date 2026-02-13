# Integrating LogNexus with Your Existing Applications

This directory contains resources to help you connect your existing Node.js applications (using Pino) to the LogNexus platform.

## What You Need from Your Existing Application

To start logging, you only need to ensure two things:
1.  **Network Connectivity:** Your application container must be able to reach the **LogNexus Backend**.
2.  **Configuration:** You need to configure Pino to use our custom transport.

---

## 1. Network Connectivity (Docker)

### Scenario A: Both Apps in the SAME Docker Network
If your existing application is *already* in a Docker Compose file, the easiest way is to add it to the same network as LogNexus.
The service name of our backend is `backend` (port 5000).

**Config:**  
`LOGGING_API_URL: http://backend:5000/api/logs`

### Scenario B: Apps in DIFFERENT Docker Networks / Separate Stacks
If they are separate, you need to expose the LogNexus backend port or use host networking.
Since we mapped backend port `5000` to host port `5000` (by default), you can use:

**On Linux/Mac:**  
`LOGGING_API_URL: http://host.docker.internal:5000/api/logs`

**On Windows:**  
`LOGGING_API_URL: http://host.docker.internal:5000/api/logs` (if using Docker Desktop)

---

## 2. Using the Pino Transport

1.  Copy `pino-transport.js` into your existing project (e.g., inside `src/logging/`).
2.  Install `pino-abstract-transport` and `axios`:
    ```bash
    npm install pino-abstract-transport axios
    ```
3.  Configure your Pino logger instance like this:

```javascript
const pino = require('pino');
const path = require('path');

const logger = pino({
  transport: {
    target: path.join(__dirname, 'src/logging/pino-transport.js'), // Path to the file you copied
    options: {
      url: process.env.LOGGING_API_URL || 'http://backend:5000/api/logs',
      serviceName: 'my-microservice-name', // Identify this service
    }
  },
  level: 'info'
});

// Now use logger normally
logger.info('Order processed', { orderId: 123 });
```

## Security Note (Optional)

If your logging platform is exposed publicly, you should modify `pino-transport.js` to include an API key header (`x-api-key`) and implement simple authentication middleware on the backend.
