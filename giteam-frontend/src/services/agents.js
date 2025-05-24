// services/agents.js
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
        // Convert React language codes to API expected format
        const languageMap = {
            'pt-BR': 'br',
            'en-US': 'us'
        };
        
        const apiLanguage = languageMap[language] || 'en';
        
        // Use query parameter instead of path parameter
        const response = await api.get(`/ai-models/`, {
            params: { language: apiLanguage }
        });
        
        // Transform API response to match expected format
        return {
            models: response.data.ai_models || [],
            message: response.data.message
        };
    } catch (error) {
        console.error('Error fetching AI models:', error);
        throw error;
    }
}