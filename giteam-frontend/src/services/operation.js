//services/operation.js
import { api } from './api';

export const getOperations = async () => {
    try {
        const response = await api.get('/operations/'); // <--- corrigido
        return response.data;
    } catch (error) {
        console.error('Error fetching operations:', error);
        throw error;
    }
}