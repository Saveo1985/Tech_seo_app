import React, { useEffect, useState } from 'react';
import { Users, Zap, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getClients } from '../lib/firestore-clients';
import { Client } from '../types';

export function Dashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getClients();
                setClients(data);
            } catch (e) {
                console.error("Dashboard load error", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Stats calculation
    const totalClients = clients.length;
    const activeAutomations = clients.filter(c => c.n8nWebhookMeta || c.n8nWebhookAltText).length;
    // A simple heuristic for "active" could be having at least one webhook configured

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-4xl font-federo text-brand-primary mb-2">Dashboard</h1>
                    <p className="text-gray-600 font-barlow">Willkommen im Tech SEO Control Center.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">System Status</div>
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        ONLINE
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-brand-primary">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg text-brand-primary-dark">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kunden</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{loading ? '-' : totalClients}</div>
                    <p className="text-sm text-gray-500 mt-1">Aktive Mandanten</p>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-brand-primary">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg text-yellow-600">
                            <Zap size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verbindungen</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{loading ? '-' : activeAutomations}</div>
                    <p className="text-sm text-gray-500 mt-1">Clients mit Webhook Setup</p>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-brand-primary">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg text-blue-600">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">System</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">v1.1</div>
                    <p className="text-sm text-gray-500 mt-1">Stable Release</p>
                </div>
            </div>

            {/* Recent Clients / Quick Access */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-federo text-gray-800">Schnellzugriff: Kunden</h3>
                    <Link to="/clients" className="text-sm text-brand-primary-dark hover:text-brand-primary flex items-center gap-1">
                        Alle anzeigen <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">Lade Daten...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {clients.slice(0, 5).map(client => (
                            <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold font-federo">
                                        {client.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{client.name}</div>
                                        <a href={client.website} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1">
                                            {client.website} <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        to="/clients"
                                        className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-brand-primary hover:text-black transition-colors"
                                    >
                                        Öffnen
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {clients.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                Keine Kunden gefunden. <Link to="/clients" className="text-brand-primary-dark underline">Jetzt anlegen</Link>.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
