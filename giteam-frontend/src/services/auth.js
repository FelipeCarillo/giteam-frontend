import axios from 'axios';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URL = process.env.REACT_APP_GITHUB_REDIRECT_URL;

export const loginWithGitHub = () => {
    window.location.href = `${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URL)}&scope=user,repo`;
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

export const handleAuthCallback = async (code) => {
    console.log('Initializing authentication callback with code:', code);
    const response = await axios.get(`http://localhost:8000/auth/callback/aaa?code=${code}`);
    const token = response.data.token;
    setToken(token);
};

export const getUserInfo = async () => {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await axios.get(`/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
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