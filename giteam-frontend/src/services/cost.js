//services/cost.js
import { api } from './api';

export const getCosts = async () => {
    try {
        const response = await api.get('/cost-history/'); // <--- corrigido
        return response.data;
    } catch (error) {
        console.error('Error fetching costs:', error);
        throw error;
    }
};

