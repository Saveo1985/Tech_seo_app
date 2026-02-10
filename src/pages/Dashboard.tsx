import React from 'react';
import { Activity, Database, Server } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-brand-dark text-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif text-brand-primary mb-2">Willkommen zurück, Admin.</h2>
                    <p className="text-gray-400 max-w-lg">
                        Das Tech SEO System ist online und bereit. Alle Dienste funktionieren normal.
                        Datenbankverbindung hergestellt.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-medium">System Status</p>
                        <p className="text-xl font-bold text-gray-800">Operational</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                        <Database size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-medium">Firestore DB</p>
                        <p className="text-xl font-bold text-gray-800">Connected</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-medium">API Latency</p>
                        <p className="text-xl font-bold text-gray-800">24ms</p>
                    </div>
                </div>
            </div>

            {/* Placeholder for Core Feature */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center text-center h-64">
                <h3 className="text-xl font-serif text-gray-400 mb-2">Core Feature Module</h3>
                <p className="text-gray-500">Dieser Bereich ist für die Hauptfunktionalität reserviert.</p>
            </div>
        </div>
    );
};
