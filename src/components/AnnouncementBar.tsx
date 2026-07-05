// ARCHIVO COMPLETO: src/components/AnnouncementBar.tsx
"use client";

import { useState } from 'react';

interface Props {
    texto: string;
    color: string;
}

export default function AnnouncementBar({ texto, color }: Props) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen || !texto) return null;

    const getColorClasses = (c: string) => {
        switch (c?.toLowerCase()) {
            case 'rojo': return 'bg-red-600 text-white';
            case 'verde': return 'bg-emerald-600 text-white';
            case 'azul': return 'bg-blue-600 text-white';
            case 'amarillo': return 'bg-amber-400 text-gray-900';
            default: return 'bg-emerald-600 text-white';
        }
    };

    return (
        <div className={`relative w-full py-3 px-10 text-center text-base sm:text-lg font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-3 ${getColorClasses(color)}`}>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="inline-block tracking-wide">{texto}</p>
            <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                title="Cerrar anuncio"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}