import React from 'react';

interface CardProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

export function Card({ title, className = "", children }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col ${className}`}>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">{title}</h3>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
