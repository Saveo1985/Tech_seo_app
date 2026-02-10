import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle } from 'lucide-react';

export const Header = ({ title }: { title: string }) => {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-brand-dark border-b border-gray-800 flex items-center justify-between px-8 z-40">
            <h2 className="text-xl font-serif text-white tracking-wide">{title}</h2>

            <div className="flex items-center gap-4">
                <div className="flex items-center text-gray-400 hover:text-brand-primary cursor-pointer transition-colors">
                    <span className="text-sm mr-2 hidden md:block">{user ? 'Admin' : 'Guest'}</span>
                    <UserCircle className="w-6 h-6" />
                </div>
            </div>
        </header>
    );
};
