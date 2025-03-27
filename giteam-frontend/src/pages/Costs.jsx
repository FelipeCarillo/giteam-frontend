import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Divider,
    useTheme,
    IconButton,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
    ListItemIcon,
    ListItemText,
    Switch,
    FormControlLabel,
    Tooltip,
} from '@mui/material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/Download';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, subDays, subMonths, isSameMonth, isSameDay, addDays } from 'date-fns';
import MainLayout from '../layouts/MainLayout';

function Costs() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const [chartType, setChartType] = useState('line');
    const [timeRange, setTimeRange] = useState('30d');
    const [filterAgent, setFilterAgent] = useState('all');
    const [filterRepository, setFilterRepository] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState(new Date());
    const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
    const [groupBy, setGroupBy] = useState('day');
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Color schemes for charts
    const agentColors = {
        'PRBuddy': isDarkMode ? '#2ea043' : '#2ea44f',
        'IssueGenius': isDarkMode ? '#a371f7' : '#6f42c1',
        'CodeReviewer': isDarkMode ? '#f0883e' : '#e36209',
        'DocHelper': isDarkMode ? '#58a6ff' : '#0366d6',
    };

    const modelColors = {
        'GPT-4': isDarkMode ? '#2ea043' : '#2ea44f',
        'Claude 3': isDarkMode ? '#a371f7' : '#6f42c1',
        'Llama 3': isDarkMode ? '#f0883e' : '#e36209',
        'GPT-3.5': isDarkMode ? '#58a6ff' : '#0366d6',
    };

    const operationTypeColors = {
        'PR Review': isDarkMode ? '#f0723e' : '#e34c26',
        'Issue Analysis': isDarkMode ? '#a78ddc' : '#6f42c1',
    };

    // Sample cost data
    const costRecords = [
        {
            id: 'cost-001',
            date: '2025-03-27',
            agentId: 1,
            agentName: 'PRBuddy',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            operationType: 'PR Review',
            operationCount: 3,
            tokensUsed: 12450,
            modelUsed: 'GPT-4',
            cost: 0.85,
        },
        {
            id: 'cost-002',
            date: '2025-03-27',
            agentId: 2,
            agentName: 'IssueGenius',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'Issue Analysis',
            operationCount: 2,
            tokensUsed: 8340,
            modelUsed: 'Claude 3',
            cost: 1.25,
        },
        {
            id: 'cost-003',
            date: '2025-03-26',
            agentId: 4,
            agentName: 'DocHelper',
            repository: 'apaeleilao_backend',
            repoLink: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            operationType: 'PR Review',
            operationCount: 1,
            tokensUsed: 5450,
            modelUsed: 'GPT-3.5',
            cost: 0.35,
        },
        {
            id: 'cost-004',
            date: '2025-03-26',
            agentId: 3,
            agentName: 'CodeReviewer',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'PR Review',
            operationCount: 2,
            tokensUsed: 9120,
            modelUsed: 'Llama 3',
            cost: 0.65,
        },
        {
            id: 'cost-005',
            date: '2025-03-25',
            agentId: 1,
            agentName: 'PRBuddy',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            operationType: 'PR Review',
            operationCount: 1,
            tokensUsed: 4520,
            modelUsed: 'GPT-4',
            cost: 0.42,
        },
        {
            id: 'cost-006',
            date: '2025-03-24',
            agentId: 2,
            agentName: 'IssueGenius',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'Issue Analysis',
            operationCount: 3,
            tokensUsed: 12760,
            modelUsed: 'Claude 3',
            cost: 1.75,
        },
        {
            id: 'cost-007',
            date: '2025-03-24',
            agentId: 4,
            agentName: 'DocHelper',
            repository: 'apaeleilao_backend',
            repoLink: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            operationType: 'Issue Analysis',
            operationCount: 1,
            tokensUsed: 3890,
            modelUsed: 'GPT-3.5',
            cost: 0.28,
        },
        {
            id: 'cost-008',
            date: '2025-03-23',
            agentId: 1,
            agentName: 'PRBuddy',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            operationType: 'PR Review',
            operationCount: 2,
            tokensUsed: 7340,
            modelUsed: 'GPT-4',
            cost: 0.68,
        },
        {
            id: 'cost-009',
            date: '2025-03-22',
            agentId: 3,
            agentName: 'CodeReviewer',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'PR Review',
            operationCount: 1,
            tokensUsed: 4760,
            modelUsed: 'Llama 3',
            cost: 0.32,
        },
        {
            id: 'cost-010',
            date: '2025-03-21',
            agentId: 2,
            agentName: 'IssueGenius',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'Issue Analysis',
            operationCount: 2,
            tokensUsed: 9340,
            modelUsed: 'Claude 3',
            cost: 1.45,
        },
    ];

    // Generate historical data for past 90 days
    const generateHistoricalData = () => {
        const data = [];
        const endDate = new Date();
        const startDate = subDays(endDate, 90);
        let currentDate = startDate;
        
        // Agent probabilities (some days won't have all agents)
        const agents = [
            { name: 'PRBuddy', model: 'GPT-4', operationType: 'PR Review', probability: 0.7 },
            { name: 'IssueGenius', model: 'Claude 3', operationType: 'Issue Analysis', probability: 0.6 },
            { name: 'CodeReviewer', model: 'Llama 3', operationType: 'PR Review', probability: 0.4 },
            { name: 'DocHelper', model: 'GPT-3.5', operationType: 'Both', probability: 0.5 },
        ];
        
        let id = 100;
        
        while (currentDate <= endDate) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            
            // For each agent, decide if they were active that day
            agents.forEach((agent, index) => {
                if (Math.random() < agent.probability) {
                    // Operations count varies
                    const operationCount = Math.floor(Math.random() * 3) + 1;
                    // Tokens used per operation
                    const tokensPerOp = agent.model === 'GPT-4' ? 4000 : 
                                        agent.model === 'Claude 3' ? 5000 :
                                        agent.model === 'Llama 3' ? 4500 : 3500;
                    
                    // Total tokens
                    const tokensUsed = tokensPerOp * operationCount + Math.floor(Math.random() * 1000);
                    
                    // Cost per token varies by model
                    const costPerToken = agent.model === 'GPT-4' ? 0.00008 : 
                                          agent.model === 'Claude 3' ? 0.00011 :
                                          agent.model === 'Llama 3' ? 0.00007 : 0.00005;
                    
                    // Final cost with some randomization
                    const cost = (tokensUsed * costPerToken) * (0.9 + Math.random() * 0.2);
                    
                    // For DocHelper, randomly choose operation type
                    const operationType = agent.operationType === 'Both' ? 
                                      (Math.random() > 0.5 ? 'PR Review' : 'Issue Analysis') :
                                      agent.operationType;
                    
                    data.push({
                        id: `cost-${id++}`,
                        date: dateStr,
                        agentId: index + 1,
                        agentName: agent.name,
                        repository: ['giteams', 'chat-question-awnser', 'apaeleilao_backend'][Math.floor(Math.random() * 3)],
                        operationType,
                        operationCount,
                        tokensUsed,
                        modelUsed: agent.model,
                        cost: parseFloat(cost.toFixed(2)),
                    });
                }
            });
            
            currentDate = addDays(currentDate, 1);
        }
        
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const historicalCostData = generateHistoricalData();

    // Filter data by date range and other filters
    const getFilteredData = () => {
        let filtered = [...historicalCostData];
        
        // Date range filter
        filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= startDate && recordDate <= endDate;
        });
        
        // Agent filter
        if (filterAgent !== 'all') {
            filtered = filtered.filter(record => record.agentId === Number(filterAgent));
        }
        
        // Repository filter
        if (filterRepository !== 'all') {
            filtered = filtered.filter(record => record.repository === filterRepository);
        }
        
        // Operation type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(record => record.operationType === filterType);
        }
        
        return filtered;
    };

    const filteredCostData = getFilteredData();

    // Prepare chart data based on grouping
    const prepareChartData = () => {
        const filtered = getFilteredData();
        let chartData = [];
        
        if (groupBy === 'day') {
            // Group by day
            const dailyData = {};
            
            filtered.forEach(record => {
                const day = record.date;
                if (!dailyData[day]) {
                    dailyData[day] = {
                        date: day,
                        total: 0,
                        PRBuddy: 0,
                        IssueGenius: 0,
                        CodeReviewer: 0,
                        DocHelper: 0,
                        'PR Review': 0,
                        'Issue Analysis': 0,
                        'GPT-4': 0,
                        'Claude 3': 0,
                        'Llama 3': 0, 
                        'GPT-3.5': 0,
                    };
                }
                
                dailyData[day].total += record.cost;
                dailyData[day][record.agentName] += record.cost;
                dailyData[day][record.operationType] += record.cost;
                dailyData[day][record.modelUsed] += record.cost;
            });
            
            chartData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (groupBy === 'month') {
            // Group by month
            const monthlyData = {};
            
            filtered.forEach(record => {
                const date = new Date(record.date);
                const month = format(date, 'yyyy-MM');
                
                if (!monthlyData[month]) {
                    monthlyData[month] = {
                        date: month,
                        total: 0,
                        PRBuddy: 0,
                        IssueGenius: 0,
                        CodeReviewer: 0,
                        DocHelper: 0,
                        'PR Review': 0,
                        'Issue Analysis': 0,
                        'GPT-4': 0,
                        'Claude 3': 0,
                        'Llama 3': 0, 
                        'GPT-3.5': 0,
                    };
                }
                
                monthlyData[month].total += record.cost;
                monthlyData[month][record.agentName] += record.cost;
                monthlyData[month][record.operationType] += record.cost;
                monthlyData[month][record.modelUsed] += record.cost;
            });
            
            chartData = Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
        } else if (groupBy === 'agent') {
            // Group by agent
            const agentData = {
                PRBuddy: 0,
                IssueGenius: 0,
                CodeReviewer: 0,
                DocHelper: 0,
            };
            
            filtered.forEach(record => {
                agentData[record.agentName] += record.cost;
            });
            
            chartData = Object.entries(agentData).map(([name, value]) => ({ name, value }));
        } else if (groupBy === 'model') {
            // Group by model
            const modelData = {
                'GPT-4': 0,
                'Claude 3': 0,
                'Llama 3': 0,
                'GPT-3.5': 0,
            };
            
            filtered.forEach(record => {
                modelData[record.modelUsed] += record.cost;
            });
            
            chartData = Object.entries(modelData).map(([name, value]) => ({ name, value }));
        } else if (groupBy === 'operation') {
            // Group by operation type
            const opData = {
                'PR Review': 0,
                'Issue Analysis': 0,
            };
            
            filtered.forEach(record => {
                opData[record.operationType] += record.cost;
            });
            
            chartData = Object.entries(opData).map(([name, value]) => ({ name, value }));
        } else if (groupBy === 'repository') {
            // Group by repository
            const repoData = {};
            
            filtered.forEach(record => {
                if (!repoData[record.repository]) {
                    repoData[record.repository] = 0;
                }
                repoData[record.repository] += record.cost;
            });
            
            chartData = Object.entries(repoData).map(([name, value]) => ({ name, value }));
        }
        
        return chartData;
    };

    const chartData = prepareChartData();

    // Update date range based on selected time range
    useEffect(() => {
        const now = new Date();
        
        switch (timeRange) {
            case '7d':
                setStartDate(subDays(now, 7));
                setEndDate(now);
                break;
            case '30d':
                setStartDate(subDays(now, 30));
                setEndDate(now);
                break;
            case '90d':
                setStartDate(subDays(now, 90));
                setEndDate(now);
                break;
            case 'ytd':
                setStartDate(new Date(now.getFullYear(), 0, 1)); // January 1 of current year
                setEndDate(now);
                break;
            case 'all':
                // Find the earliest record date
                const dates = historicalCostData.map(record => new Date(record.date));
                const earliest = new Date(Math.min(...dates));
                setStartDate(earliest);
                setEndDate(now);
                break;
            default:
                break;
        }
    }, [timeRange, historicalCostData]);

    // Handle filter menu
    const handleFilterClick = (event) => {
        setFilterMenuAnchor(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterMenuAnchor(null);
    };

    const isFilterActive = () => {
        return filterAgent !== 'all' || 
               filterRepository !== 'all' || 
               filterType !== 'all';
    };

    // Change chart display
    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        
        // Set appropriate grouping based on tab
        if (newValue === 0) setGroupBy('day');
        else if (newValue === 1) setGroupBy('agent');
        else if (newValue === 2) setGroupBy('model');
    };

    // Calculate summary statistics
    const getTotalCost = () => {
        return filteredCostData.reduce((sum, item) => sum + item.cost, 0).toFixed(2);
    };
    
    const getTokensUsed = () => {
        return filteredCostData.reduce((sum, item) => sum + item.tokensUsed, 0).toLocaleString();
    };
    
    const getOperationsCount = () => {
        return filteredCostData.reduce((sum, item) => sum + item.operationCount, 0);
    };
    
    const getAgentCost = (agentName) => {
        return filteredCostData
            .filter(item => item.agentName === agentName)
            .reduce((sum, item) => sum + item.cost, 0).toFixed(2);
    };
    
    const getModelCost = (modelName) => {
        return filteredCostData
            .filter(item => item.modelUsed === modelName)
            .reduce((sum, item) => sum + item.cost, 0).toFixed(2);
    };
    
    const getOperationTypeCost = (type) => {
        return filteredCostData
            .filter(item => item.operationType === type)
            .reduce((sum, item) => sum + item.cost, 0).toFixed(2);
    };

    // Calculate cost trends (compared to previous period)
    const calculateTrend = () => {
        // Get current period total
        const currentTotal = parseFloat(getTotalCost());
        
        // Calculate previous period date range (same length as current)
        const currentPeriodDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const previousPeriodEnd = new Date(startDate);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        const previousPeriodStart = new Date(previousPeriodEnd);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - currentPeriodDays);
        
        // Calculate previous period total
        const previousTotal = historicalCostData
            .filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= previousPeriodStart && recordDate <= previousPeriodEnd;
            })
            .reduce((sum, item) => sum + item.cost, 0);
        
        // Calculate percentage change
        if (previousTotal === 0) return { change: 100, increasing: true }; // If previous was 0, show as 100% increase
        
        const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        return { 
            change: Math.abs(percentChange).toFixed(1), 
            increasing: percentChange > 0 
        };
    };
    
    const trend = calculateTrend();

    // Render appropriate chart based on selection
    const renderChart = () => {
        if (['agent', 'model', 'operation', 'repository'].includes(groupBy)) {
            // Pie chart for categorical data
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => {
                                let color;
                                if (groupBy === 'agent') color = agentColors[entry.name] || primaryColor;
                                else if (groupBy === 'model') color = modelColors[entry.name] || primaryColor;
                                else if (groupBy === 'operation') color = operationTypeColors[entry.name] || primaryColor;
                                else color = `hsl(${(index * 137) % 360}, 70%, ${isDarkMode ? '65%' : '45%'})`;
                                
                                return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        }
        
        // For time-based data (day or month)
        if (chartType === 'line') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(date) => groupBy === 'day' ? format(new Date(date), 'MMM d') : format(new Date(`${date}-01`), 'MMM yyyy')}
                        />
                        <YAxis
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip
                            formatter={(value) => `$${value.toFixed(2)}`}
                            labelFormatter={(label) => groupBy === 'day' ? format(new Date(label), 'MMM d, yyyy') : format(new Date(`${label}-01`), 'MMMM yyyy')}
                        />
                        <Legend />
                        
                        {tabValue === 0 && (
                            <Line
                                type="monotone"
                                dataKey="total"
                                name="Total Cost"
                                stroke={primaryColor}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        )}
                        
                        {tabValue === 1 && Object.keys(agentColors).map(agent => (
                            <Line
                                key={agent}
                                type="monotone"
                                dataKey={agent}
                                name={agent}
                                stroke={agentColors[agent]}
                                dot={{ fill: agentColors[agent] }}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        ))}
                        
                        {tabValue === 2 && Object.keys(modelColors).map(model => (
                            <Line
                                key={model}
                                type="monotone"
                                dataKey={model}
                                name={model}
                                stroke={modelColors[model]}
                                dot={{ fill: modelColors[model] }}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        ))}
                        
                        {tabValue === 3 && Object.keys(operationTypeColors).map(type => (
                            <Line
                                key={type}
                                type="monotone"
                                dataKey={type}
                                name={type}
                                stroke={operationTypeColors[type]}
                                dot={{ fill: operationTypeColors[type] }}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'area') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(date) => groupBy === 'day' ? format(new Date(date), 'MMM d') : format(new Date(`${date}-01`), 'MMM yyyy')}
                        />
                        <YAxis
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip
                            formatter={(value) => `$${value.toFixed(2)}`}
                            labelFormatter={(label) => groupBy === 'day' ? format(new Date(label), 'MMM d, yyyy') : format(new Date(`${label}-01`), 'MMMM yyyy')}
                        />
                        <Legend />
                        
                        {tabValue === 0 && (
                            <Area
                                type="monotone"
                                dataKey="total"
                                name="Total Cost"
                                stroke={primaryColor}
                                fill={`${primaryColor}40`}
                            />
                        )}
                        
                        {tabValue === 1 && Object.keys(agentColors).map(agent => (
                            <Area
                                key={agent}
                                type="monotone"
                                dataKey={agent}
                                name={agent}
                                stroke={agentColors[agent]}
                                fill={`${agentColors[agent]}40`}
                                stackId="1"
                            />
                        ))}
                        
                        {tabValue === 2 && Object.keys(modelColors).map(model => (
                            <Area
                                key={model}
                                type="monotone"
                                dataKey={model}
                                name={model}
                                stroke={modelColors[model]}
                                fill={`${modelColors[model]}40`}
                                stackId="1"
                            />
                        ))}
                        
                        {tabValue === 3 && Object.keys(operationTypeColors).map(type => (
                            <Area
                                key={type}
                                type="monotone"
                                dataKey={type}
                                name={type}
                                stroke={operationTypeColors[type]}
                                fill={`${operationTypeColors[type]}40`}
                                stackId="1"
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'bar') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(date) => groupBy === 'day' ? format(new Date(date), 'MMM d') : format(new Date(`${date}-01`), 'MMM yyyy')}
                        />
                        <YAxis
                            tick={{ fill: secondaryTextColor }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <RechartsTooltip
                            formatter={(value) => `$${value.toFixed(2)}`}
                            labelFormatter={(label) => groupBy === 'day' ? format(new Date(label), 'MMM d, yyyy') : format(new Date(`${label}-01`), 'MMMM yyyy')}
                        />
                        <Legend />
                        
                        {tabValue === 0 && (
                            <Bar
                                dataKey="total"
                                name="Total Cost"
                                fill={primaryColor}
                            />
                        )}
                        
                        {tabValue === 1 && Object.keys(agentColors).map(agent => (
                            <Bar
                                key={agent}
                                dataKey={agent}
                                name={agent}
                                fill={agentColors[agent]}
                                stackId="a"
                            />
                        ))}
                        
                        {tabValue === 2 && Object.keys(modelColors).map(model => (
                            <Bar
                                key={model}
                                dataKey={model}
                                name={model}
                                fill={modelColors[model]}
                                stackId="a"
                            />
                        ))}
                        
                        {tabValue === 3 && Object.keys(operationTypeColors).map(type => (
                            <Bar
                                key={type}
                                dataKey={type}
                                name={type}
                                fill={operationTypeColors[type]}
                                stackId="a"
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    };

    return (
        <MainLayout title="Cost Analytics">
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                {/* Cost Summary */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    backgroundColor: paperBgColor,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PaidIcon sx={{ color: primaryColor, mr: 1 }} />
                                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            Total Cost
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {trend.increasing ? (
                                            <TrendingUpIcon sx={{ color: isDarkMode ? '#ff7b72' : '#d73a49', mr: 1 }} />
                                        ) : (
                                            <TrendingDownIcon sx={{ color: isDarkMode ? '#7ee787' : '#2ea44f', mr: 1 }} />
                                        )}
                                        <Typography variant="body2" sx={{ 
                                            color: trend.increasing ? 
                                                (isDarkMode ? '#ff7b72' : '#d73a49') : 
                                                (isDarkMode ? '#7ee787' : '#2ea44f') 
                                        }}>
                                            {trend.increasing ? '+' : '-'}{trend.change}% {trend.increasing ? 'increase' : 'decrease'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    ${getTotalCost()}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 4 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Operations
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: primaryTextColor }}>
                                            {getOperationsCount()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Tokens
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: primaryTextColor }}>
                                            {getTokensUsed()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Period
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: primaryTextColor }}>
                                            {timeRange}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    backgroundColor: paperBgColor,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    Cost Breakdown
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" fontWeight="500" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            By Agent
                                        </Typography>
                                        {Object.keys(agentColors).map(agent => (
                                            <Box 
                                                key={agent} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    mb: 0.5 
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: agentColors[agent],
                                                            mr: 1
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                        {agent}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                    ${getAgentCost(agent)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" fontWeight="500" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            By Model
                                        </Typography>
                                        {Object.keys(modelColors).map(model => (
                                            <Box 
                                                key={model} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    mb: 0.5 
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: modelColors[model],
                                                            mr: 1
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                        {model}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                    ${getModelCost(model)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" fontWeight="500" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            By Type
                                        </Typography>
                                        {Object.keys(operationTypeColors).map(type => (
                                            <Box 
                                                key={type} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    mb: 0.5 
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: operationTypeColors[type],
                                                            mr: 1
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                        {type}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                    ${getOperationTypeCost(type)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Chart controls and filters */}
                <Box sx={{ mb: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Time Range</InputLabel>
                                        <Select
                                            value={timeRange}
                                            onChange={(e) => setTimeRange(e.target.value)}
                                            label="Time Range"
                                        >
                                            <MenuItem value="7d">Last 7 Days</MenuItem>
                                            <MenuItem value="30d">Last 30 Days</MenuItem>
                                            <MenuItem value="90d">Last 90 Days</MenuItem>
                                            <MenuItem value="ytd">Year to Date</MenuItem>
                                            <MenuItem value="all">All Time</MenuItem>
                                        </Select>
                                    </FormControl>
                                    
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Group By</InputLabel>
                                        <Select
                                            value={groupBy}
                                            onChange={(e) => setGroupBy(e.target.value)}
                                            label="Group By"
                                        >
                                            <MenuItem value="day">Daily</MenuItem>
                                            <MenuItem value="month">Monthly</MenuItem>
                                            <MenuItem value="agent">Agent</MenuItem>
                                            <MenuItem value="model">Model</MenuItem>
                                            <MenuItem value="operation">Operation Type</MenuItem>
                                            <MenuItem value="repository">Repository</MenuItem>
                                        </Select>
                                    </FormControl>
                                    
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterListIcon />}
                                        endIcon={<KeyboardArrowDownIcon />}
                                        onClick={handleFilterClick}
                                        sx={{
                                            borderColor: isFilterActive() ? primaryColor : borderColor,
                                            color: isFilterActive() ? primaryColor : secondaryTextColor,
                                            backgroundColor: isFilterActive() ? (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') : 'transparent',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Filters {isFilterActive() && '(Active)'}
                                    </Button>
                                    
                                    <Menu
                                        anchorEl={filterMenuAnchor}
                                        open={Boolean(filterMenuAnchor)}
                                        onClose={handleFilterClose}
                                        sx={{ mt: 1 }}
                                    >
                                        <Box sx={{ p: 2, width: 300 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 2, color: primaryTextColor }}>
                                                Filter Costs
                                            </Typography>
                                            
                                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                <InputLabel>Agent</InputLabel>
                                                <Select
                                                    value={filterAgent}
                                                    onChange={(e) => setFilterAgent(e.target.value)}
                                                    label="Agent"
                                                >
                                                    <MenuItem value="all">All Agents</MenuItem>
                                                    <MenuItem value="1">PRBuddy</MenuItem>
                                                    <MenuItem value="2">IssueGenius</MenuItem>
                                                    <MenuItem value="3">CodeReviewer</MenuItem>
                                                    <MenuItem value="4">DocHelper</MenuItem>
                                                </Select>
                                            </FormControl>
                                            
                                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                <InputLabel>Repository</InputLabel>
                                                <Select
                                                    value={filterRepository}
                                                    onChange={(e) => setFilterRepository(e.target.value)}
                                                    label="Repository"
                                                >
                                                    <MenuItem value="all">All Repositories</MenuItem>
                                                    <MenuItem value="giteams">giteams</MenuItem>
                                                    <MenuItem value="chat-question-awnser">chat-question-awnser</MenuItem>
                                                    <MenuItem value="apaeleilao_backend">apaeleilao_backend</MenuItem>
                                                </Select>
                                            </FormControl>
                                            
                                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                <InputLabel>Operation Type</InputLabel>
                                                <Select
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                    label="Operation Type"
                                                >
                                                    <MenuItem value="all">All Types</MenuItem>
                                                    <MenuItem value="PR Review">PR Review</MenuItem>
                                                    <MenuItem value="Issue Analysis">Issue Analysis</MenuItem>
                                                </Select>
                                            </FormControl>
                                            
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setFilterAgent('all');
                                                        setFilterRepository('all');
                                                        setFilterType('all');
                                                    }}
                                                    sx={{ textTransform: 'none', color: secondaryTextColor }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={handleFilterClose}
                                                    sx={{ 
                                                        textTransform: 'none',
                                                        backgroundColor: primaryColor,
                                                        '&:hover': {
                                                            backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                                        },
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Menu>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    {['day', 'month'].includes(groupBy) && (
                                        <>
                                            <Tooltip title="Line Chart">
                                                <IconButton
                                                    onClick={() => handleChartTypeChange('line')}
                                                    sx={{
                                                        color: chartType === 'line' ? primaryColor : secondaryTextColor,
                                                        backgroundColor: chartType === 'line' ? (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') : 'transparent',
                                                        border: `1px solid ${chartType === 'line' ? primaryColor : borderColor}`,
                                                    }}
                                                >
                                                    <ViewTimelineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Area Chart">
                                                <IconButton
                                                    onClick={() => handleChartTypeChange('area')}
                                                    sx={{
                                                        color: chartType === 'area' ? primaryColor : secondaryTextColor,
                                                        backgroundColor: chartType === 'area' ? (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') : 'transparent',
                                                        border: `1px solid ${chartType === 'area' ? primaryColor : borderColor}`,
                                                    }}
                                                >
                                                    <AreaChart />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Bar Chart">
                                                <IconButton
                                                    onClick={() => handleChartTypeChange('bar')}
                                                    sx={{
                                                        color: chartType === 'bar' ? primaryColor : secondaryTextColor,
                                                        backgroundColor: chartType === 'bar' ? (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') : 'transparent',
                                                        border: `1px solid ${chartType === 'bar' ? primaryColor : borderColor}`,
                                                    }}
                                                >
                                                    <BarChartIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                    
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            borderColor: borderColor,
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Export Data
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Tabs and Chart */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    {['day', 'month'].includes(groupBy) && (
                        <Box sx={{ borderBottom: `1px solid ${borderColor}` }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: primaryColor,
                                    },
                                }}
                            >
                                <Tab
                                    label="Total Costs"
                                    sx={{
                                        textTransform: 'none',
                                        color: tabValue === 0 ? primaryColor : secondaryTextColor,
                                        '&.Mui-selected': {
                                            color: primaryColor,
                                        },
                                    }}
                                />
                                <Tab
                                    label="By Agent"
                                    sx={{
                                        textTransform: 'none',
                                        color: tabValue === 1 ? primaryColor : secondaryTextColor,
                                        '&.Mui-selected': {
                                            color: primaryColor,
                                        },
                                    }}
                                />
                                <Tab
                                    label="By Model"
                                    sx={{
                                        textTransform: 'none',
                                        color: tabValue === 2 ? primaryColor : secondaryTextColor,
                                        '&.Mui-selected': {
                                            color: primaryColor,
                                        },
                                    }}
                                />
                                <Tab
                                    label="By Operation Type"
                                    sx={{
                                        textTransform: 'none',
                                        color: tabValue === 3 ? primaryColor : secondaryTextColor,
                                        '&.Mui-selected': {
                                            color: primaryColor,
                                        },
                                    }}
                                />
                            </Tabs>
                        </Box>
                    )}
                    
                    <Box sx={{ p: 3 }}>
                        {chartData.length > 0 ? (
                            renderChart()
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                                <Typography variant="body1" sx={{ color: secondaryTextColor }}>
                                    No data available for the selected filters.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* Cost Optimization Tips */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                        mb: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LightbulbIcon sx={{ color: isDarkMode ? '#f0b429' : '#e3b341', mr: 1 }} />
                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                            Cost Optimization Tips
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    Use Cost-Effective Models
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Consider using more affordable models like GPT-3.5 for simpler tasks. 
                                    Reserve higher-cost models like GPT-4 or Claude 3 for complex code reviews.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    Set Branch Filters
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Configure your PR review agents to only monitor important branches 
                                    rather than all branches to reduce unnecessary operations.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    Implement Usage Limits
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Set monthly budget limits for each repository or agent to avoid unexpected costs.
                                    Receive alerts when approaching your defined thresholds.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Cost Records Table */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}` }}>
                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                            Detailed Cost Records
                        </Typography>
                    </Box>
                    
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                    <TableCell sx={{ color: secondaryTextColor }}>Date</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Agent</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Repository</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Operation Type</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Model</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Operations</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Tokens</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCostData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((record) => (
                                        <TableRow
                                            key={record.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                                                },
                                                borderBottom: `1px solid ${borderColor}`
                                            }}
                                        >
                                            <TableCell>
                                                <Typography sx={{ color: primaryTextColor }}>
                                                    {format(new Date(record.date), 'MMM d, yyyy')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                                            color: isDarkMode ? '#7ee787' : '#2ea44f',
                                                            mr: 1
                                                        }}
                                                    >
                                                        <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                        {record.agentName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                    <a href={record.repoLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                                        {record.repository}
                                                    </a>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={record.operationType}
                                                    icon={
                                                        record.operationType === 'PR Review' ? 
                                                            <CodeIcon sx={{ fontSize: '1rem !important' }} /> : 
                                                            <BugReportIcon sx={{ fontSize: '1rem !important' }} />
                                                    }
                                                    sx={{
                                                        backgroundColor: record.operationType === 'PR Review' ?
                                                            (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)') :
                                                            (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)'),
                                                        color: record.operationType === 'PR Review' ?
                                                            (isDarkMode ? '#f0723e' : '#e34c26') :
                                                            (isDarkMode ? '#a78ddc' : '#6f42c1'),
                                                        '& .MuiChip-icon': {
                                                            color: 'inherit'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                    {record.modelUsed}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                    {record.operationCount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                    {record.tokensUsed.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                    ${record.cost.toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredCostData.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Typography sx={{ color: secondaryTextColor }}>
                                                No cost records found matching your criteria.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredCostData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            color: secondaryTextColor,
                            borderTop: `1px solid ${borderColor}`,
                        }}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
}

export default Costs;