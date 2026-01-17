import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: false,
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("fley_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // DEBUG: console.log(`[AXIOS] Sending request to ${config.url} with token: ${token ? 'YES' : 'NO'}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn("[AXIOS] Auth error detected, clearing session");
            localStorage.removeItem("fley_token");
            localStorage.removeItem("onboarding_step");
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
