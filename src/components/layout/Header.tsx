'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { useInbox } from '@/lib/hooks/useInbox';

export function Header() {
  const { unreadCount } = useInbox();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-violet-600">Startup Hub IPB</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Explorar Ideias
            </Link>
            <Link
              href="/people"
              className="text-gray-700 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Pessoas
            </Link>
            <Link
              href="/inbox"
              className="relative text-gray-700 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Caixa de Entrada
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Sobre
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/submit">
              <Button variant="primary" size="sm">
                Enviar Ideia
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

