// ARCHIVO COMPLETO: src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

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
        <html lang="es">
            <body className="antialiased bg-gray-50 text-gray-900">
                {children}
            </body>
        </html>
    );
}