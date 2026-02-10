import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Clients } from './pages/Clients';
import { Scanner } from './pages/Scanner'; // Preserved Scanner
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Preserved corrected import

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#101010] text-brand-primary">Loading System...</div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="scanner" element={<Scanner />} /> {/* Preserved */}
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
