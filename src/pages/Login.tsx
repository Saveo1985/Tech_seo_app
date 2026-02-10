import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            // Force account selection to avoid auto-login loops with wrong accounts
            provider.setCustomParameters({ prompt: 'select_account' });

            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err: any) {
            console.error("Login Error:", err);
            // Friendly error mapping
            let msg = "Anmeldung fehlgeschlagen.";
            if (err.code === 'auth/popup-closed-by-user') msg = "Anmeldung wurde abgebrochen.";
            if (err.code === 'auth/popup-blocked') msg = "Popup wurde blockiert. Bitte erlauben.";
            if (err.code === 'auth/unauthorized-domain') msg = "Domain nicht autorisiert (Firebase Console prüfen).";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900 via-brand-primary to-gray-900 opacity-50"></div>

            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden z-10">
                {/* Header */}
                <div className="bg-gray-900 p-10 text-center relative">
                    <div className="absolute top-4 right-4">
                        <ShieldCheck className="text-brand-primary opacity-20" size={64} />
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-gray-800 rounded-full border border-gray-700 shadow-lg">
                            <Activity size={32} className="text-brand-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-federo text-white mb-2 tracking-wide">TECH SEO</h1>
                    <p className="text-gray-400 font-barlow text-sm uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                {/* Body */}
                <div className="p-10 space-y-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm border border-red-100 animate-pulse">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Bitte authentifizieren Sie sich mit Ihrem Google Unternehmenskonto.
                        </p>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-primary hover:bg-gray-50 font-bold py-4 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-primary rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Mit Google anmelden</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <div className="text-[10px] text-gray-400 font-mono">
                        SECURE CONNECTION • 2H WEB SOLUTIONS v1.1
                    </div>
                </div>
            </div>
        </div>
    );
}
