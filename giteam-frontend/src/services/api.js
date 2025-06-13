import axios from "axios";
import process from "process";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("githubToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("githubToken");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

const apiGitHub = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        "Content-Type": "application/json",
    },
});

apiGitHub.interceptors.request.use((config) => {
    const token = localStorage.getItem("githubToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiGitHub.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("githubToken");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export { api, apiGitHub };  