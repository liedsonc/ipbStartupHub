import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/lib/hooks/useToast';
import { InboxProvider } from '@/lib/hooks/useInbox';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Startup Hub IPB - Hub de Startups Universitário',
  description: 'Conecte estudantes, mentores e investidores para construir a próxima geração de startups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <ToastProvider>
          <InboxProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </InboxProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

