// ARCHIVO COMPLETO: src/app/page.tsx
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import CategoryNav from '@/components/CategoryNav';
import FloatingSocials from '@/components/FloatingSocials';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';

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

interface AnuncioInstitutional {
    texto: string;
    color: string;
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
                activo: isActivo,
                cartelTexto: row.c[6]?.v?.toString() || '',
                cartelColor: row.c[7]?.v?.toString() || 'gray'
            };
        }).filter((curso: Curso) => curso.activo && curso.nombre.trim() !== '');
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return [];
    }
}

async function getAnuncioInstitutional(): Promise<AnuncioInstitutional | null> {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) return null;

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=config`;

    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        const text = await res.text();

        const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const json = JSON.parse(jsonString);

        const rows = json.table.rows;
        if (!rows || rows.length === 0) return null;

        const activoValue = rows[0]?.c[2]?.v;
        const isActivo = activoValue === true || activoValue === 'TRUE' || activoValue === 'Yes';

        return {
            texto: rows[0]?.c[0]?.v?.toString() || '',
            color: rows[0]?.c[1]?.v?.toString() || 'verde',
            activo: isActivo
        };
    } catch (error) {
        console.warn("La pestaña 'config' no está disponible o está vacía.");
        return null;
    }
}

export default async function Page() {
    const cursos = await getCursos();
    const anuncio = await getAnuncioInstitutional();
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
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16 selection:bg-blue-600 selection:text-white">

            {anuncio && anuncio.activo && (
                <AnnouncementBar texto={anuncio.texto} color={anuncio.color} />
            )}

            {/* Nuevo componente Header extraído para manejar el estado de Scroll */}
            <Header />

            <section className="relative w-full h-[450px] sm:h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/hero.jpg"
                        alt="Instalaciones o alumnos de CIDEL"
                        className="w-full h-full object-cover"
                    />
                    {/* Filtro muchísimo más claro: solo un 40% de opacidad negra estática */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
                    {/* Sombra intensa aplicada directo al texto para que no se pierda en fondos claros */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl font-[family-name:var(--font-outfit)]">
                        Impulsá tu futuro laboral
                    </h1>
                    <p className="text-lg sm:text-xl text-white font-medium max-w-2xl leading-relaxed drop-shadow-lg">
                        Capacitación integral en oficios y áreas administrativas. Elegí tu curso, inscribite y da el siguiente paso en tu carrera profesional.
                    </p>
                </div>
            </section>

            <CategoryNav categorias={nombresCategorias} />

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {cursos.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento.</p>
                    </div>
                ) : (
                    nombresCategorias.map((categoria) => (
                        <section key={categoria} id={categoria.replace(/\s+/g, '-').toLowerCase()} className="mb-24 pt-20 scroll-mt-24">

                            <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-4">
                                <div className="w-2.5 h-9 bg-blue-600 rounded-full flex-shrink-0 shadow-sm shadow-blue-600/20"></div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-wider font-[family-name:var(--font-outfit)]">
                                    {categoria}
                                </h2>
                            </div>

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

            <footer className="bg-white border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center">

                    <div className="flex flex-col items-center justify-center">
                        <img
                            src="/logo.jpg"
                            alt="CIDEL Logo"
                            className="h-20 md:h-24 w-auto rounded-md object-contain mb-5"
                        />
                        <p className="text-sm text-gray-500">© {new Date().getFullYear()} CIDEL GROUP.</p>
                        <p className="text-sm text-gray-500">Todos los derechos reservados.</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <a
                            href="https://maps.google.com/?q=Echeverria+134,+General+Madariaga,+Buenos+Aires"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver en Google Maps"
                            className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
                        >
                            <div className="p-3 bg-red-50 text-red-500 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-900 mb-1">Sede Central</p>
                                <p className="text-sm text-gray-600">Echeverría 134</p>
                                <p className="text-xs text-gray-400 mt-0.5">(entre Martínez Guerrero y Moreno)</p>
                                <p className="text-sm text-gray-600">Gral. Madariaga, Prov. Bs. As.</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-5">
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">Seguinos en redes</p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/cidelgroup/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-500 hover:bg-pink-500 hover:text-white rounded-full transition-all duration-300">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/p/CIDEL-GROUP-100057242360817/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-default">Desarrollado por NODO [Soluciones Digitales]</p>
                </div>
            </footer>
        </div>
    );
}