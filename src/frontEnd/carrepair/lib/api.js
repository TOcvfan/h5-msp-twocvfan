import axios from 'axios';

const getCsrfToken = () => {
    const match = document.cookie.match(/(^| )csrfToken=([^;]+)/);
    return match ? match[2] : null;
};

export const api = axios.create({
    baseURL: '/api',        // 🔥 går til din BFF
    withCredentials: true,  // 🔥 sender cookies med
});

api.interceptors.request.use((config) => {
    const csrf = getCsrfToken();

    if (csrf) {
        config.headers['X-CSRF-Token'] = csrf;
    }

    return config;
});