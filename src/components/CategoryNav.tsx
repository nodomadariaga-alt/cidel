// ARCHIVO COMPLETO: src/components/CategoryNav.tsx
"use client";

interface Props {
    categorias: string[];
}

export default function CategoryNav({ categorias }: Props) {
    const scrollToCategory = (categoria: string) => {
        // Genera el mismo ID que usa la sección en page.tsx
        const id = categoria.replace(/\s+/g, '-').toLowerCase();
        const element = document.getElementById(id);

        if (element) {
            // Calcula la posición restando un margen para que el menú no tape el título
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (categorias.length === 0) return null;

    return (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Contenedor con scroll horizontal ocultando la barra nativa */}
                <div className="flex overflow-x-auto gap-3 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className="whitespace-nowrap px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-full transition-colors border border-gray-200 shadow-sm"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}