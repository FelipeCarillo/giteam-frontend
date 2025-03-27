import { Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
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
        element: <Dashboard />
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
];

export default routes;