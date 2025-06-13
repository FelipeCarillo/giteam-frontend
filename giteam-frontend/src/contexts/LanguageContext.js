// contexts/LanguageContext.jsx
import { create } from '@mui/material/styles/createTransitions';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Definição dos textos em português e inglês
export const translations = {
    'pt-BR': {
        //Home
        homeTitle1: 'Colaboração do GitHub pontencializada por IA',
        homeTitle2: 'Aprimore seu fluxo de trabalho com IA que entende seu código, agiliza as revisões e ajuda a resolver problemas mais rapidamente.',
        CardTitle1: "Reviews de PR inteligentes",
        CardDesc1: 'Obtenha insights com tecnologia de IA sobre suas pull requests. Economize tempo e identifique problemas antes que eles cheguem à produção.',
        CardTitle2: 'Análise de Código',
        CardDesc2: 'Verificações automáticas de qualidade de código e varredura de segurança para identificar possíveis bugs e vulnerabilidades.',
        CardTitle3: 'Colaboração em equipe',
        CardDesc3: 'Aprimore os fluxos de trabalho da equipe com resumos de problemas e geração de documentação assistidos por IA.',

        // Layout
        dashboard: 'Painel',
        myAgents: 'Meus Agentes',
        repositories: 'Repositórios',
        operationHistory: 'Histórico de Operações',
        costs: 'Custos',
        keys: 'Gerenciamento de Chaves de IA',
        signOut: 'Sair',

        // Dashboard
        activeAgents: 'Agentes Ativos',
        acrossRepositories: 'Em {count} repositórios',
        monthCost: 'Custo Mensal',
        operationCosts: 'Custos operacionais de todos os agentes',
        operationsThisWeek: 'Operações Esta Semana',
        prReviews: 'Revisões PR: {count}',
        issueResolutions: 'Resoluções Issues: {count}',
        createNewAgent: 'Criar um Novo Agente',
        createAgentDesc: 'Configure agentes com IA para auxiliar seu fluxo de trabalho do GitHub. Configure agentes para revisar PRs, resolver problemas ou ambos.',
        yourRepositoriesAgents: 'Seus Repositórios e Agentes',
        recentOperations: 'Operações Recentes',
        viewAllOperations: 'Ver Todas as Operações',

        //Agent
        titleAgent: 'Meus Agentes',
        agentManagement: 'Gerencie seus Agentes',
        search: 'Pesquise Agentes por nome, repositório ou Modelo IA',
        statusMenu: 'Todos os Status',
        statusActive: 'Ativo',
        statusInactive: 'Inativo',
        typeMenu: 'Tipos',
        allTypes: 'Todos os Tipos',
        prReview: 'Revisão de PR',
        issueResolution: 'Resolução de Issues',
        fullService: 'Serviço Completo',
        createAgentNew: 'Criar Novo Agente',
        refresh: 'Recarregar',
        loadAgents: 'Carregando agentes...',
        agentsFound: 'Nenhum agente encontrado.',
        agentsConfigured: "You don't have any agents configured yet",
        firstAgent: 'Crie seu primeiro Agente',
        agentsMatch: 'Nenhum agente corresponde aos seus filtros atuais.',

        // Agent Functions
        prReviewAgent: 'Agente de Revisão de PR',
        prReviewDesc: 'Revisa Pull Requests automaticamente, verificando a qualidade do código, possíveis bugs, problemas de segurança e aderência às boas práticas. Comenta diretamente no GitHub com feedback detalhado para os desenvolvedores.',
        issueResolutionAgent: 'Agente de Resolução de Issues',
        issueResolutionDesc: 'Analisa problemas reportados e fornece possíveis soluções ou passos para debugging. Ajuda a categorizar e priorizar issues, e pode sugerir correções baseadas no código existente do repositório.',
        fullServiceAgent: 'Agente Full-Service',
        fullServiceDesc: 'Combina as capacidades de PR Review e Issue Resolution em um único agente. Gerencia todo o ciclo de feedback de código, desde a identificação de problemas até a revisão das correções implementadas.',
        prReviewAgentMinimal: 'Revisão de PRs',
        issueResolutionAgentMinimal: 'Resolução de Issues',
        fullServiceAgentMinimal: 'Serviço Completo',

        //Repository
        repositoryTitle: 'Repositório',
        repositorySubTitle: 'Repositórios do GitHub',
        addRepository: 'Adicionar Repositório',
        searchRepository: 'Pesquisar repositórios',
        tryAgain: 'tente novamente',
        addFirstRepository: 'Adicione seu primeiro repositório',
        loadRepositories: 'Carregando repositórios...',

        // Response Length
        concise: 'Conciso',
        conciseDesc: 'Respostas curtas e diretas (40% dos tokens máximos)',
        medium: 'Médio',
        mediumDesc: 'Respostas com nível médio de detalhes (60% dos tokens máximos)',
        detailed: 'Detalhado',
        detailedDesc: 'Respostas completas e detalhadas (100% dos tokens máximos)',

        // Agent Creation
        back: 'Voltar',
        cancel: 'Cancelar',
        next: 'Próximo',
        createAgent: 'Criar Agente',
        repoAndFunction: 'Repositório e Função',
        modelAndConfig: 'Modelo e Configuração',
        review: 'Revisão',
        createNewAgentTitle: 'Criar Novo Agente',
        selectRepoAndFunction: 'Selecione o Repositório e a Função do Agente',
        repoAgentLimit: 'Um repositório pode ter até 2 agentes com funções diferentes, ou 1 agente "Full-Service"',
        selectRepository: 'Selecione um repositório',
        agentLimitReached: '(Limite de agentes atingido)',
        selectAgentFunction: 'Selecione a função do agente:',
        repositoryLimitReached: 'Este repositório já atingiu o limite de agentes.',
        alreadyHasFullService: 'Já existe um agente Full-Service neste repositório.',
        alreadyHasAllFunctions: 'Já existem agentes para todas as funções disponíveis.',
        configureYourAgent: 'Configure seu Agente',
        agentName: 'Nome do Agente',
        agentNamePlaceholder: 'Ex.: CodeReviewer, IssueHelper',
        chooseDescriptiveName: 'Escolha um nome descritivo para seu agente',
        selectAIModel: 'Selecione o modelo AI:',
        provider: 'Provedor: {name}',
        promptCosts: 'Custos de Prompt:',
        completionCosts: 'Custos de Completion:',
        monitoredBranches: 'Branches Monitoradas',
        addBranchName: 'Adicione o nome da branch',
        branchesToMonitor: 'Adicione as branches que você deseja que este agente monitore',
        responseDetailLevel: 'Nível de Detalhamento da Resposta',
        reviewAgentConfig: 'Revise a Configuração do Agente',
        repository: 'Repositório',
        notSelected: 'Não selecionado',
        model: 'Modelo',
        responseDetail: 'Detalhamento da Resposta',
        estimatedTokens: 'Tokens Estimados',
        of: 'de',
        estimatedCost30Days: 'Custo estimado para os próximos 30 dias',
        basedOnAverage: 'Baseado em uma média de 1 operação por dia',
        agentActiveInfo: 'Seu agente ficará ativo imediatamente após a criação. Você pode pausá-lo a qualquer momento na página de Agentes.',
        loadingModels: 'Carregando modelos de IA...',

        // Repository Card
        addAgent: 'Adicionar Agente',
        noAgentsInRepo: 'Este repositório ainda não possui agentes.',
        allAgentInRepo: 'Este repositório já possui todos os tipos de agentes permitidos',
        fullServiceInRepo: 'Este repositório já possui um agente Full-Service',

        // Agent Item
        active: 'Ativo',
        inactive: 'Inativo',
        responseConfig: 'Configuração da resposta:',
        costThisMonth: 'Custo este mês:',
        deactivateAgent: 'Desativar agente',
        activateAgent: 'Ativar agente',
        deleteAgent: 'Excluir agente',
        repositoryAgentItem: 'Repositório',
        tokenPerResponse: 'tokens por resposta',

        //Operation History
        operationHistoryTitle: 'Histórico de Operações',
        operationHistoryAgent: 'Operações de Agentes',
        operationSearch: 'Pesquisar em operações ou repositórios',
        operationAgent: 'Agentes',
        operationAllAgents: 'Todos Agentes',
        operationType: 'Tipo de Operação',
        operationAllTypes: 'Todos os Tipos',
        operationCost: 'Custo Total',
        operationSearchResults: 'Nenhuma operação corresponde aos seus filtros.',

        //keys
        keysTitle: 'Insira suas chaves de API de IA',
        editKeys: 'Editar Chave',
        deleteKey: 'Deletar Chave',
        addKey: 'Adicionar Chave',
        saveKey: 'Salvar Chave',
        cancelKey: 'Cancelar',

        // Common
        function: 'Função',
        in: 'em',

        // Costs
        'noHistoricalData': 'Não há dados históricos de custos disponíveis. Os custos serão exibidos quando houver operações de agentes.',
        'currentMonthCosts': 'Custos do Mês:',
        'fromLastMonth': 'em relação ao mês anterior',
        'breakdown': 'Detalhamento',
        'costTrends': 'Tendências de Custo',
        'timeframe': 'Período',
        'monthly': 'Mensal',
        'weekly': 'Semanal',
        'daily': 'Diário',
        'month': 'Mês',
        'total': 'Total',
        'monthlyCostDistribution': 'Distribuição de Custos Mensal',
        'costBreakdown': 'Detalhamento de Custos',
        'viewBy': 'Visualizar Por',
        'name': 'Nome',
        'type': 'Tipo',
        'repository': 'Repositório',
        'monthlyCost': 'Custo Mensal',
        'percentageOfTotal': '% do Total',
        'agent': 'Agente',
        'model': 'Modelo',

        settings: {
            ai_keys: {
                title: 'Gerencie suas chaves de IA',
                description: 'Adicione ou edite as chaves de API dos provedores de IA para utilizar agentes em seus repositórios. Suas chaves são criptografadas e armazenadas com segurança.',
                loading: 'Carregando informações dos provedores e chaves...',
                configured: 'Configurada',
                not_configured: 'Não configurada',
                secret_key: 'Chave secreta',
                key_secure: 'Sua chave está segura e criptografada.',
                key_saved: 'Chave do {provider} salva com sucesso!',
                key_deleted: 'Chave do {provider} removida com sucesso!',
                saving: 'Salvando...',
                save: 'Salvar',
                deleting: 'Excluindo...',
                delete: 'Excluir',
                edit: 'Editar',
                configure: 'Configurar',
                cancel: 'Cancelar',
                show: 'Mostrar',
                hide: 'Ocultar',
                delete_confirm_title: 'Confirmar exclusão',
                delete_confirm_message: 'Tem certeza que deseja excluir a chave do provedor {provider}? Essa ação não pode ser desfeita.',
                invalid_format: 'O formato da chave de {provider} está incorreto.',
                placeholder: 'Insira sua chave secreta do {provider} para habilitar os agentes.',
                openai_models: 'Usado para agentes baseados em modelos OpenAI (ex: GPT-4, GPT-4o-mini, etc.)',
                anthropic_models: 'Usado para agentes baseados em modelos Anthropic (ex: Claude, etc.)',
                info_title: 'Segurança das suas chaves',
                info_encrypted: 'Todas as chaves são armazenadas de forma criptografada.',
                info_security: 'Nunca compartilhamos suas chaves com terceiros.',
                info_revoke: 'Você pode revogar uma chave a qualquer momento.',
                info_formats: 'Cada provedor tem um formato específico para a chave.',
            }
        }
    },
    'en-US': {
        //Home
        homeTitle1: 'AI-powered GitHub collaboration',
        homeTitle2: 'Enhance your workflow with AI that understands your code, streamlines reviews, and helps solve issues faster.',
        CardTitle1: "Smart PR Reviews",
        CardDesc1: 'Get AI-powered insights on your pull requests. Save time and catch issues before they reach production.',
        CardTitle2: 'Code Analysis',
        CardDesc2: 'Automatic code quality checks and security scanning to identify potential bugs and vulnerabilities.',
        CardTitle3: 'Team Collaboration',
        CardDesc3: 'Enhance team workflows with AI-assisted issue summaries and documentation generation.',

        // Layout
        dashboard: 'Dashboard',
        myAgents: 'My Agents',
        repositories: 'Repositories',
        operationHistory: 'Operation History',
        costs: 'Costs',
        keys: 'AI Keys Management',
        signOut: 'Sign out',

        // Dashboard
        activeAgents: 'Active Agents',
        acrossRepositories: 'Across {count} repositories',
        monthCost: "This Month's Cost",
        operationCosts: 'Operation costs from all agents',
        operationsThisWeek: 'Operations This Week',
        prReviews: 'PR Reviews: {count}',
        issueResolutions: 'Issue Resolutions: {count}',
        createNewAgent: 'Create a New Agent',
        createAgentDesc: 'Set up AI-powered agents to help with your GitHub workflow. Configure agents to review PRs, resolve issues, or both.',
        yourRepositoriesAgents: 'Your Repositories & Agents',
        recentOperations: 'Recent Operations',
        viewAllOperations: 'View All Operations',

        //Agent
        titleAgent: 'My Agents',
        agentManagement: 'Manage Your Agents',
        search: 'Search agents by name, repository, or AI Model',
        statusMenu: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        typeMenu: 'Types',
        allTypes: 'All Types',
        prReview: 'PR Review',
        issueResolution: 'Issue Resolution',
        fullService: 'Full Service',
        createAgentNew: 'Create New Agent',
        refresh: 'Refresh',
        loadAgents: 'Loading agents...',
        agentsFound: 'No agents found.',
        agentsConfigured: "You don't have any agents configured yet",
        firstAgent: 'Create your first Agent',
        agentsMatch: 'No agents match your current filters.',

        // Agent Functions
        prReviewAgent: 'PR Review Agent',
        prReviewDesc: 'Automatically reviews Pull Requests, checking code quality, potential bugs, security issues, and adherence to best practices. Comments directly on GitHub with detailed feedback for developers.',
        issueResolutionAgent: 'Issue Resolution Agent',
        issueResolutionDesc: 'Analyzes reported problems and provides possible solutions or debugging steps. Helps categorize and prioritize issues, and can suggest fixes based on existing repository code.',
        fullServiceAgent: 'Full-Service Agent',
        fullServiceDesc: 'Combines PR Review and Issue Resolution capabilities in a single agent. Manages the entire code feedback cycle, from problem identification to reviewing implemented fixes.',
        prReviewAgentMinimal: 'PR Review',
        issueResolutionAgentMinimal: 'Issue Resolution',
        fullServiceAgentMinimal: 'Full Service',

        //Repository
        repositoryTitle: 'Repository',
        repositorySubTitle: 'GitHub Repositories',
        addRepository: 'Add Repository',
        searchRepository: 'Search Repositories',
        tryAgain: 'Try Again',
        addFirstRepository: 'Add your first repository',
        loadRepositories: 'Loading repositories...',

        // Response Length
        concise: 'Concise',
        conciseDesc: 'Short and direct responses (40% of maximum tokens)',
        medium: 'Medium',
        mediumDesc: 'Responses with medium level of detail (60% of maximum tokens)',
        detailed: 'Detailed',
        detailedDesc: 'Complete and detailed responses (100% of maximum tokens)',

        // Agent Creation
        back: 'Back',
        cancel: 'Cancel',
        next: 'Next',
        createAgent: 'Create Agent',
        repoAndFunction: 'Repository and Function',
        modelAndConfig: 'Model and Configuration',
        review: 'Review',
        createNewAgentTitle: 'Create New Agent',
        selectRepoAndFunction: 'Select Repository and Agent Function',
        repoAgentLimit: 'A repository can have up to 2 agents with different functions, or 1 "Full-Service" agent',
        selectRepository: 'Select a repository',
        agentLimitReached: '(Agent limit reached)',
        selectAgentFunction: 'Select agent function:',
        repositoryLimitReached: 'This repository has reached its agent limit.',
        alreadyHasFullService: 'This repository already has a Full-Service agent.',
        alreadyHasAllFunctions: 'This repository already has agents for all available functions.',
        configureYourAgent: 'Configure Your Agent',
        agentName: 'Agent Name',
        agentNamePlaceholder: 'e.g., CodeReviewer, IssueHelper',
        chooseDescriptiveName: 'Choose a descriptive name for your agent',
        selectAIModel: 'Select AI Model:',
        provider: 'Provider: {name}',
        promptCosts: 'Prompt Cost:',
        completionCosts: 'Cost of Completion:',
        maxTokens: 'Max tokens: {count}',
        monitoredBranches: 'Monitored Branches',
        addBranchName: 'Add branch name',
        branchesToMonitor: 'Add the branches you want this agent to monitor',
        responseDetailLevel: 'Response Detail Level',
        reviewAgentConfig: 'Review Agent Configuration',
        repository: 'Repository',
        notSelected: 'Not selected',
        model: 'Model',
        responseDetail: 'Response Detail',
        estimatedTokens: 'Estimated Tokens',
        of: 'of',
        estimatedCost30Days: 'Estimated cost for the next 30 days',
        basedOnAverage: 'Based on an average of 1 operation per day',
        agentActiveInfo: 'Your agent will be active immediately after creation. You can pause it at any time from the Agents page.',
        loadingModels: 'Loading AI models...',

        // Repository Card
        addAgent: 'Add Agent',
        noAgentsInRepo: 'This repository has no agents yet.',
        allAgentInRepo: 'This repository already has all allowed agent types',
        fullServiceInRepo: 'This repository already has a Full-Service Agent',
        

        // Agent Item
        active: 'Active',
        inactive: 'Inactive',
        responseConfig: 'Response configuration:',
        costThisMonth: 'Cost this month:',
        deactivateAgent: 'Deactivate agent',
        activateAgent: 'Activate agent',
        deleteAgent: 'Delete agent',
        repositoryAgentItem: 'Repository',
        tokenPerResponse: 'tokens per response',

        //Operation History
        operationHistoryTitle: 'Operation History',
        operationHistoryAgent: 'Agent Operations',
        operationSearch: 'Search in operations or repositories',
        operationAgent: 'Agent',
        operationAllAgents: 'All Agents',
        operationType: 'Operation Type',
        operationAllTypes: 'All Types',
        operationCost: 'Total Cost',
        operationSearchResults: 'No operations match your filters.',

        //keys
        keysTitle: 'Insert your AI API keys',
        editKeys: 'Edit Key',
        deleteKey: 'Delete Key',
        addKey: 'Add Key',
        saveKey: 'Save Key',
        cancelKey: 'Cancel',

        // Common
        function: 'Function',
        in: 'in',

        // Costs
        'noHistoricalData': 'No historical cost data available. Costs will be displayed when there are agent operations.',
        'currentMonthCosts': "Monthly Costs:",
        'fromLastMonth': 'from last month',
        'breakdown': 'Breakdown',
        'costTrends': 'Cost Trends',
        'timeframe': 'Timeframe',
        'monthly': 'Monthly',
        'weekly': 'Weekly',
        'daily': 'Daily',
        'month': 'Month',
        'total': 'Total',
        'monthlyCostDistribution': 'Monthly Cost Distribution',
        'costBreakdown': 'Cost Breakdown',
        'viewBy': 'View By',
        'name': 'Name',
        'type': 'Type',
        'repository': 'Repository',
        'monthlyCost': 'Monthly Cost',
        'percentageOfTotal': '% of Total',
        'agent': 'Agent',
        'model': 'Model',

        settings: {
            ai_keys: {
                title: 'Manage your AI keys',
                description: 'Add or edit your AI providers\' API keys to use agents in your repositories. Your keys are encrypted and securely stored.',
                loading: 'Loading providers and keys information...',
                configured: 'Configured',
                not_configured: 'Not configured',
                secret_key: 'Secret key',
                key_secure: 'Your key is securely stored and encrypted.',
                key_saved: '{provider} key saved successfully!',
                key_deleted: '{provider} key removed successfully!',
                saving: 'Saving...',
                save: 'Save',
                deleting: 'Deleting...',
                delete: 'Delete',
                edit: 'Edit',
                configure: 'Configure',
                cancel: 'Cancel',
                show: 'Show',
                hide: 'Hide',
                delete_confirm_title: 'Confirm deletion',
                delete_confirm_message: 'Are you sure you want to delete the {provider} key? This action cannot be undone.',
                invalid_format: '{provider} key format is incorrect.',
                placeholder: 'Enter your {provider} secret key to enable agents.',
                openai_models: 'Used for agents based on OpenAI models (e.g., GPT-4, GPT-4o-mini, etc.)',
                anthropic_models: 'Used for agents based on Anthropic models (e.g., Claude, etc.)',
                info_title: 'Your keys\' security',
                info_encrypted: 'All keys are stored in an encrypted way.',
                info_security: 'We never share your keys with third parties.',
                info_revoke: 'You can revoke a key at any time.',
                info_formats: 'Each provider has its own specific key format.',
            }
        }
    }
};

// Criação do contexto
export const LanguageContext = createContext();

// Hook personalizado para usar o contexto
export const useLanguage = () => useContext(LanguageContext);

// Provedor do contexto
export const LanguageProvider = ({ children }) => {
    // Verificar se já existe um idioma salvo, senão usar o do navegador
    const getSavedLanguage = () => {
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'pt-BR' || savedLang === 'en-US')) {
            return savedLang;
        }
        // Tenta detectar o idioma do navegador
        const browserLang = navigator.language;
        return browserLang === 'pt-BR' ? 'pt-BR' : 'en-US';
    };

    const [language, setLanguage] = useState(getSavedLanguage());

    // Função para alterar o idioma
    const changeLanguage = (lang) => {
        if (lang === 'pt-BR' || lang === 'en-US') {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    const t = (key, params = {}) => {
        const getNested = (obj, path) =>
            path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);

        const text = getNested(translations[language], key) || key;

        if (Object.keys(params).length > 0) {
            return Object.keys(params).reduce((result, param) => {
                return result.replace(`{${param}}`, params[param]);
            }, text);
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            currentLanguage: language, // Export currentLanguage as well for backwards compatibility
            changeLanguage,
            t
        }}>
            {children}
        </LanguageContext.Provider>
    );
};