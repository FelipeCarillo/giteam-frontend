import { api, apiGitHub } from './api';

export const getCosts = async () => {
    try {
        const response = await api.get('/costs-history');
        return response.data;
    } catch (error) {
        console.error('Error fetching costs:', error);
        throw error;
    }
}

