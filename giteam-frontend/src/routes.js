// routes.js
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth'; 

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

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const withProtection = (Component) => {
    return () => (
        <ProtectedRoute>
            <Component />
        </ProtectedRoute>
    );
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
        element: withProtection(Dashboard)(),
    },
    {
        path: '/agents',
        element: withProtection(Agents)(),
    },
    {
        path: '/agents/create',
        element: withProtection(AgentCreate)(),
    },
    {
        path: '/repositories',
        element: withProtection(Repositories)(),
    },
    {
        path: '/operations',
        element: withProtection(OperationHistory)(),
    },
    {
        path: '/costs',
        element: withProtection(Costs)(),
    },
    {
        path: '/settings',
        element: withProtection(Settings)(),
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
];

export default routes;