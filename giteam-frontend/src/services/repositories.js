import { api } from './api';
import { apiGitHub } from "./api";


export const getRepositories = async () => {
    try {
        const response = await api.get('/repositories');
        return response.data;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

export const getAvailableRepositories = async (username) => {
    try {
        const repositories = await api.getAvailableRepositories();
        const githubRepositories = await apiGitHub.get(`/user/${username}/repos`);
        
    } catch (error) {
        console.error('Error fetching available repositories:', error);
        throw error;
    }
}