// ARCHIVO COMPLETO: src/components/CategoryNav.tsx
"use client";

import { useState } from 'react';

interface Props {
    categorias: string[];
}

export default function CategoryNav({ categorias }: Props) {
    const [active, setActive] = useState('');

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            // Se resta el tamaño del header sticky para que el título no quede tapado
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActive(id);
        }
    };

    return (
        <div className="w-full bg-white border-b border-gray-100 shadow-sm overflow-x-auto hide-scrollbar sticky top-[60px] sm:top-[72px] z-40">
            {/* Ocultamos la barra de scroll visualmente con Tailwind en un proyecto real, pero usamos overflow-x-auto nativo */}
            <div className="flex items-center sm:justify-center gap-3 px-4 py-4 min-w-max max-w-7xl mx-auto">
                {categorias.map((cat) => {
                    const id = cat.replace(/\s+/g, '-').toLowerCase();
                    return (
                        <button
                            key={cat}
                            onClick={() => scrollTo(id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${active === id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-700'
                                }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}