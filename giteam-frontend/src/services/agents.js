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

export const getAiModels = async (language) => {
    try {
        const response = await api.get(`/ai-models/${language}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching AI models:', error);
        throw error;
    }
}