import axios from 'axios';

const API = axios.create({
    baseURL: 'https://taskmanager-6iwr.onrender.com/api',
});

// Attach stored JWT to every request so protected endpoints succeed
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;