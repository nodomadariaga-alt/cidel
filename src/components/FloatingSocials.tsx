// ARCHIVO COMPLETO: src/components/FloatingSocials.tsx
"use client";

import { useState, useEffect } from 'react';

interface Props {
    whatsappNumber: string;
}

export default function FloatingSocials({ whatsappNumber }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Escucha si algún modal se abrió o cerró en la página
        const handleModalChange = (e: Event) => {
            const customEvent = e as CustomEvent<boolean>;
            setIsModalOpen(customEvent.detail);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('modal-change', handleModalChange);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('modal-change', handleModalChange);
        };
    }, []);

    const mensajeGeneral = encodeURIComponent("Me gustaría recibir más información sobre los cursos");
    const urlWhatsapp = `https://wa.me/${whatsappNumber}?text=${mensajeGeneral}`;

    return (
        <div
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 p-2 bg-white/90 backdrop-blur-md border border-r-0 border-gray-200 rounded-l-2xl shadow-lg transition-all duration-300 ${isVisible && !isModalOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
                }`}
        >
            {/* Instagram */}
            <a
                href="https://www.instagram.com/cidelgroup/"
                target="_blank"
                rel="noopener noreferrer"
                title="Síguenos en Instagram"
                className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-200"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            </a>

            {/* Facebook */}
            <a
                href="https://www.facebook.com/p/CIDEL-GROUP-100057242360817/"
                target="_blank"
                rel="noopener noreferrer"
                title="Síguenos en Facebook"
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            </a>

            {/* WhatsApp Genérico */}
            <a
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Consultanos por WhatsApp"
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.983 14.056.96 11.433.96c-5.44 0-9.865 4.37-9.869 9.8c-.001 1.76.463 3.478 1.347 4.996l-1.02 3.722 3.816-.987zm11.567-7.382c-.314-.156-1.854-.897-2.139-.997-.285-.101-.493-.156-.702.156-.21.312-.8.997-.98 1.208-.18.21-.36.234-.674.078-.314-.156-1.325-.48-2.526-1.532-.934-.82-1.564-1.834-1.748-2.145-.183-.311-.02-.479.137-.635.141-.14.314-.36.47-.54.156-.18.21-.311.314-.519.104-.207.052-.389-.026-.546-.078-.156-.702-1.656-.961-2.26-.253-.594-.51-.514-.702-.524-.18-.01-.389-.01-.597-.01-.208 0-.546.077-.831.383-.285.312-1.091 1.048-1.091 2.557 0 1.508 1.115 2.964 1.271 3.172.156.208 2.19 3.29 5.23 4.58.723.308 1.288.493 1.73.631.726.227 1.387.195 1.909.119.581-.085 1.854-.744 2.112-1.462.259-.717.259-1.332.181-1.462-.078-.13-.285-.208-.599-.364z" />
                </svg>
            </a>
        </div>
    );
}