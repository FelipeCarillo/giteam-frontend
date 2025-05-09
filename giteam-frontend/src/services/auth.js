import api from './api';
import process from 'process';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const loginWithGitHub = () => {
    window.location.href = `${BACKEND_URL}/auth/login/github`;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('githubToken');
    return !!token;
};

export const getToken = () => {
    return localStorage.getItem('githubToken');
};

export const setToken = (token) => {
    localStorage.setItem('githubToken', token);
}

export const handleAuthCallback = async () => {
    console.log('Initializing authentication callback...');
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('code');
    console.log('Access token received:', accessToken);
    if (!accessToken) {
        throw new Error('No access token found in the URL');
    }
    setToken(accessToken);
    return accessToken;
};

export const getUserInfo = async () => {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await api.get('/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); 

        return response.data.user;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            logout();
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('githubToken');
    window.location.href = '/';
};