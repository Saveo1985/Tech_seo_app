import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
    const location = useLocation();

    // Simple title mapper based on route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/tasks': return 'Global Task Sync';
            case '/settings': return 'App Configuration';
            default: return 'Tech SEO App';
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col">
                <Header title={getPageTitle()} />

                <main className="flex-1 mt-16 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
