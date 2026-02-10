import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Clients } from './pages/Clients'; // Import updated
import { Login } from './pages/Login';
import { Scanner } from './pages/Scanner'; // PRESERVED existing route
import { AuthProvider, useAuth } from './contexts/AuthContext'; // IMPORT FIX: ./context -> ./contexts
import { Toaster } from 'react-hot-toast';

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
                        <Route path="scanner" element={<Scanner />} /> {/* PRESERVED */}
                    </Route>
                </Routes>
            </Router>
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }} />
        </AuthProvider>
    );
}

export default App;
