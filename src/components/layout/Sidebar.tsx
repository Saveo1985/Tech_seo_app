import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Users, Activity } from 'lucide-react';

export function Sidebar() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/clients', label: 'Kunden / SEO', icon: Users },
        { path: '/tasks', label: 'Aufgaben', icon: CheckSquare },
        { path: '/settings', label: 'Einstellungen', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#101010] text-gray-400 flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-50">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <Activity className="text-brand-primary mr-3" />
                <h1 className="text-xl font-federo text-brand-primary tracking-wide">TECH SEO</h1>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-gray-800 text-brand-primary shadow-md'
                                : 'hover:bg-gray-900 hover:text-white'
                            }`}
                    >
                        <item.icon
                            size={20}
                            className={`mr-3 transition-colors ${isActive(item.path) ? 'text-brand-primary' : 'text-gray-500 group-hover:text-brand-primary'
                                }`}
                        />
                        <span className="font-medium font-barlow">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-500 font-mono">SYSTEM ONLINE</span>
                </div>
                <div className="text-[10px] text-gray-600 font-mono">
                    v1.1.0 - Client Module
                </div>
            </div>
        </aside>
    );
}
