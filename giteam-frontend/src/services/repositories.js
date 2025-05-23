//services/repositories.js
import { api, apiGitHub } from './api';

// GET /repositories/ - List Repositories  
export const getRepositories = async () => {
    try {
        const response = await api.get('/api/repositories');
        return response.data;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
};

// POST /repositories/ - Create Repository
// Enhanced repository creation with better error handling and validation
// Add this to your repositories.js service file

export const createRepository = async (repositoryData) => {
    try {
        console.log('🚀 Starting repository creation...');
        console.log('📋 Original repository data:', repositoryData);
        
        // Validate required fields before sending
        const requiredFields = ['name', 'link'];
        const missingFields = requiredFields.filter(field => !repositoryData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Clean and validate the data
        const cleanedData = {
            name: String(repositoryData.name || '').trim(),
            link: String(repositoryData.link || '').trim(),
            description: String(repositoryData.description || '').trim(),
            language: String(repositoryData.language || 'Unknown').trim(),
            stars: Number(repositoryData.stars) || 0,
            forks: Number(repositoryData.forks) || 0,
            // Remove undefined/null values and ensure proper types
            ...(repositoryData.github_id && { github_id: Number(repositoryData.github_id) }),
            ...(typeof repositoryData.private === 'boolean' && { private: repositoryData.private }),
            ...(repositoryData.default_branch && { default_branch: String(repositoryData.default_branch).trim() }),
            ...(repositoryData.created_at && { created_at: repositoryData.created_at }),
            ...(repositoryData.updated_at && { updated_at: repositoryData.updated_at }),
        };
        
        console.log('🧹 Cleaned repository data:', cleanedData);
        console.log('📊 Data types:', {
            name: typeof cleanedData.name,
            link: typeof cleanedData.link,
            description: typeof cleanedData.description,
            language: typeof cleanedData.language,
            stars: typeof cleanedData.stars,
            forks: typeof cleanedData.forks,
            github_id: typeof cleanedData.github_id,
            private: typeof cleanedData.private
        });
        
        // Test API endpoint first
        console.log('🌐 Testing API endpoint...');
        console.log('📡 Backend URL:', api.defaults.baseURL);
        console.log('🔑 Authorization header:', api.defaults.headers.Authorization ? 'Present' : 'Missing');
        
        const response = await api.post('/api/repositories', cleanedData, {
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout
            timeout: 10000
        });
        
        console.log('✅ Repository created successfully!');
        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('❌ Repository creation failed!');
        console.error('🔍 Error type:', error.constructor.name);
        
        // Detailed error logging
        if (error.response) {
            // Server responded with error status
            console.error('📡 Server Error Response:');
            console.error('   Status:', error.response.status);
            console.error('   Status Text:', error.response.statusText);
            console.error('   Headers:', error.response.headers);
            console.error('   Data:', error.response.data);
            
            // Check for specific validation errors
            if (error.response.status === 422) {
                console.error('🚨 Validation Error (422)!');
                if (error.response.data?.detail) {
                    if (Array.isArray(error.response.data.detail)) {
                        console.error('📋 Validation errors:');
                        error.response.data.detail.forEach((err, index) => {
                            console.error(`   ${index + 1}. ${err.loc?.join('.')} - ${err.msg}`);
                        });
                    } else {
                        console.error('📋 Error detail:', error.response.data.detail);
                    }
                }
            }
            
        } else if (error.request) {
            // Request made but no response
            console.error('📡 Network Error - No response received:');
            console.error('   Request:', error.request);
            console.error('   Ready State:', error.request.readyState);
            console.error('   Status:', error.request.status);
            
        } else {
            // Request setup error
            console.error('⚙️ Request Setup Error:', error.message);
        }
        
        console.error('📊 Full Error Object:', error);
        throw error;
    }
};

// Alternative minimal version for testing
export const createRepositoryMinimal = async (repositoryData) => {
    try {
        console.log('🧪 Testing minimal repository creation...');
        
        // Send only essential data
        const minimalData = {
            name: repositoryData.name,
            link: repositoryData.link,
            description: repositoryData.description || ""
        };
        
        console.log('📋 Minimal data:', minimalData);
        
        const response = await api.post('/api/repositories', minimalData);
        console.log('✅ Minimal creation success:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Minimal creation failed:', error.response?.data || error.message);
        throw error;
    }
};

// Test API connectivity
export const testApiConnection = async () => {
    try {
        console.log('🧪 Testing API connection...');
        console.log('🌐 Backend URL:', api.defaults.baseURL);
        
        // Test GET first
        const getResponse = await api.get('/api/repositories');
        console.log('✅ GET /api/repositories works:', getResponse.status);
        
        // Test with a very simple POST
        const testData = {
            name: `test-${Date.now()}`,
            link: "https://github.com/test/test",
            description: "Test repository"
        };
        
        console.log('🧪 Testing POST with:', testData);
        const postResponse = await api.post('/api/repositories', testData);
        console.log('✅ POST /api/repositories works:', postResponse.status);
        
        return { success: true, data: postResponse.data };
        
    } catch (error) {
        console.error('❌ API connection test failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

export const getRepositoryById = async (repositoryId) => {
    try {
        const response = await api.get(`/api/repositories/repo/${repositoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching repository by ID:', error);
        throw error;
    }
};

// GET /repositories/available - List Available Repositories
export const getAvailableRepositories = async () => {
    try {
        const response = await api.get('/api/repositories/available');
        return response.data;
    } catch (error) {
        console.error('Error fetching available repositories:', error);
        throw error;
    }
};

// DELETE /repositories/{repository_id} - Delete Repository
export const deleteRepository = async (repositoryId) => {
    try {
        const response = await api.delete(`/api/repositories/${repositoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting repository:', error);
        throw error;
    }
};

// PATCH /repositories/{repository_id} - Activate/Deactivate Repository
export const toggleRepository = async (repositoryId, isActive) => {
    try {
        const response = await api.patch(`/api/repositories/${repositoryId}`, { 
            active: isActive 
        });
        return response.data;
    } catch (error) {
        console.error('Error toggling repository:', error);
        throw error;
    }
};

// POST /repositories/{repository_id}/agents - Add Agent To Repository
export const addAgentToRepository = async (repositoryId, agentData) => {
    try {
        const response = await api.post(`/api/repositories/${repositoryId}/agents`, agentData);
        return response.data;
    } catch (error) {
        console.error('Error adding agent to repository:', error);
        throw error;
    }
};

// GitHub API Integration - Get current user's repositories
export const getCurrentUserGitHubRepositories = async () => {
    try {
        console.log('🔍 Fetching GitHub repositories...');
        
        // Check if token exists
        const token = localStorage.getItem("githubToken");
        if (!token) {
            throw new Error('GitHub token not found. Please authenticate first.');
        }
        
        console.log('🔑 GitHub token found, making request...');
        
        // Get user repositories with proper parameters
        const response = await apiGitHub.get('/user/repos', {
            params: {
                per_page: 100,
                sort: 'updated',
                direction: 'desc',
                affiliation: 'owner,collaborator,organization_member'
            }
        });
        
        console.log('✅ GitHub API Success:', response.data?.length, 'repositories found');
        return response.data;
        
    } catch (error) {
        console.error('❌ Error fetching GitHub repositories:', error);
        
        // Provide more specific error messages
        if (error.response?.status === 401) {
            throw new Error('GitHub authentication failed. Please login again.');
        } else if (error.response?.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 404) {
            throw new Error('GitHub user not found or no access to repositories.');
        } else {
            throw new Error(`GitHub API error: ${error.message}`);
        }
    }
};

// Get specific user's GitHub repositories
export const getGitHubRepositories = async (username) => {
    try {
        const response = await apiGitHub.get(`/users/${username}/repos`, {
            params: {
                per_page: 100,
                sort: 'updated',
                direction: 'desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub repositories for user:', username, error);
        throw error;
    }
};

// Alternative method for debugging - Direct fetch
export const getGitHubRepositoriesDirect = async () => {
    try {
        const token = localStorage.getItem("githubToken");
        if (!token) {
            throw new Error('No GitHub token available');
        }
        
        console.log('🔍 Making direct GitHub API call...');
        
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Repository-Manager',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Direct API Response Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Direct API Error Response:', errorText);
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Direct API Success:', data?.length, 'repositories found');
        return data;
        
    } catch (error) {
        console.error('❌ Direct GitHub API call failed:', error);
        throw error;
    }
};

// Agent management functions
export const toggleAgent = async (agentId) => {
    try {
        const response = await api.patch(`/api/agents/${agentId}/toggle`);
        return response.data;
    } catch (error) {
        console.error('Error toggling agent:', error);
        throw error;
    }
};

export const deleteAgent = async (agentId) => {
    try {
        const response = await api.delete(`/api/agents/${agentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting agent:', error);
        throw error;
    }
};