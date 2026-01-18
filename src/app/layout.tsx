import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/lib/hooks/useToast';
import { InboxProvider } from '@/lib/hooks/useInbox';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Startup Hub',
  description: 'Conecte ideias com pessoas para construir a próxima geração de startups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-violet-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-violet-900/10 transition-colors">
        <ThemeProvider>
          <SessionProvider>
            <ToastProvider>
              <InboxProvider>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </InboxProvider>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

