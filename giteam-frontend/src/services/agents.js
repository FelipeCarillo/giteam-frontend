import { api } from './api';


export const getRepositories = async (agent_id) => {
    try {
        const response = await api.get(`/agents/${agent_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
}