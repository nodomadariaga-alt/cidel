// ARCHIVO COMPLETO: src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';

// Configuración de las fuentes de Google
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'CIDEL - Capacitación Laboral',
    description: 'Cursos de capacitación laboral en múltiples rubros y oficios.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased bg-gray-50 text-gray-900 font-sans">
                {children}
            </body>
        </html>
    );
}