// ARCHIVO COMPLETO: src/app/page.tsx
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import CategoryNav from '@/components/CategoryNav';
import FloatingSocials from '@/components/FloatingSocials';

interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    imagen: string;
    activo: boolean;
}

async function getCursos(): Promise<Curso[]> {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) return [];

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=base`;

    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        const text = await res.text();

        const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const json = JSON.parse(jsonString);

        const rows = json.table.rows;

        return rows.map((row: any) => {
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
        console.error("Error al obtener los cursos:", error);
        return [];
    }
}

export default async function Page() {
    const cursos = await getCursos();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

    const categorias = cursos.reduce((acc: { [key: string]: Curso[] }, curso) => {
        if (!acc[curso.categoria]) {
            acc[curso.categoria] = [];
        }
        acc[curso.categoria].push(curso);
        return acc;
    }, {});

    const nombresCategorias = Object.keys(categorias);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">

            <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center shadow-sm relative z-50">
                <div className="flex items-center space-x-3">
                    <img
                        src="/logo.jpg"
                        alt="CIDEL Logo"
                        className="h-10 w-auto rounded-md object-contain"
                    />
                    <span className="font-bold text-xl tracking-tight text-gray-800 font-[family-name:var(--font-outfit)]">CIDEL</span>
                </div>
            </header>

            <section className="relative w-full h-[400px] sm:h-[450px]">
                <div className="absolute inset-0">
                    <img
                        src="/hero.jpg"
                        alt="Instalaciones o alumnos de CIDEL"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md font-[family-name:var(--font-outfit)]">
                        Impulsa tu futuro laboral
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-2xl drop-shadow-sm">
                        Capacitación integral en oficios y áreas administrativas. Elige tu curso, inscribite y da el siguiente paso en tu carrera profesional.
                    </p>
                </div>
            </section>

            <CategoryNav categorias={nombresCategorias} />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {cursos.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento.</p>
                    </div>
                ) : (
                    nombresCategorias.map((categoria) => (
                        <section key={categoria} id={categoria.replace(/\s+/g, '-').toLowerCase()} className="mb-16 pt-8 scroll-mt-20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-3 border-b-2 border-gray-100 uppercase tracking-wide inline-block font-[family-name:var(--font-outfit)]">
                                {categoria}
                            </h2>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {categorias[categoria].map((curso) => (
                                    <CourseCard
                                        key={curso.id}
                                        curso={curso}
                                        whatsappNumber={whatsappNumber}
                                    />
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            <FloatingSocials whatsappNumber={whatsappNumber} />

            <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">

                    {/* Columna 1: Logo y Copyright */}
                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src="/logo.jpg"
                            alt="CIDEL Logo"
                            className="h-12 w-auto rounded-md object-contain mb-4"
                        />
                        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} CIDEL.</p>
                        <p className="text-sm text-gray-500">Todos los derechos reservados.</p>
                    </div>

                    {/* Columna 2: Ubicación / Dirección con link exacto a GMaps */}
                    <div className="flex flex-col items-center md:items-center">
                        <a
                            href="https://maps.google.com/?q=Echeverría+134,+General+Juan+Madariaga,+Buenos+Aires"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver en Google Maps"
                            className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-8 h-8 text-red-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="text-center">
                                <p className="font-semibold text-gray-800">Sede</p>
                                <p className="text-sm text-gray-600">Echeverría 134</p>
                                <p className="text-xs text-gray-500">(entre Martínez Guerrero y Moreno)</p>
                                <p className="text-sm text-gray-600">Gral. Madariaga, Prov. Bs. As.</p>
                            </div>
                        </a>
                    </div>

                    {/* Columna 3: Redes Sociales y Desarrollo */}
                    <div className="flex flex-col items-center md:items-end h-full justify-center gap-4">
                        <div className="flex space-x-6">
                            <a href="https://www.instagram.com/cidelgroup/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/p/CIDEL-GROUP-100057242360817/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Seguinos en redes sociales</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}