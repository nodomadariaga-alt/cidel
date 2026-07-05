import Image from 'next/image';

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    imagen: string;
    activo: boolean;
}

// Función del lado del servidor para obtener y formatear los datos del Google Sheet
async function getCursos(): Promise<Curso[]> {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) return [];

    // Se solicita el formato JSON de la API de visualización de Google Sheets
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=base`;

    try {
        const res = await fetch(url, { next: { revalidate: 60 } }); // Revalida el caché cada 60 segundos
        const text = await res.text();

        // La respuesta de Google viene envuelta en una función de callback; extraemos el JSON puro
        const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const json = JSON.parse(jsonString);

        const rows = json.table.rows;

        return rows.map((row: any) => {
            // Mapeo seguro de columnas basado en el orden exacto de la base de datos (A=0, B=1, etc.)
            const activoValue = row.c[5]?.v;
            const isActivo = activoValue === true || activoValue === 'TRUE' || activoValue === 'Yes';

            return {
                id: row.c[0]?.v?.toString() || '',
                nombre: row.c[1]?.v?.toString() || '',
                descripcion: row.c[2]?.v?.toString() || '',
                categoria: row.c[3]?.v?.toString() || 'Otros',
                imagen: row.c[4]?.v?.toString() || '',
                activo: isActivo
            };
        }).filter((curso: Curso) => curso.activo && curso.nombre.trim() !== '');
    } catch (error) {
        console.error("Error al obtener los cursos de Google Sheets:", error);
        return [];
    }
}

export default async function Page() {
    const cursos = await getCursos();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

    // Agrupar los cursos por categoría de forma dinámica
    const categorias = cursos.reduce((acc: { [key: string]: Curso[] }, curso) => {
        if (!acc[curso.categoria]) {
            acc[curso.categoria] = [];
        }
        acc[curso.categoria].push(curso);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            {/* Header / Navegación */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Image 
                            src="/logo.jpg" 
                            alt="CIDEL Logo" 
                            width={120} 
                            height={40} 
                            className="h-10 w-auto object-contain"
                            priority 
                        />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/hero.jpg" 
                        alt="Centro de Formación CIDEL" 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                    {/* Superposición oscura */}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Capacitación Laboral y Formación en Oficios
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200">
                        Conocé nuestros cursos disponibles e inscribite directamente para transformar tu futuro profesional.
                    </p>
                </div>
            </section>

            {/* Catálogo de Cursos */}
            <main className="flex-grow max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
                {cursos.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-lg font-medium">No hay cursos disponibles en este momento.</p>
                    </div>
                ) : (
                    Object.keys(categorias).map((categoria) => (
                        <section key={categoria} className="mb-16 last:mb-0">
                            <div className="flex items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                                    {categoria}
                                </h2>
                                <div className="ml-4 flex-grow h-px bg-gray-200"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {categorias[categoria].map((curso) => {
                                    const mensajeWhatsapp = encodeURIComponent(
                                        `Hola! Me interesaría más detalles sobre el curso ${curso.nombre}`
                                    );
                                    const urlWhatsapp = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsapp}`;

                                    return (
                                        <div
                                            key={curso.id}
                                            className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100"
                                        >
                                            <div className="flex flex-col flex-grow">
                                                {/* Contenedor de Imagen */}
                                                <div className="relative h-56 w-full bg-gray-100">
                                                    {curso.imagen ? (
                                                        <img
                                                            src={curso.imagen}
                                                            alt={curso.nombre}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                            Sin imagen de portada
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Textos del Curso */}
                                                <div className="p-6 flex-grow flex flex-col">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                                        {curso.nombre}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-line flex-grow">
                                                        {curso.descripcion}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botón de Acción Directo a WhatsApp */}
                                            <div className="p-6 pt-0 mt-auto">
                                                <a
                                                    href={urlWhatsapp}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
                                                >
                                                    <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.983 14.056.96 11.433.96c-5.44 0-9.865 4.37-9.869 9.8c-.001 1.76.463 3.478 1.347 4.996l-1.02 3.722 3.816-.987zm11.567-7.382c-.314-.156-1.854-.897-2.139-.997-.285-.101-.493-.156-.702.156-.21.312-.8.997-.98 1.208-.18.21-.36.234-.674.078-.314-.156-1.325-.48-2.526-1.532-.934-.82-1.564-1.834-1.748-2.145-.183-.311-.02-.479.137-.635.141-.14.314-.36.47-.54.156-.18.21-.311.314-.519.104-.207.052-.389-.026-.546-.078-.156-.702-1.656-.961-2.26-.253-.594-.51-.514-.702-.524-.18-.01-.389-.01-.597-.01-.208 0-.546.077-.831.383-.285.312-1.091 1.048-1.091 2.557 0 1.508 1.115 2.964 1.271 3.172.156.208 2.19 3.29 5.23 4.58.723.308 1.288.493 1.73.631.726.227 1.387.195 1.909.119.581-.085 1.854-.744 2.112-1.462.259-.717.259-1.332.181-1.462-.078-.13-.285-.208-.599-.364z" />
                                                    </svg>
                                                    Consultar sobre este curso
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto py-10 px-4 text-center">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} CIDEL. Todos los derechos reservados.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors font-medium text-sm">
                            Instagram
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-medium text-sm">
                            Facebook
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}