// ARCHIVO COMPLETO: src/app/page.tsx
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
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Encabezado Principal */}
            <header className="bg-white border-b border-gray-200 py-12 px-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    CIDEL
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Capacitación laboral y formación en múltiples rubros y oficios. Conocé nuestros cursos disponibles e inscribite directamente por WhatsApp.
                </p>
            </header>

            {/* Catálogo de Cursos */}
            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {cursos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento.</p>
                    </div>
                ) : (
                    Object.keys(categorias).map((categoria) => (
                        <section key={categoria} className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 uppercase tracking-wide">
                                {categoria}
                            </h2>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {categorias[categoria].map((curso) => {
                                    // Construcción del mensaje preescrito de WhatsApp
                                    const mensajeWhatsapp = encodeURIComponent(
                                        `Hola! Me interesaría más detalles sobre el curso ${curso.nombre}`
                                    );
                                    const urlWhatsapp = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsapp}`;

                                    return (
                                        <div
                                            key={curso.id}
                                            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div>
                                                {/* Contenedor de Imagen con fallback visual */}
                                                <div className="relative h-48 w-full bg-gray-100">
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
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {curso.nombre}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-4 whitespace-pre-line">
                                                        {curso.descripcion}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botón de Acción Directo a WhatsApp */}
                                            <div className="p-6 pt-0">
                                                <a
                                                    href={urlWhatsapp}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                >
                                                    {/* Icono básico de WhatsApp estructurado con SVG */}
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

            {/* Footer con Redes Sociales Secundarias */}
            <footer className="bg-white border-t border-gray-200 mt-24 py-8 px-4 text-center">
                <p className="text-sm text-gray-500 mb-4">&copy; {new Date().getFullYear()} CIDEL. Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-6">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                        Instagram
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        Facebook
                    </a>
                </div>
            </footer>
        </div>
    );
}