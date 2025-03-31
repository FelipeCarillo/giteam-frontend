// routes.js
import { Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import AgentCreate from './pages/AgentCreate';
import Repositories from './pages/Repositories';
import OperationHistory from './pages/OperationHistory';
import Costs from './pages/Costs';
import Settings from './pages/Settings';
import AuthCallback from './pages/AuthCallback';

const isAuthenticated = () => {
    return localStorage.getItem('githubToken') !== null;
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Aplicar ProtectedRoute para todas as rotas protegidas
const withProtection = (Component) => {
    return <ProtectedRoute><Component /></ProtectedRoute>;
};

const routes = [
    {
        path: '/',
        element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Home />,
    },
    {
        path: '/auth/callback',
        element: <AuthCallback />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/agents',
        element: <Agents />,
    },
    {
        path: '/agents/create',
        element: <AgentCreate />,
    },
    {
        path: '/repositories',
        element: <Repositories />,
    },
    {
        path: '/operations',
        element: <OperationHistory />,
    },
    {
        path: '/costs',
        element: <Costs />,
    },
    {
        path: '/settings',
        element: <Settings />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
];

export default routes;