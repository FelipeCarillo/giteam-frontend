// services/mockData.js

// Definições de funções dos agentes com descrições
export const minimalAgentOptions = [
    {
        id: 'PR Review',
        translationKey: 'prReviewAgentMinimal',
        title: 'PR Review',
    },
    {
        id: 'Issue Resolution',
        translationKey: 'issueResolutionAgentMinimal',
        title: 'Issue Resolution',
    },
    {
        id: 'Both',
        translationKey: 'fullServiceAgentMinimal',
        title: 'Full Service',
    }
];

export const agentFunctions = {
    'PR Review': {
        id: 'PR Review',
        title: 'PR Review Agent',
        description: 'Revisa Pull Requests automaticamente, verificando a qualidade do código, possíveis bugs, problemas de segurança e aderência às boas práticas. Comenta diretamente no GitHub com feedback detalhado para os desenvolvedores.',
        icon: 'CodeIcon'
    },
    'Issue Resolution': {
        id: 'Issue Resolution',
        title: 'Issue Resolution Agent',
        description: 'Analisa problemas reportados e fornece possíveis soluções ou passos para debugging. Ajuda a categorizar e priorizar issues, e pode sugerir correções baseadas no código existente do repositório.',
        icon: 'BugReportIcon'
    },
    'Both': {
        id: 'Both',
        title: 'Full-Service Agent',
        description: 'Combina as capacidades de PR Review e Issue Resolution em um único agente. Gerencia todo o ciclo de feedback de código, desde a identificação de problemas até a revisão das correções implementadas.',
        icon: 'SmartToyOutlinedIcon'
    }
};

// Opções de comprimento de resposta
export const responseLengthOptions = [
    {
        id: 'concise',
        title: 'Conciso',
        description: 'Respostas curtas e diretas (40% dos tokens máximos)',
        tokenPercentage: 0.4
    },
    {
        id: 'medium',
        title: 'Médio',
        description: 'Respostas com nível médio de detalhes (60% dos tokens máximos)',
        tokenPercentage: 0.6
    },
    {
        id: 'detailed',
        title: 'Detalhado',
        description: 'Respostas completas e detalhadas (100% dos tokens máximos)',
        tokenPercentage: 1.0
    }
];

// Sample repositories with their agents
export const repositories = [
    {
        id: 1,
        name: 'giteams',
        link: 'https://github.com/FelipeCarillo/giteam-frontend',
        agents: [
            {
                id: 1,
                name: 'PRBuddy',
                function: 'PR Review',
                model: 'gpt-4',
                active: true,
                branches: ['main', 'develop'],
                responseLength: 'medium',
                costMonth: 8.75
            }
        ]
    },
    {
        id: 2,
        name: 'chat-question-awnser',
        link: 'https://github.com/FelipeCarillo/chat-question-awnser',
        agents: [
            {
                id: 2,
                name: 'IssueGenius',
                function: 'Issue Resolution',
                model: 'claude-3',
                active: true,
                responseLength: 'detailed',
                costMonth: 12.30
            },
            {
                id: 3,
                name: 'CodeReviewer',
                function: 'PR Review',
                model: 'llama-3',
                active: false,
                branches: ['main'],
                responseLength: 'concise',
                costMonth: 5.20
            }
        ]
    },
    {
        id: 3,
        name: 'apaeleilao_backend',
        link: 'https://github.com/FelipeCarillo/apaeleilao_backend',
        agents: [
            {
                id: 4,
                name: 'DocHelper',
                function: 'Both',
                model: 'gpt-3.5',
                active: true,
                branches: ['main'],
                responseLength: 'medium',
                costMonth: 3.45
            }
        ]
    },
];

// Agent models available
export const availableModels = [
    { id: '1', name: 'gpt-4o'},
    { id: '2', name: 'gpt-4o-mini'},
    { id: '3', name: 'gpt-4.1'},
    { id: '4', name: 'claude-3-7-sonnet'},
    { id: '5', name: 'claude-3-5-haiku'},
];

// O resto do código permanece o mesmo...
export const agentOptions = Object.values(agentFunctions);

// Sample recent agent operations
export const operations = [
    // Sem alterações
];

// Cost breakdown by month
export const costHistory = [
    // Sem alterações
];

// User profile and settings
export const userSettings = {
    // Sem alterações
};

// Helper functions to work with the mock data
export const getActiveAgentsCount = () => {
    return repositories.reduce((count, repo) =>
        count + repo.agents.filter(agent => agent.active).length, 0);
};

export const getRepositoriesCount = () => repositories.length;

export const getTotalMonthlyCost = () => {
    return repositories.reduce((total, repo) =>
        total + repo.agents.reduce((repoTotal, agent) => repoTotal + agent.costMonth, 0), 0);
};

export const getWeeklyOperationsCount = () => {
    // In a real app, you would filter by date
    return operations.length;
};

export const getOperationsByType = () => {
    const prReviews = operations.filter(op => op.icon === 'CodeIcon').length;
    const issueResolutions = operations.filter(op => op.icon === 'BugReportIcon').length;
    return { prReviews, issueResolutions };
};

export const getAgentById = (agentId) => {
    for (const repo of repositories) {
        const agent = repo.agents.find(a => a.id === agentId);
        if (agent) return agent;
    }
    return null;
};

export const getRepositoryById = (repoId) => {
    return repositories.find(repo => repo.id === repoId) || null;
};

export const getAllAgents = () => {
    return repositories.flatMap(repo =>
        repo.agents.map(agent => ({
            ...agent,
            repository: repo.name,
            repositoryId: repo.id
        }))
    );
};

// Função para verificar se um agente pode ser adicionado ao repositório
export const canAddAgentToRepository = (repository, agentFunction) => {
    // Se o repositório não existe, não podemos adicionar um agente
    if (!repository) return false;

    // Caso 1: Se já há um agente "Both", não podemos adicionar mais nenhum
    if (repository.agents.some(agent => agent.function === 'Both')) {
        return false;
    }

    // Caso 2: Se queremos adicionar um agente "Both", só podemos se não houver outros agentes
    if (agentFunction === 'Both' && repository.agents.length > 0) {
        return false;
    }

    // Caso 3: Verificar se já existe um agente com a mesma função
    if (repository.agents.some(agent => agent.function === agentFunction)) {
        return false;
    }

    // Caso 4: Já existem 2 agentes (um para PR e outro para Issue)
    if (repository.agents.length >= 2) {
        return false;
    }

    // Se passou por todas as verificações, podemos adicionar o agente
    return true;
};

// Função para obter as funções de agente disponíveis para um repositório
export const getAvailableFunctionsForRepository = (repository) => {
    if (!repository) return [];

    // Se já existe um agente "Both", não podemos adicionar mais nenhum
    if (repository.agents.some(agent => agent.function === 'Both')) {
        return [];
    }

    // Se já existem 2 agentes, não podemos adicionar mais nenhum
    if (repository.agents.length >= 2) {
        return [];
    }

    // Se não há agentes, todas as funções estão disponíveis
    if (repository.agents.length === 0) {
        return Object.values(agentFunctions);
    }

    // Se há 1 agente, podemos adicionar o outro tipo (exceto "Both")
    const existingFunction = repository.agents[0].function;
    if (existingFunction === 'PR Review') {
        return [agentFunctions['Issue Resolution']];
    } else if (existingFunction === 'Issue Resolution') {
        return [agentFunctions['PR Review']];
    }

    return [];
};