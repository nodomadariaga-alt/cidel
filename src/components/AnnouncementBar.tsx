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

    // Mapeo de colores institucionales limpios y legibles
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
        <div className={`relative w-full py-2.5 px-8 text-center text-sm font-bold shadow-sm transition-all duration-300 ${getColorClasses(color)}`}>
            <p className="inline-block">{texto}</p>
            <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                title="Cerrar anuncio"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}