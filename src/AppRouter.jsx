import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext.jsx';
import App from './App.jsx';
import AuthCard from './pages/AuthCard.jsx';
import WelcomeSplash from './pages/WelcomeSplash.jsx';
import LearnInfrastructure from './pages/LearnInfrastructure.jsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useAppContext();
    if (!user) return <Navigate to="/" replace />;
    return children;
};

// Authenticated Route Wrapper (redirects away from login if already logged in)
const AuthRoute = ({ children }) => {
    const { user } = useAppContext();
    if (user) return <Navigate to="/app" replace />;
    return children;
};

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthRoute><WelcomeSplash /></AuthRoute>} />
                <Route path="/learn" element={<AuthRoute><LearnInfrastructure /></AuthRoute>} />
                <Route path="/login" element={<AuthRoute><AuthCard isLogin={true} /></AuthRoute>} />
                <Route path="/signup" element={<AuthRoute><AuthCard isLogin={false} /></AuthRoute>} />
                <Route path="/app/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
