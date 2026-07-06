// ARCHIVO COMPLETO: src/components/CourseCard.tsx
"use client";

import { useState } from 'react';

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    imagen: string;
    activo: boolean;
    cartelTexto: string;
    cartelColor: string;
}

interface Props {
    curso: Curso;
    whatsappNumber: string;
}

export default function CourseCard({ curso, whatsappNumber }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mensajeWhatsapp = encodeURIComponent(
        `Me gustaría recibir más información sobre el curso ${curso.nombre}`
    );
    const urlWhatsapp = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsapp}`;

    const getBadgeColor = (color: string) => {
        switch (color?.toLowerCase()) {
            case 'rojo': return 'bg-red-500 text-white shadow-red-500/30';
            case 'verde': return 'bg-emerald-500 text-white shadow-emerald-500/30';
            case 'azul': return 'bg-blue-600 text-white shadow-blue-600/30';
            case 'amarillo': return 'bg-amber-400 text-gray-900 shadow-amber-400/30';
            default: return 'bg-gray-600 text-white shadow-gray-600/30';
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        window.dispatchEvent(new CustomEvent('modal-change', { detail: true }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.dispatchEvent(new CustomEvent('modal-change', { detail: false }));
    };

    return (
        <>
            {/* Se agregó group, hover:-translate-y-2, rounded-2xl y sombras difuminadas complejas */}
            <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2">
                <div>
                    <div className="relative h-52 w-full bg-white border-b border-gray-50 overflow-hidden">
                        {curso.imagen ? (
                            <img
                                src={curso.imagen}
                                alt={curso.nombre}
                                /* Se agregó la animación de zoom en la imagen al hacer hover */
                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                                Sin imagen de portada
                            </div>
                        )}
                    </div>

                    <div className="p-6 relative">
                        {curso.cartelTexto && (
                            <span className={`inline-block mb-4 px-3 py-1.5 text-[11px] font-extrabold rounded-full shadow-md tracking-widest uppercase ${getBadgeColor(curso.cartelColor)}`}>
                                {curso.cartelTexto}
                            </span>
                        )}

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                            {curso.nombre}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 whitespace-pre-line mb-4 leading-relaxed">
                            {curso.descripcion}
                        </p>
                        {curso.descripcion && curso.descripcion.length > 100 && (
                            <button
                                onClick={openModal}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold inline-flex items-center gap-1 group/btn"
                            >
                                Ver más detalles
                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <a
                        href={urlWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-600/30 focus:outline-none transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.983 14.056.96 11.433.96c-5.44 0-9.865 4.37-9.869 9.8c-.001 1.76.463 3.478 1.347 4.996l-1.02 3.722 3.816-.987zm11.567-7.382c-.314-.156-1.854-.897-2.139-.997-.285-.101-.493-.156-.702.156-.21.312-.8.997-.98 1.208-.18.21-.36.234-.674.078-.314-.156-1.325-.48-2.526-1.532-.934-.82-1.564-1.834-1.748-2.145-.183-.311-.02-.479.137-.635.141-.14.314-.36.47-.54.156-.18.21-.311.314-.519.104-.207.052-.389-.026-.546-.078-.156-.702-1.656-.961-2.26-.253-.594-.51-.514-.702-.524-.18-.01-.389-.01-.597-.01-.208 0-.546.077-.831.383-.285.312-1.091 1.048-1.091 2.557 0 1.508 1.115 2.964 1.271 3.172.156.208 2.19 3.29 5.23 4.58.723.308 1.288.493 1.73.631.726.227 1.387.195 1.909.119.581-.085 1.854-.744 2.112-1.462.259-.717.259-1.332.181-1.462-.078-.13-.285-.208-.599-.364z" />
                        </svg>
                        Consultar por WhatsApp
                    </a>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900 pr-4 leading-tight">{curso.nombre}</h2>
                            <button
                                onClick={closeModal}
                                className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {curso.imagen && (
                                <img
                                    src={curso.imagen}
                                    alt={curso.nombre}
                                    className="w-full h-64 sm:h-80 object-contain bg-white rounded-2xl mb-6 shadow-sm border border-gray-100 p-4"
                                />
                            )}
                            <div className="prose max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                                {curso.descripcion}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
                            <a
                                href={urlWhatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-600/30 transition-all duration-300"
                            >
                                Consultar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}