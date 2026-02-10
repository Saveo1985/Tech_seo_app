import React from 'react';
import { LayoutDashboard, Settings, ListTodo, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'SEO Scanner', icon: Search, path: '/scanner' },
    { label: 'Tasks', icon: ListTodo, path: '/tasks' },
    { label: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-dark text-white flex flex-col border-r border-gray-800 z-50">
            {/* TOP AREA */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                {/* Placeholder Icon/Logo */}
                <div className="h-8 w-8 bg-brand-primary rounded mr-3 opacity-80"></div>
                <h1 className="text-xl font-serif text-brand-primary tracking-wide">TECH SEO</h1>
            </div>

            {/* MIDDLE AREA: Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                'flex items-center px-3 py-3 rounded-lg transition-colors group',
                                isActive
                                    ? 'bg-white/10 text-brand-primary'
                                    : 'text-gray-400 hover:text-brand-primary hover:bg-white/5'
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* BOTTOM AREA */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    SYSTEM ONLINE
                </div>
            </div>
        </aside>
    );
};
