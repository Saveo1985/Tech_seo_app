import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import { Settings } from '@/pages/Settings';
import { Scanner } from '@/pages/Scanner';

// KEIN LOGIN MEHR ERFORDERLICH
// Wir rendern die Layout-Komponente direkt ohne Schutz.

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Shell Routes - No Protection */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="scanner" element={<Scanner />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
