import React, { useState } from 'react';
import { AnalysisService, ScanResult } from '@/services/analysisService';
import { Search, Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export const Scanner = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        try {
            const scanId = await AnalysisService.startScan(url);

            // Subscribe to updates
            AnalysisService.subscribeToScan(scanId, (data) => {
                setCurrentScan(data);
                if (data.status === 'completed' || data.status === 'failed') {
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* INPUT SECTION */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <h2 className="text-2xl font-serif text-brand-dark mb-2">Neuen SEO Scan starten</h2>
                <p className="text-gray-500 mb-6">Geben Sie die Ziel-URL ein, um eine technische Analyse zu starten.</p>

                <form onSubmit={handleScan} className="max-w-xl mx-auto flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="url"
                            required
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-primary text-brand-dark font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Scan'}
                    </button>
                </form>
            </div>

            {/* RESULTS SECTION */}
            {currentScan && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Ergebnisse für: {currentScan.url}</h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                    Status:
                                    <span className={clsx(
                                        "ml-2 font-bold uppercase",
                                        currentScan.status === 'completed' ? "text-green-600" :
                                            currentScan.status === 'failed' ? "text-red-600" :
                                                "text-blue-600"
                                    )}>
                                        {currentScan.status}
                                    </span>
                                </p>
                            </div>
                            {currentScan.score && (
                                <div className="text-center">
                                    <div className="text-3xl font-serif text-brand-dark">{currentScan.score}/100</div>
                                    <div className="text-xs text-gray-400 uppercase">Score</div>
                                </div>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {currentScan.status === 'pending' || currentScan.status === 'processing' ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                                    <p className="text-gray-600">Die KI analysiert die Seite...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Gefundene Probleme:</h4>
                                    {currentScan.issues && currentScan.issues.length > 0 ? (
                                        <ul className="space-y-2">
                                            {currentScan.issues.map((issue, idx) => (
                                                <li key={idx} className="flex items-start p-3 bg-red-50 text-red-700 rounded">
                                                    <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center p-4 bg-green-50 text-green-700 rounded">
                                            <CheckCircle className="w-5 h-5 mr-3" />
                                            Keine kritischen Fehler gefunden.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
