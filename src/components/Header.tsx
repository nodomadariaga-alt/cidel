// ARCHIVO COMPLETO: src/components/Header.tsx
"use client";

import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Se aumentó el umbral a 80px para evitar que el cambio de tamaño genere un bucle de rebote
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/60 transition-all duration-300 flex flex-col items-center justify-center ${isScrolled ? 'py-3 shadow-md' : 'py-5 sm:py-6'}`}>

            {/* Logo y Nombre */}
            <div className="flex items-center space-x-3 group cursor-pointer">
                <img
                    src="/logo.jpg"
                    alt="CIDEL Logo"
                    className={`w-auto rounded-md object-contain transition-all duration-300 ease-in-out ${isScrolled ? 'h-10 sm:h-12' : 'h-14 sm:h-16'}`}
                />
                <span className={`font-bold tracking-tight text-gray-800 font-[family-name:var(--font-outfit)] transition-all duration-300 ease-in-out ${isScrolled ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
                    CIDEL GROUP
                </span>
            </div>

            {/* Información adicional expandible */}
            <div
                className={`flex flex-col items-center text-center transition-all duration-300 ease-in-out origin-top ${isScrolled
                    ? 'max-h-0 opacity-0 mt-0 pointer-events-none invisible'
                    : 'max-h-40 opacity-100 mt-4 visible'
                    }`}
            >
                <p className="text-sm sm:text-base font-extrabold text-blue-700 uppercase tracking-widest bg-blue-50 px-4 py-1 rounded-full">
                    Cursás dos veces por mes de Abril a Octubre.
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-2">
                    Echeverría 134, Gral. Madariaga - Prov. Bs. As.
                </p>
            </div>

        </header>
    );
}