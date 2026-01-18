'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/Button';
import { useInbox } from '@/lib/hooks/useInbox';

export function Header() {
  const { data: session } = useSession();
  const { unreadCount } = useInbox();
  const router = useRouter();
  
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
            {session && (
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
            )}
            <Link
              href="/about"
              className="text-gray-700 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Sobre
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/submit')}
                >
                  Enviar Ideia
                </Button>
                <Link href="/profile">
                  <span className="text-gray-700 hover:text-violet-600 text-sm font-medium">
                    {session.user.name}
                  </span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

