// services/agents.js
import { api } from './api';

export const getRepositories = async (agent_id) => {
    try {
        const response = await api.get(`/agents/${agent_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching agent:', error);
        throw error;
    }
}

// ✅ Função corrigida para alternar status do agente
export const toggleAgentStatus = async (agent_id, currentStatus) => {
    try {
        // Enviar o novo status (oposto do atual)
        const newStatus = !currentStatus;
        
        const response = await api.put(`/agents/${agent_id}`, {
            active: newStatus
        });
        
        return response.data;
    } catch (error) {
        console.error('Error toggling agent status:', error);
        throw error;
    }
}

// Função para excluir agente
export const deleteAgent = async (agent_id) => {
    try {
        const response = await api.delete(`/agents/${agent_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting agent:', error);
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