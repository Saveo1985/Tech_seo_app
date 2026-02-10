import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Globe, Zap, Activity, Play, Loader2 } from 'lucide-react';
import { Client } from '../types';
import { getClients, saveClient, deleteClient } from '../lib/firestore-clients';
import { triggerWorkflow } from '../lib/n8n-service'; // Import service
import toast from 'react-hot-toast'; // Assuming we have toast for feedback

export function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState<string | null>(null); // To track which button is loading

    const emptyClient: Client = {
        id: '',
        name: '',
        website: '',
        wordpressUrl: '',
        n8nWebhookMeta: '',
        n8nWebhookAltText: '',
        seoMemory: {
            brand: '',
            tone: '',
            targetAudience: '',
            allowedCities: [],
            servicesTaxonomy: [],
            forbiddenTerms: [],
            uniqueSellingPoints: []
        },
        createdAt: null
    };

    const [currentClient, setCurrentClient] = useState<Client>(emptyClient);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (e) {
            console.error(e);
            toast.error("Fehler beim Laden der Kunden");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (client: Client) => {
        setCurrentClient(client);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentClient({ ...emptyClient, id: crypto.randomUUID() });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Diesen Kunden wirklich löschen?')) {
            await deleteClient(id);
            loadClients();
            toast.success("Kunde gelöscht");
        }
    };

    const handleSave = async () => {
        if (!currentClient.name) return toast.error('Name ist erforderlich');
        await saveClient(currentClient);
        setIsEditing(false);
        loadClients();
        toast.success("Kunde gespeichert");
    };

    const handleTrigger = async (client: Client, type: 'meta' | 'alt_text') => {
        const url = type === 'meta' ? client.n8nWebhookMeta : client.n8nWebhookAltText;
        const label = type === 'meta' ? "Meta Gen" : "Alt Text";

        if (!url) return toast.error(`Kein Webhook für ${label} hinterlegt.`);

        setTriggering(`${client.id}-${type}`);
        const result = await triggerWorkflow(url, client, type);
        setTriggering(null);

        if (result.success) {
            toast.success(`${label}: ${result.message}`);
        } else {
            toast.error(`${label}: ${result.message}`);
        }
    };

    // Helper for comma-separated inputs (Tags)
    const handleArrayInput = (field: keyof typeof currentClient.seoMemory, value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(s => s !== '');
        setCurrentClient(prev => ({
            ...prev,
            seoMemory: { ...prev.seoMemory, [field]: arr }
        }));
    };

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-federo text-brand-primary">
                        {currentClient.name ? `Edit: ${currentClient.name}` : 'Neuer Kunde'}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-200 hover:text-black transition-colors">Abbrechen</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-primary text-black font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2">
                            <Save size={18} /> Speichern
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 text-gray-800">
                        <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-brand-primary-dark" /> Basis & Verbindung
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Firmenname</label>
                            <input value={currentClient.name} onChange={e => setCurrentClient({ ...currentClient, name: e.target.value })} className="mt-1 w-full p-2 border rounded bg-gray-50" placeholder="z.B. Jumpin Prater" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Webseite</label>
                            <input value={currentClient.website} onChange={e => setCurrentClient({ ...currentClient, website: e.target.value })} className="mt-1 w-full p-2 border rounded bg-gray-50" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">WordPress API URL</label>
                            <input value={currentClient.wordpressUrl} onChange={e => setCurrentClient({ ...currentClient, wordpressUrl: e.target.value })} className="mt-1 w-full p-2 border rounded" placeholder="https://.../wp-json" />
                        </div>
                        <div className="pt-4 border-t mt-4">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><Zap size={14} className="text-yellow-600" /> n8n Webhook (Meta Gen)</label>
                            <input value={currentClient.n8nWebhookMeta} onChange={e => setCurrentClient({ ...currentClient, n8nWebhookMeta: e.target.value })} className="mt-1 w-full p-2 border rounded bg-gray-50 font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><Zap size={14} className="text-yellow-600" /> n8n Webhook (Alt Text)</label>
                            <input value={currentClient.n8nWebhookAltText} onChange={e => setCurrentClient({ ...currentClient, n8nWebhookAltText: e.target.value })} className="mt-1 w-full p-2 border rounded bg-gray-50 font-mono text-xs" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 text-gray-800">
                        <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-brand-primary-dark" /> SEO Global Memory
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700">Brand Name</label><input value={currentClient.seoMemory.brand} onChange={e => setCurrentClient({ ...currentClient, seoMemory: { ...currentClient.seoMemory, brand: e.target.value } })} className="mt-1 w-full p-2 border rounded bg-gray-50" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Tone of Voice</label><input value={currentClient.seoMemory.tone} onChange={e => setCurrentClient({ ...currentClient, seoMemory: { ...currentClient.seoMemory, tone: e.target.value } })} className="mt-1 w-full p-2 border rounded bg-gray-50" /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">Services (Komma-getrennt)</label><textarea value={currentClient.seoMemory.servicesTaxonomy.join(', ')} onChange={e => handleArrayInput('servicesTaxonomy', e.target.value)} className="mt-1 w-full p-2 border rounded h-20 bg-gray-50" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">USPs (Komma-getrennt)</label><textarea value={currentClient.seoMemory.uniqueSellingPoints.join(', ')} onChange={e => handleArrayInput('uniqueSellingPoints', e.target.value)} className="mt-1 w-full p-2 border rounded h-16 bg-gray-50" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Erlaubte Städte</label><input value={currentClient.seoMemory.allowedCities.join(', ')} onChange={e => handleArrayInput('allowedCities', e.target.value)} className="mt-1 w-full p-2 border rounded bg-gray-50" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Verbotene Begriffe</label><input value={currentClient.seoMemory.forbiddenTerms.join(', ')} onChange={e => handleArrayInput('forbiddenTerms', e.target.value)} className="mt-1 w-full p-2 border rounded text-red-600 bg-red-50" /></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-federo text-brand-primary">Kunden & Verbindungen</h1>
                <button onClick={handleCreate} className="bg-brand-primary text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 font-bold transition-transform active:scale-95">
                    <Plus size={20} /> Neuer Kunde
                </button>
            </div>

            {loading ? (
                <div className="text-white">Lade Daten...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <div key={client.id} className="bg-white rounded-lg shadow-lg p-6 relative group hover:shadow-xl transition-shadow border-t-4 border-brand-primary flex flex-col justify-between">
                            <div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(client)} className="p-1 text-gray-500 hover:text-blue-600"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(client.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                                </div>

                                <h3 className="text-xl font-bold font-federo text-gray-800 mb-1">{client.name}</h3>
                                <a href={client.website} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-brand-primary-dark flex items-center gap-1 mb-4">
                                    <Globe size={14} /> {client.website}
                                </a>

                                <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded border border-gray-100">
                                    <div className="flex justify-between">
                                        <span>Services:</span>
                                        <span className="font-medium text-gray-900">{client.seoMemory.servicesTaxonomy.length} definiert</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Automation:</span>
                                        <div className="flex gap-2">
                                            <Zap size={16} className={client.n8nWebhookMeta ? "text-green-500" : "text-gray-300"} title="Meta Gen" />
                                            <Zap size={16} className={client.n8nWebhookAltText ? "text-green-500" : "text-gray-300"} title="Alt Text" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <button
                                    disabled={!client.n8nWebhookMeta || triggering === `${client.id}-meta`}
                                    onClick={() => handleTrigger(client, 'meta')}
                                    className="py-2 px-3 bg-gray-900 text-white text-xs rounded hover:bg-brand-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {triggering === `${client.id}-meta` ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                                    Meta Gen
                                </button>
                                <button
                                    disabled={!client.n8nWebhookAltText || triggering === `${client.id}-alt_text`}
                                    onClick={() => handleTrigger(client, 'alt_text')}
                                    className="py-2 px-3 bg-gray-900 text-white text-xs rounded hover:bg-brand-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {triggering === `${client.id}-alt_text` ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                                    Alt Text
                                </button>
                            </div>
                        </div>
                    ))}

                    {clients.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg opacity-80">
                            Noch keine Kunden angelegt. Klicke auf "Neuer Kunde", um zu starten.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
