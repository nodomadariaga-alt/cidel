// ARCHIVO COMPLETO: src/components/CategoryNav.tsx
"use client";

interface Props {
    categorias: string[];
}

export default function CategoryNav({ categorias }: Props) {
    const scrollToCategory = (categoria: string) => {
        if (!categoria) return;

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
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Versión Móvil: Menú Desplegable Nativo */}
                <div className="relative block sm:hidden">
                    <select
                        onChange={(e) => {
                            scrollToCategory(e.target.value);
                            // Resetea el selector visualmente para que vuelva a decir "Ir a un área..."
                            e.target.value = "";
                        }}
                        className="w-full appearance-none bg-gray-100 border border-gray-200 text-gray-800 text-sm font-bold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled>Ir a un área específica...</option>
                        {categorias.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {/* Icono de flecha para indicar que es un menú desplegable */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>

                {/* Versión PC/Tablet: Pastillas centradas que envuelven si falta espacio */}
                <div className="hidden sm:flex sm:justify-center sm:flex-wrap gap-3">
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