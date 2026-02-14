import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 500) {
            const errorDetails = {
                message: error.response.data?.message || error.message || "Unknown Server Error",
                stack: error.response.data?.stack
            };
            window.dispatchEvent(new CustomEvent('global-server-error', { detail: errorDetails }));
        }
        return Promise.reject(error);
    }
);

export default api;
