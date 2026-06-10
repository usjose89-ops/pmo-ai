import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ChatWidget } from '@/components/advisor/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PMO AI - Construction SaaS',
    description: 'Gestión Inteligente de Proyectos de Construcción',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <AppShell>
                    {children}
                </AppShell>
            </body>
        </html>
    );
}
