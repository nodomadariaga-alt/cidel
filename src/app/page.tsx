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

            <footer className="bg-white border-t border-gray-200 py-10 px-4 text-center">
                {/* Se eliminaron las clases grayscale y opacity-60 para que el logo se vea a color */}
                <img
                    src="/logo.jpg"
                    alt="CIDEL Logo"
                    className="h-12 w-auto rounded-md object-contain mx-auto mb-4"
                />
                <p className="text-sm text-gray-500 mb-1">&copy; {new Date().getFullYear()} CIDEL. Todos los derechos reservados.</p>
                <p className="text-sm font-medium text-gray-400 mb-6">Desarrollado por Nodo [Soluciones Digitales]</p>
                <div className="flex justify-center space-x-6">
                    <a href="https://www.instagram.com/cidelgroup/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 font-medium transition-colors">
                        Instagram
                    </a>
                    <a href="https://www.facebook.com/p/CIDEL-GROUP-100057242360817/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 font-medium transition-colors">
                        Facebook
                    </a>
                </div>
            </footer>
        </div>
    );
}